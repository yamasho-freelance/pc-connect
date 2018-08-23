import * as utils from "./../utils/convert-util"


const BASE_URL = "https://wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com/test/"
const THUMB_BASE_URL = "https://s3-ap-northeast-1.amazonaws.com/madori-cloud-system-storage-test/"

export default class madoriApi {

    constructor(token, refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }

    searchFiles(userid, keywords, users, sort, order, offsetKey, limit = 100) {

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

            this._request("search/files", options).then(res => {
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
    };

    getUsers(userid) {

        return new Promise((resolve, reject) => {
            var options = {
                method: "GET",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            }

            this._request("storage/users?id=" + userid, options).then(res => {
                resolve(res.users);
            }).catch(err => {
                reject(err);
            })

            // fetch(BASE_URL + , options).then(res => {
            //     return res.json();
            // }).then(res => {

            //     console.log(res);
            //     resolve(res.users);
            // }).catch(err => {
            //     reject(err);
            // })

        });
    }

    getBlob(key) {

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

    getDownloadUrl(key) {

        return new Promise((resolve, reject) => {
            var options = {
                method: "GET",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                }
            }

            this._request("download/url?key=" + key, options).then(res => {
                resolve(res.url);
            }).catch(err => {
                reject(err);
            });

            // fetch(BASE_URL + "download/url?key=" + key, options).then(res => {
            //     return res.json();
            // }).then(res => {

            //     console.log(res);
            //     resolve(res.url);
            // }).catch(err => {
            //     reject(err);
            // })

        });
    }

    deleteFiles(key) {
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

            this._request("storage/files", options).then(res => {
                resolve();
            }).catch(err => {
                reject();
            })

            // fetch(BASE_URL + "storage/files", options).then(res => {
            //     resolve();
            // }).catch(err => {
            //     reject();
            // })
        })
    }

    getStrageStatus(key) {
        return new Promise((resolve, reject) => {

            var options = {
                method: "GET",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                },
            }

            this._request("storage/status2?id=" + key, options).then(res => {
                res.useRate = res.useRate * 100;
                res.capacity = utils.convertToFileSize(res.capacity);
                res.totalSize = utils.convertToFileSize(res.totalSize);
                resolve(res);
            }).catch(err => {
                reject(err);
            });

            // fetch(BASE_URL + "storage/status2?id=" + key, options).then(res => {
            //     return res.json();
            // }).then(res => {
            //     res.useRate = res.useRate * 100;
            //     res.capacity = utils.convertToFileSize(res.capacity);
            //     res.totalSize = utils.convertToFileSize(res.totalSize);
            //     resolve(res);
            // }).catch(err => {
            //     reject(err);
            // })
        })
    }

    static _signIn(id, hash) {
        return new Promise((resolve, reject) => {

            var jsonBody = {
                id: id,
                hash: hash
            }

            var options = {
                method: "POST",
                mode: 'cors',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(jsonBody)
            }

            fetch(BASE_URL + "auth/login", options).then(res => {
                return res.json();
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    _request(path, options) {

        options.headers["Authorization"] = this.token;

        return fetch(BASE_URL + path, options).then(res => {
            if (!res.ok) {
                console.log("error");
            } else {
                return res.json();
            }
        })
    }

}




