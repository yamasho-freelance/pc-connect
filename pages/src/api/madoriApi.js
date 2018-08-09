import * as utils from "./../utils/convert-util"


const BASE_URL = "https://wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com/test/"
const THUMB_BASE_URL = "https://s3-ap-northeast-1.amazonaws.com/madori-cloud-system-storage-test/"

export function searchFiles(userid, keywords, users, sort, order, offsetKey, limit = 100) {

    return new Promise((resolve, reject) => {

        var jsonBody = {
            "userid": userid,
            "limit": limit
        }

        if (keywords) {
            jsonBody.keywords = keywords;
        }
        if (users && users.length > 0) {
            jsonBody.users = users;
        }
        if (sort) {
            jsonBody.sort = sort;
        }
        if (order) {
            jsonBody.sortDirection = order;
        }
        if (offsetKey) {
            jsonBody.offsetKey = offsetKey;
        }

        var options = {
            method: "POST",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(jsonBody)
        }

        fetch(BASE_URL + "search/files", options).then(res => {
            return res.json();
        }).then(res => {
            for (var i in res.Items) {
                var item = res.Items[i];
                item.dispLatest = utils.convertTimestampToDisplay(item.latest);
                item.dispSize = utils.convertToFileSize(item.size);
                item.filename = utils.getFilenameFromPath(item.filepath);
                item.downloadName = item.filename + "_" + item.latest + "." + item.ext;
                item.key = item.user_id + "/" + encodeURI(item.username) + "/" + encodeURI(item.filename) + "_" + item.latest + "." + item.ext;
                item.thumbnailPath = THUMB_BASE_URL + item.user_id + "/" + item.username + "/" + item.filename + "_" + item.latest + ".jpg"
                if (item.version) {
                    for (var j in item.version) {
                        var archiveItem = item.version[j];
                        archiveItem.parentKey = item.key;
                        archiveItem.key = item.user_id + "/" + encodeURI(item.username) + "/" + encodeURI(item.filename) + "_" + archiveItem.timestamp + "." + item.ext;
                        archiveItem.downloadName = item.filename + "_" + archiveItem.timestamp + "." + item.ext;
                        archiveItem.dispSize = utils.convertToFileSize(archiveItem.size);
                        archiveItem.dispLatest = utils.convertTimestampToDisplay(archiveItem.timestamp);
                        archiveItem.filename = item.filename;
                        archiveItem.thumbnailPath = THUMB_BASE_URL + item.user_id + "/" + item.username + "/" + item.filename + "_" + archiveItem.timestamp + ".jpg"
                    }
                    item.version.sort((a, b) => { return b.timestamp - a.timestamp });
                }
            }
            console.log(res);
            resolve(res);
        }).catch(err => {
            reject(err);
        });

    })
}

export function getUsers(userid) {

    return new Promise((resolve, reject) => {
        var options = {
            method: "GET",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        }

        fetch(BASE_URL + "storage/users?id=" + userid, options).then(res => {
            return res.json();
        }).then(res => {

            console.log(res);
            resolve(res.users);
        }).catch(err => {
            reject(err);
        })

    });
}

export function getBlob(key) {

    return new Promise(async (resolve, reject) => {

        var url = await getDownloadUrl(key);
        var options = {
            method: "GET"

        }

        fetch(url, options).then(res => {
            return res.blob();
        }).then(blob => {
            resolve(blob);
        }).catch(err => {
            reject(err);
        });
    });

}

export function getDownloadUrl(key) {

    return new Promise((resolve, reject) => {
        var options = {
            method: "GET",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        }

        fetch(BASE_URL + "download/url?key=" + key, options).then(res => {
            return res.json();
        }).then(res => {

            console.log(res);
            resolve(res.url);
        }).catch(err => {
            reject(err);
        })

    });
}

export function deleteFiles(key) {
    return new Promise((resolve, reject) => {


        var body = {
            "keyList": key
        }

        var options = {
            method: "DELETE",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        fetch(BASE_URL + "storage/files", options).then(res => {
            resolve();
        }).catch(err => {
            reject();
        })
    })
}

export function getStrageStatus(key) {
    return new Promise((resolve, reject) => {

        var options = {
            method: "GET",
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            },
        }

        fetch(BASE_URL + "storage/status2?id=" + key, options).then(res => {
            return res.json();
        }).then(res => {
            res.useRate = res.useRate * 100;
            res.capacity = utils.convertToFileSize(res.capacity);
            res.totalSize = utils.convertToFileSize(res.totalSize);
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}