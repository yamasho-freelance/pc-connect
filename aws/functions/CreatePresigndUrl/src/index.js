'use strict';
var aws = require('aws-sdk');
var cfsign = require('aws-cloudfront-sign');
var kmsUtil = require("./kms_util");

aws.config.region = 'ap-northeast-1';

module.exports.handler = async (event, context) => {
    
    var id = await kmsUtil.decryptId(event.id);
    var userid = id.split("-")[0];
    var date = new Date();
    date.setHours(date.getHours() + 1);

    var signingParams = {
        keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
        privateKeyString: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
        expireTime: date.getTime()
    }

    var url = "https://" + process.env.DOMAIN + "/" + process.env.ROOT_PAGE + "?userid=" + userid + "&hash=" + encodeURIComponent(event.id);

    console.log(signingParams);

    var signedUrl = cfsign.getSignedUrl(url, signingParams);

    return signedUrl;
};
