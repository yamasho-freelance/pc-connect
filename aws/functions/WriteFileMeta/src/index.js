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
    var file = await getFileMeta(fileObj.userid, fileObj.path);

    var result = null;

    if (!file) {
        result = putFileMeta(fileObj)
    } else {
        result = updateFileMeta(fileObj);
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
                    resolve(data);
                }
            }
        });
    });
}

function putFileMeta(fileMeta) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Item: {
                "user_id": fileMeta.userid,
                "filepath": fileMeta.path,
                "version": new Array(fileMeta.timestamp),
                "ext": fileMeta.ext
            }
        };

        dynamo.put(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function updateFileMeta(fileMeta) {

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
            ExpressionAttributeValues: {
                ':version': [fileMeta.timestamp]
            },
            UpdateExpression: 'SET #version = list_append(#version, :version)'
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


