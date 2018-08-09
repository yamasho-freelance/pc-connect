'use strict';
var aws = require('aws-sdk');

aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {

    var keyList = event.keyList.map(x => { return decodeURI(x) });
    var taskList = [deleteFiles(keyList), deleteThumbnails(keyList), deleteFileMeta(keyList)];

    await Promise.all(taskList).then(() => {
        return;
    }).catch(err => {
        throw err;
    });

};



function deleteFiles(keyList) {
    return new Promise((resolve, reject) => {

        var params = {
            "Bucket": process.env.MADORIDATA_BUCKET_NAME,
            "Delete": { "Objects": [] },

        }

        if (keyList && keyList.length > 0) {
            for (var i in keyList) {
                params.Delete.Objects.push({ "Key": keyList[i] });
            }

        }

        console.log(params);

        s3.deleteObjects(params, async (err, data) => {

            if (err) {
                reject(err);
            } else {
                console.log(params);
                resolve(data);
            }
        });
    });
}

function deleteThumbnails(keyList) {
    return new Promise((resolve, reject) => {

        var params = {
            "Bucket": process.env.THUMBNAIL_BUCKET_NAME,
            "Delete": { "Objects": [] },

        }

        if (keyList && keyList.length > 0) {
            for (var i in keyList) {
                params.Delete.Objects.push({ "Key": keyList[i].replace(".mdzx", ".jpg") });
            }
        }

        console.log(params);

        s3.deleteObjects(params, async (err, data) => {

            if (err) {
                reject(err);
            } else {

                console.log(data);
                resolve(data);
            }
        });
    });
}

function deleteFileMeta(keyList) {

    return new Promise(async (resolve, reject) => {

        var fileObjList = [];
        for (var i in keyList) {
            fileObjList.push(createMadoriFileObject(keyList[i]));
        }

        var fileMeta = await getFileMeta(fileObjList[0]).catch(err => {
            reject(err);
        });

        //最新版が含まれたいた場合はバージョンも全て削除
        if (fileObjList.find(x => { return x.timestamp == fileMeta.latest })) {

            deleteFileMetaOrign(fileMeta.user_id, fileMeta.filepath).then(data => {
                resolve(data);
            }).catch(err => {
                reject(data);
            });

        } else {

            var indexList = [];
            for (var i in fileObjList) {

                var index = fileMeta.version.findIndex(item => {
                    return item.timestamp == fileObjList[i].timestamp
                });
                if (index >= 0) {
                    indexList.push(index);
                }
            };

            console.log(indexList);

            deleteFileVersion(fileMeta.user_id, fileMeta.filepath, indexList).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        }
    });

}



function deleteFileMetaOrign(userid, path) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": userid,
                "filepath": path
            }
        };

        dynamo.delete(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function getFileMeta(fileMeta) {

    return new Promise((resolve, reject) => {

        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": fileMeta.userid,
                "filepath": fileMeta.path
            }
        };

        console.log("以下を検索");
        console.log(params);

        dynamo.get(params, (err, data) => {
            if (err) {

                console.log(err);
                reject(err);
            } else {
                console.log(data);
                if (Object.keys(data).length == 0) {
                    resolve(null);
                } else {
                    resolve(data.Item);
                }
            }
        });
    });
}

function deleteFileVersion(userid, path, removeIndexList) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": userid,
                "filepath": path
            },
            ExpressionAttributeNames: {
                '#version': 'version'
            },
            UpdateExpression: 'REMOVE '
        };

        for (var i in removeIndexList) {
            params.UpdateExpression += ', #version[' + removeIndexList[i] + ']';
        }

        //先頭のカンマを削除
        params.UpdateExpression = params.UpdateExpression.replace(",", "");

        console.log("deleteFileVersion query")
        console.log(params);

        dynamo.update(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });

}


function createMadoriFileObject(key) {

    var result = {};

    var keyArray = key.split("/");
    var userid = keyArray.shift();
    var filenameAndTimeStamp = keyArray.pop();

    var filenameArray = filenameAndTimeStamp.split("_");
    var timestampAndExt = filenameArray.pop().split(".");
    var filename = filenameArray.join("_");
    var timestamp = timestampAndExt.shift();
    var ext = timestampAndExt.pop();

    keyArray.push(filename + "." + ext);

    result.userid = userid;
    result.filename = filename;
    result.timestamp = timestamp;
    result.ext = ext;
    result.path = keyArray.join("/");
    result.user = keyArray[0];

    console.log(result);

    return result;

}
