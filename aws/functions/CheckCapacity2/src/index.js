'use strict';
var aws = require('aws-sdk');
var kmsUtil = require('./kms_util');
var error = require("./error");
var bytes = require("bytes");
var s3 = new aws.S3();
var cog = new aws.CognitoIdentityServiceProvider();

aws.config.region = 'ap-northeast-1';


module.exports.handler = async (event) => {

    console.log(event.authId);
    // var id = await kmsUtil.decryptId(event.authId).catch((err) => {
    //     throw new error.MadoriError("ID is Invalid");
    // });
    // var id = event.authId;
    var username = event.authId;
    var capacity = await getCapacity(username).catch((err) => {
        throw new error.GeneralSrverError(err, "Failure GetCapacity");
    });

    console.log("totalCapacity =" + capacity);

    var size = await getSize(username).catch((err) => {
        throw new error.GeneralSrverError(err, "Failure Get total size Of Bucket");
    });

    var useRate = size / capacity;

    console.log("useSize=" + size);
    console.log("useRate =" + useRate);

    var status = "allow";

    if (useRate > 1) {
        status = "deny";
    } else if (useRate > Number(process.env.WARNING_LIMIT)) {
        status = "warning"
    }
    else {
        status = "allow";
    }

    var res = {
        "status": status,
        "useRate": Math.floor(useRate * 1000) / 1000,
        "capacity": capacity,
        "totalSize": size
    }

    return res;

    async function getSize(username, nextContinuationToken, size = 0) {
        return new Promise((resolve, reject) => {

            var params = {
                "Bucket": process.env.BUCKET_NAME,
                "Prefix": username + "/"
            }

            if (nextContinuationToken) {
                params.ContinuationToken = nextContinuationToken;
            }

            s3.listObjectsV2(params, async (err, data) => {

                if (err) {
                    reject(err);
                } else {

                    data.Contents.forEach((item) => {
                        size += item.Size;
                        console.log(item);
                    });

                    if (data.IsTruncated) {
                        console.log(data.NextContinuationToken);
                        size = await getSize(username, data.NextContinuationToken, size);
                    }
                    resolve(size);
                }
            });
        });
    }

    async function getCapacity(username) {

        const BASIC_COUNT_FIELDNAME = "custom:basic_count";
        const BUSINESS_COUNT_FIELDNAME = "custom:business_count";

        var user = await getUser(username);
        var basicCount = 0;
        var businessCount = 0;

        user.UserAttributes.forEach((item) => {
            switch (item["Name"]) {
                case BASIC_COUNT_FIELDNAME:
                    basicCount = Number(item["Value"]);
                    break;
                case BUSINESS_COUNT_FIELDNAME:
                    businessCount = Number(item["Value"]);
                    break;
                default:
                    break;
            }
        });

        console.log("basicCount =" + basicCount);
        console.log("businessCount =" + businessCount);

        var basicCapacity = bytes(process.env.BASIC_CAPACITY);
        var businessCapacity = bytes(process.env.BUSINESS_CAPACITY);

        console.log("basicCapacity =" + basicCapacity);
        console.log("businessCapacity =" + businessCapacity);

        return basicCapacity * basicCount + businessCapacity * businessCount;

    }

    async function getUser(username) {


        return new Promise((resolve, reject) => {

            var param = {
                "UserPoolId": process.env.USER_POOL_ID,
                "Username": username
            }

            console.log(param);
            cog.adminGetUser(param, function (err, data) {
                if (err) {
                    if (err.code == "UserNotFoundException") {
                        resolve(null);
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    console.log(data);
                    resolve(data);
                }
            })
        });
    }

}



