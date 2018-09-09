'use strict';
var aws = require('aws-sdk');

aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();

module.exports.handler = async (event, context) => {
    
    console.log(context);
    return await getURL(decodeURIComponent(event.key));

};

async function getURL(key) {
    console.log(key);
    return new Promise((resolve, reject) => {

        var params = {
            "Bucket": process.env.BUCKET_NAME,
            "Key": key
        }


        s3.getSignedUrl("getObject", params, async (err, data) => {

            if (err) {
                reject(err);
            } else {

                resolve({ "url": data });
            }
        });
    });
}



