'use strict';
var aws = require('aws-sdk');
var request = require('request');
var kmsUtil = require('./kms_util');
var error = require("./error");
var crypto = require("crypto");

aws.config.region = 'ap-northeast-1';


module.exports.handler = async (event) => {

    const TEMP_PASSWORD = "madori1234";

    //認証IDと暗号化された認証IDの妥当性をチェック
    var isValit = await isValidAuthId(event.authId, event.encryptAuthId).catch((err) => {
        throw new error.GeneralSrverError(err,"Authentication ID Invalid");
    });
    if (!isValit) {
        throw (new error.MadoriError("hash does not match id"));
    }

    //認証サーバからプラン情報を取得する
    var plan = await getPlan(event.authId).catch((err) => {
        if (err.code == "ENOTFOUND") {
            throw new error.MadoriError("Could not connect to authentication server");
        } else {
            throw new error.GeneralSrverError(err,"authentication server error");
        }
    });
    if (plan.STATE == "NG") {
        throw new error.MadoriError("Authentication with the web authentication server failed. Invalid authentication ID.");
    }

    var cog = new aws.CognitoIdentityServiceProvider();
    var userName = event.authId.split("-")[0];
    var user = await getUser(userName).catch((err) => {
        throw new error.GeneralSrverError(err,"Failure getUser");
    });

    if (!user) {
        user = await createUser(userName).catch((err) => {
            throw new error.GeneralSrverError(err,"Failure createUser");
        });
    }

    var pass = await createPassWord(userName).catch((err) => {  throw new error.GeneralSrverError(err,"Failure createPassWord"); });

    var response = await signIn(user, pass).catch((err) => {
        throw new error.GeneralSrverError(err,"Failure signIn");
    });

    await setPlan(plan, userName).catch((err) => {
        throw new error.GeneralSrverError(err,"Failure setPlan");
    });

    return response;

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

    async function createUser(username) {

        return new Promise((resolve, reject) => {

            var param = {
                "UserPoolId": process.env.USER_POOL_ID,
                "Username": username,
                "TemporaryPassword": TEMP_PASSWORD
            }

            cog.adminCreateUser(param, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.User);
                }
            })
        });
    }
    async function signIn(user, pass) {

        const AUTH_FLOW = "ADMIN_NO_SRP_AUTH";
        var isChangePassrowd = user.UserStatus == "FORCE_CHANGE_PASSWORD";

        var param = {
            "AuthFlow": AUTH_FLOW,
            "ClientId": process.env.CLIENT_ID,
            "UserPoolId": process.env.USER_POOL_ID,
            AuthParameters: {
                "USERNAME": user.Username
            }
        }

        if (isChangePassrowd) {
            param.AuthParameters.PASSWORD = TEMP_PASSWORD
        } else {
            param.AuthParameters.PASSWORD = pass;
            console.log(pass);
        }

        return new Promise((resolve, reject) => {
            cog.adminInitiateAuth(param, (err, data) => {
                if (err) {
                    reject(err);
                } else {

                    if (isChangePassrowd) {
                        var changePassParam = {
                            "ChallengeName": data.ChallengeName,
                            "ClientId": process.env.CLIENT_ID,
                            "UserPoolId": process.env.USER_POOL_ID,
                            "ChallengeResponses": {
                                "USERNAME": data.ChallengeParameters.USER_ID_FOR_SRP,
                                "NEW_PASSWORD": pass
                            },
                            "Session": data.Session,
                        }
                        cog.adminRespondToAuthChallenge(changePassParam, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(data);
                                resolve(data.AuthenticationResult);
                            }
                        })
                    }
                    else {
                        console.log(data);
                        resolve(data.AuthenticationResult);
                    }
                }
            });
        });
    }
    async function getPlan(authId) {

        return new Promise((resolve, reject) => {

            var options = {
                url: process.env.WEB_AUTH_URL,
                qs: {
                    "MODE": "CONF",
                    "SID": authId
                },
                method: 'GET'
            }
            //リクエスト送信
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log(response);
                    console.log("body" + body);
                    var plan = createPlanObjectFromResponse(body);
                    console.log(plan);
                    resolve(plan);
                }

            })
        });
    }
    async function setPlan(plan, username) {
        return new Promise((resolve, reject) => {
            var params = {
                UserAttributes: [
                    {
                        Name: 'custom:basic_count',
                        Value: plan.BSCONT
                    },
                    {
                        Name: 'custom:business_count',
                        Value: plan.BNCONT
                    }
                ],
                UserPoolId: process.env.USER_POOL_ID,
                Username: username
            };

            cog.adminUpdateUserAttributes(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    function createPlanObjectFromResponse(response) {
        var result = {};
        var resArray = response.split("&");
        resArray.forEach((item) => {
            var nameAndValue = item.split("=");
            var name = nameAndValue[0];
            var value = nameAndValue[1];
            result[name] = value;

        });
        return result;
    }
    async function isValidAuthId(plainAuthId, encryptAuthId) {

        return kmsUtil.authIdValidate(plainAuthId, encryptAuthId);

        console.log(result);
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

