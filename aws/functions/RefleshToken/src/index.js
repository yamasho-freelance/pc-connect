'use strict';
var aws = require('aws-sdk');
var error = require("./error");
aws.config.region = 'ap-northeast-1';


module.exports.handler = async (event) => {

    
    var cog = new aws.CognitoIdentityServiceProvider();
    var response = await refleshToken(event.token).catch((err)=>{
        throw new error.GeneralSrverError(err,"Failed RefreshToken")
        
    });

    return response;

    async function refleshToken(token) {

        const AUTH_FLOW = "REFRESH_TOKEN_AUTH";

        var param = {
            "AuthFlow": AUTH_FLOW,
            "ClientId": process.env.CLIENT_ID,
            "UserPoolId": process.env.USER_POOL_ID,
            AuthParameters: {
                "REFRESH_TOKEN": token
            }
        }

        console.log(token);

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

}

