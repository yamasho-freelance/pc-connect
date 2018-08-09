'use strict';
var aws = require('aws-sdk');

aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();

module.exports.handler = async (event) => {

    return await getUsers(event.authId);

};

async function getUsers(username) {
    return new Promise((resolve, reject) => {

        var params = {
            "Bucket": process.env.BUCKET_NAME,
            "Prefix": username + "/",
            "Delimiter": "/"
        }


        s3.listObjectsV2(params, async (err, data) => {

            if (err) {
                reject(err);
            } else {
                var results = null;
                if (data.CommonPrefixes.length > 0) {
                    results = data.CommonPrefixes.map((item) => { return item.Prefix.split("/")[1] });
                }
                resolve({ "users": results });
            }
        });
    });
}



