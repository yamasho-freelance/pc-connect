'use strict';
var aws = require('aws-sdk');
require('date-utils');
aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    var fileObjList = [];

    for (var i in event.Records) {
        fileObjList.push(createMadoriFileObject(event.Records[i].s3.object.key));
    }

    var filePathList = [];
    fileObjList.forEach(fileObj => {
        var path = fileObj.userid + "/" + fileObj.username;
        if (filePathList.indexOf(path) == -1) {
            filePathList.push(path);
        }
    });

    var task = [];
    filePathList.forEach(path => { task.push(deleteEmptyFolder(path)) });

    Promise.all(task).then(() => {
        return;
    }).catch(err => {
        throw err;
    })


};

function deleteEmptyFolder(path) {
    return new Promise((resolve, reject) => {

        var params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: path
        }

        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data.Contents.length == 0) {
                    var deleteParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: path
                    }

                    s3.deleteObject(deleteParams, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    })

                } else {
                    resolve();
                }
            }
        })
    })
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
    result.username = keyArray[0];
    result.filename = filename;
    result.timestamp = timestamp;
    result.ext = ext;
    result.path = keyArray.join("/");

    console.log(result);

    return result;

}


