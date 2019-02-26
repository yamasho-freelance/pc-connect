'use strict';
var aws = require('aws-sdk');
var kmsUtil = require("./kms_util");
var error = require("./error");
require('date-utils');
aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();

module.exports.handler = async (event, context) => {
    
    console.log(context);
    var filename = addTimestamp(event.key);

    var postParam = {
        Bucket: process.env.S3_BUCKET,
        Fields: {

            'x-amz-meta-uuid': 'UUID',
        }
    }

    var username = event.username;
    filename = filename;

    var id = await kmsUtil.decryptId(event.authId).catch((err) => {
        throw new error.MadoriError("ID is Invalid");
    });
    var key = id.split("-")[0];
    if (username) {
        key += "/" + username;
    }
    key += "/" + filename;

    key = await replaceIllegalCharcters(key);

    postParam.Fields.key = key;


    var result = await createPresignedPost(postParam).catch((err) => {
        throw error.GeneralSrverError(err, "Failure createPresignedPost");
    });

    console.log(result);
    return result;
};

async function createPresignedPost(postParam) {

    return new Promise((resolve, reject) => {
        s3.createPresignedPost(postParam, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    });

}

function addTimestamp(filename) {
    var result = filename;

    var arrayOfFilename = filename.split("_");
    var lastOfStr = arrayOfFilename.pop();

    console.log("lastOfStr")
    console.log(lastOfStr)

    var arrayOfLastStr = lastOfStr.split(".");
    var ext = arrayOfLastStr.pop();
    var withoutExtStr = arrayOfLastStr.join(".");
    var now = new Date().toFormat("YYYYMMDDHH24MISS");


    //最後尾が日付の場合日付の付け替え
    if (!isDatetime(withoutExtStr)) {
        arrayOfFilename.push(withoutExtStr);
    }
    arrayOfFilename.push(now + "." + ext);
    result = arrayOfFilename.join("_");

    return result;
}

function isDatetime(dateString) {

    var result = true;
    if (dateString.length != 14) {
        result = false;
    }
    else {

        var year = Number(dateString.substring(0, 4));
        var month = Number(dateString.substring(4, 6)) - 1;
        var date = Number(dateString.substring(6, 8));
        var hour = Number(dateString.substring(8, 10));
        var minute = Number(dateString.substring(10, 12));
        var second = Number(dateString.substring(12, 14));

        if (!Date.validateYear(year)) {
            console.log("year");
            result = false;
        } else if (!Date.validateMonth(month)) {
            console.log("month");
            result = false;
        } else if (!Date.validateDay(date, year, month)) {
            result = false;
            console.log("day");
        } else if (!Date.validateHour(hour)) {
            result = false;
            console.log("hour");
        } else if (!Date.validateMinute(minute)) {
            result = false;
            console.log("minute");
        } else if (!Date.validateSecond(second)) {
            result = false;
            console.log("second");
        }
    }

    console.log("result = " + result);

    return result;
}

async function replaceIllegalCharcters(filekey) {

    var replacement = await getReplacement().catch(err => {
        throw err;
    });

    if (replacement) {
        for (var key in replacement) {

            var reg = new RegExp("\\" + key, "g");
            filekey = filekey.replace(reg, replacement[key]);
        }
    }

    return filekey;

}

function getReplacement() {

    return new Promise((resolve, reject) => {
        var params = {
            Bucket: process.env.SETTING_BUCKET,
            Key: process.env.REPLACEMENT_FILE_KEY
        }

        s3.getObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                var result = null;
                try {
                    result = JSON.parse(data.Body.toString());
                    console.log(result);
                } catch (e) {
                    reject(new Error("リプレイス文字列の取得に失敗しました"));
                }
                resolve(result);
            }
        })
    })

}