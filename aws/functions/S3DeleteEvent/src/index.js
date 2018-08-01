'use strict';
var aws = require('aws-sdk');
require('date-utils');
aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    var item = event.Records[0];
    var key = item.s3.object.key;
    var fileObj = createMadoriFileObject(key);
    var fileMeta = await getFileMeta(fileObj.userid, fileObj.path);

    var result = null;
    var index = fileMeta.version.indexOf(fileObj.timestamp);

    if (index == -1) {
        throw ("存在しないバージョンのファイルを削除しようとしました");
    }
    else if (fileMeta.version.length == 1) {
        result = deleteFileMeta(fileObj)
    } else {
        result = removeFileVersion(fileObj, index);
    }
    return result;


};

function getFileMeta(userid, filepath) {

    return new Promise((resolve, reject) => {

        console.log("koko");
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": userid,
                "filepath": filepath
            }
        };

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

function deleteFileMeta(fileMeta) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": fileMeta.userid,
                "filepath": fileMeta.path
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

function removeFileVersion(fileMeta, removeIndex) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": fileMeta.userid,
                "filepath": fileMeta.path
            },
            ExpressionAttributeNames: {
                '#version': 'version'
            },
            UpdateExpression: 'REMOVE #version[' + removeIndex + ']'
        };

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
    var filename = filenameArray.shift();
    var timestampAndExt = filenameArray.pop().split(".");
    var timestamp = timestampAndExt.shift();
    var ext = timestampAndExt.pop();

    keyArray.push(filename + "." + ext);

    result.userid = userid;
    result.filename = filename;
    result.timestamp = timestamp;
    result.ext = ext;
    result.path = keyArray.join("/");

    console.log(result);

    return result;

}


