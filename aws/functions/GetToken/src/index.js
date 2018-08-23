'use strict';
var aws = require('aws-sdk');
var request = require('request');
var kmsUtil = require('./kms_util');
var error = require("./error");
var crypto = require("crypto");

aws.config.region = 'ap-northeast-1';


module.exports.handler = async (event) => {

    //認証IDと暗号化された認証IDの妥当性をチェック
    var isValit = await isValidAuthId(event.authId, event.encryptAuthId).catch((err) => {
        throw new error.GeneralSrverError(err, "Authentication ID Invalid");
    });
    if (!isValit) {
        throw (new error.MadoriError("hash does not match id"));
    }

    var cog = new aws.CognitoIdentityServiceProvider();

    var pass = await createPassWord(event.authId).catch((err) => { throw new error.GeneralSrverError(err, "Failure createPassWord"); });

    var response = await signIn(event.authId, pass).catch((err) => {
        throw new error.GeneralSrverError(err, "Failure signIn");
    });


    return response;


    async function signIn(userid, pass) {

        const AUTH_FLOW = "ADMIN_NO_SRP_AUTH";


        var param = {
            "AuthFlow": AUTH_FLOW,
            "ClientId": process.env.CLIENT_ID,
            "UserPoolId": process.env.USER_POOL_ID,
            AuthParameters: {
                "USERNAME": userid
            }
        }

        param.AuthParameters.PASSWORD = pass;

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

    async function isValidAuthId(plainAuthId, encryptAuthId) {

        var id = await kmsUtil.decryptId(encryptAuthId);
        return plainAuthId == id.split("-")[0];
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


}

