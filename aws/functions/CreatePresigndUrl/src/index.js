'use strict';
var aws = require('aws-sdk');
var cfsign = require('aws-cloudfront-sign');
var kmsUtil = require("./kms_util");
var crypto = require("crypto");

aws.config.region = 'ap-northeast-1';

module.exports.handler = async (event) => {

    var id = await kmsUtil.decryptId(event.id);
    var userid = id.split("-")[0];

    console.log(cookie);

    for (var cookieId in cookie) {
        url += "&" + cookieId + "=" + cookie[cookieId];
    }

    var pass = await createPassWord(userid);
    var credetional = await signIn(userid, pass);

    console.log(credetional);
    url += "&ac=" + credetional.IdToken;

    var signedUrl = cfsign.getSignedUrl(url, signingParams);


    return signedUrl;
};


async function signIn(id, pass) {


    var cog = new aws.CognitoIdentityServiceProvider();
    const AUTH_FLOW = "ADMIN_NO_SRP_AUTH";
    var param = {
        "AuthFlow": AUTH_FLOW,
        "ClientId": process.env.CLIENT_ID,
        "UserPoolId": process.env.USER_POOL_ID,
        AuthParameters: {
            "USERNAME": id
        }
    }

    param.AuthParameters.PASSWORD = pass;
    console.log(pass);


    return new Promise((resolve, reject) => {
        cog.adminInitiateAuth(param, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.AuthenticationResult);
            }
            });
            });
}

async function createPassWord(username) {

    const passowrd = process.env.PASS_KEY;
    var alg = 'aes256'
    var encoding = 'base64'

    var cipher = crypto.createCipher(alg, passowrd);
    var cipheredText = cipher.update(username, 'utf8', encoding);
    cipheredText += cipher.final(encoding);

    return cipheredText;
}
    console.log(credetional);
    url += "&ac=" + credetional.IdToken;

    var signedUrl = cfsign.getSignedUrl(url, signingParams);


    return signedUrl;
};


async function signIn(id, pass) {


    var cog = new aws.CognitoIdentityServiceProvider();
    const AUTH_FLOW = "ADMIN_NO_SRP_AUTH";
    var param = {
        "AuthFlow": AUTH_FLOW,
        "ClientId": process.env.CLIENT_ID,
        "UserPoolId": process.env.USER_POOL_ID,
        AuthParameters: {
            "USERNAME": id
        }
    }

    param.AuthParameters.PASSWORD = pass;
    console.log(pass);


    return new Promise((resolve, reject) => {
        cog.adminInitiateAuth(param, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.AuthenticationResult);
            }
        });
    });
}

async function createPassWord(username) {

    const passowrd = process.env.PASS_KEY;
    var alg = 'aes256'
    var encoding = 'base64'

    var cipher = crypto.createCipher(alg, passowrd);
    var cipheredText = cipher.update(username, 'utf8', encoding);
    cipheredText += cipher.final(encoding);

    return cipheredText;
}

