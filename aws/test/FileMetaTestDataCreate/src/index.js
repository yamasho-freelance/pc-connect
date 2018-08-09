'use strict';
var aws = require('aws-sdk');
var unzip = require("unzip");
var stream = require('stream');
require('date-utils');

aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    var taskList = [];
    var filenames = ["グランデージ都島", "ルネサンス東京", "ルミエール山本", "リーガルスイート本町"];

    for (var i = 0; i < 300; i++) {

        var randomKey = createRandamData(i);
        console.log("create: " + randomKey);
        taskList.push(saveFileMeta(randomKey));
    };

    await Promise.all(taskList).then(() => {
        return true;
    }).catch((err) => {
        throw (err);
    });

    async function saveFileMeta(key) {
        var fileObj = createMadoriFileObject(key);

        console.log(await putFileMeta(fileObj));

    }

    function putFileMeta(fileMeta) {

        return new Promise((resolve, reject) => {

            var params = {
                TableName: process.env.TABLE_NAME,
                Item: {
                    "user_id": fileMeta.userid,
                    "filepath": fileMeta.path,
                    "username": fileMeta.user,
                    "size": fileMeta.size,
                    "latest": fileMeta.timestamp,
                    "filename": fileMeta.filename,
                    "ext": fileMeta.ext
                }
            };

            if (fileMeta.version) {
                params.Item.version = fileMeta.version;
            }

            dynamo.put(params, (err, data) => {
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
        result.user = keyArray[0];
        result.size = getRandomInt(5000000, 20000000);
        result.path = keyArray.join("/");


        var versionCount = getRandomInt(0, 3);
        if (versionCount > 0) {
            result.version = [];
            for (var i = 0; i <= versionCount; i++) {
                var date = new Date();
                date.setMonth(-12);
                date.setDate(getRandomInt(0, 182));
                result.version.push({
                    size: getRandomInt(5000000, 20000000),
                    timestamp: date.toFormat("YYYYMMDDHH24MISS")
                });
            }
        }

        console.log(result);

        return result;

    }


    function createRandamData(i) {
        var date = new Date();
        date.setMonth(-6);
        date.setDate(getRandomInt(0, 182));
        return event.userid
            + "/" + event.userName[getRandomInt(0, event.userName.length - 1)]
            + "/" + filenames[getRandomInt(0, filenames.length)] + getRandomInt(0, 10000)
            + "_" + date.toFormat("YYYYMMDDHH24MISS") + event.ext;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

}



