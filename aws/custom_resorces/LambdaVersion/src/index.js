'use strict';
var aws = require('aws-sdk');
var uuidv4 = require('uuid/v4');
var lambda = new aws.Lambda();
aws.config.region = 'ap-northeast-1';


const SUCCESS = "SUCCESS";
const FAILED = "FAILED";

module.exports.handler = async (event, context) => {

    try {
        console.log(event);
        var props = event.ResourceProperties;
        var aliases = await GetAliases(props.FunctionName);
        var targetAlias = GetTargetAlias(aliases, props.Alias)

        if (event.RequestType == "Create" || event.RequestType == "Update") {

            await UpdateResourceConfig(props.FunctionName);

            var version = await PublishVersion(props.FunctionName);
            console.log("publishVersion:" + version)

            var aliasArn = null;

            if (targetAlias) {

                aliasArn = await UpdateAlias(props.FunctionName, version, props.Alias);
                await DeleteVersion(aliases, targetAlias, props.FunctionName)
            } else {
                aliasArn = await CreateAlias(props.FunctionName, version, props.Alias);
            }
            // var policy = await GetPolicy(props.FunctionName, props.Alias);
            // if (!policy) {
            //     await AddPermission(props.FunctionName, props.Alias, props.ApiArn)
            // }

            await cfnResponse(event, context, SUCCESS, { "AliasArn": aliasArn }, "PhysicalResourceID");

        } else {
            if (targetAlias) {
                await DeleteAlias(props.FunctionName, props.Alias);
                await DeleteVersion(aliases, targetAlias, props.FunctionName);
            }
            await cfnResponse(event, context, SUCCESS, { "AliasArn": aliasArn }, "PhysicalResourceID");
        }

    } catch (e) {
        console.log(e);
        await cfnResponse(event, context, FAILED, { "AliasArn": aliasArn }, "PhysicalResourceID");
    }
    return;
}

async function PublishVersion(functionName) {

    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: functionName
        }

        lambda.publishVersion(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("publisVersion Finished");
                console.log(data);
                resolve(data.Version);
            }
        })
    });

}


//確実にバージョンを発行するために環境変数を変更

async function GetCurrentConfig(functionName) {
    return new Promise((resolve, reject) => {

        var params = {
            FunctionName: functionName
        }
        lambda.getFunction(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("getFunction Finished");
                console.log(data);
                resolve(data.Configuration);
            }
        })
    })
}

async function UpdateResourceConfig(functionName) {

    var config = await GetCurrentConfig(functionName);

    return new Promise((resolve, reject) => {


        var params = {
            FunctionName: functionName,
        }

        config.Environment.Variables.DEPLOY_DATE = new Date().toString();
        params.Environment = config.Environment;

        lambda.updateFunctionConfiguration(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("updateFunctionConfiguration Finished");
                console.log(data);
                resolve(data);
            }
        })
    })
}


async function CreateAlias(functionName, version, alias) {

    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: functionName,
            Name: alias,
            FunctionVersion: version
        }

        lambda.createAlias(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("createAlias Finished");
                console.log(data);
                resolve(data.AliasArn);
            }
        })
    });

}



async function UpdateAlias(functionName, version, alias) {

    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: functionName,
            Name: alias,
            FunctionVersion: version
        }

        lambda.updateAlias(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("updateAlias Finished");
                console.log(data);
                resolve(data.AliasArn);
            }
        })
    });

}

async function GetAliases(functionName) {

    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: functionName
        }

        lambda.listAliases(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("listAliases Finished");
                console.log(data.Aliases);

                resolve(data.Aliases);
            }
        })
    });

}

function GetTargetAlias(aliases, alias) {
    return aliases.find(x => { return x.Name == alias })
}

function DeleteAlias(functionName, alias) {
    return new Promise((resolve, reject) => {

        var params = {
            FunctionName: functionName,
            Name: alias
        }

        lambda.deleteAlias(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("deleteAlias Finished");
                console.log(data);
                resolve(data);
            }
        })
    });
}

function AddPermission(functionName, alias, sorceArn) {

    return new Promise((resolve, reject) => {
        var params = {
            Action: 'lambda:InvokeFunction',
            FunctionName: functionName,
            Principal: 'apigateway.amazonaws.com',
            StatementId: uuidv4(),
            Qualifier: alias,
            SourceArn: sorceArn
        };

        lambda.addPermission(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("addPermission Finished");
                console.log(data);
                resolve(data);
            }
        })
    });
}

function GetPolicy(functionName, alias) {
    return new Promise((resolve, reject) => {
        var params = {
            FunctionName: functionName,
            Qualifier: alias
        }

        lambda.getPolicy(params, (err, data) => {
            if (err) {
                if (err.code == "ResourceNotFoundException") {
                    resolve(null);
                } else {
                    reject(err);
                }
            } else {
                console.log("getPolicy Finished");
                console.log(data);
                resolve(data);
            }
        });
    });
}

function DeleteVersion(aliases, alias, functionName) {
    return new Promise((resolve, reject) => {
        var sameVersionAlias = aliases.find(x => { return (x.FunctionVersion == alias.FunctionVersion && x.Name != alias.Name) });
        if (!sameVersionAlias) {
            var params = {
                FunctionName: functionName,
                Qualifier: alias.FunctionVersion
            }

            lambda.deleteFunction(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("deleteFunction Finished");
                    console.log(data);
                    resolve(data);
                }
            })
        }
        else {
            resolve();
        }
    });
}


var cfnResponse = function (event, context, responseStatus, responseData, physicalResourceId) {

    //PhysicalResourceIDが変更されるとリソース更新時に削除処理が走るため固定にする

    return new Promise((resolve, reject) => {

        var responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
            PhysicalResourceId: physicalResourceId || context.logStreamName,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: responseData
        });

        console.log("Response body:\n", responseBody);

        var https = require("https");
        var url = require("url");

        var parsedUrl = url.parse(event.ResponseURL);
        var options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "PUT",
            headers: {
                "content-type": "",
                "content-length": responseBody.length
            }
        };

        var request = https.request(options, function (response) {
            console.log("Status code: " + response.statusCode);
            console.log("Status message: " + response.statusMessage);
            context.done();
            resolve();
        });

        request.on("error", function (error) {
            console.log("send(..) failed executing https.request(..): " + error);
            context.done();
            reject();
        });

        request.write(responseBody);
        request.end();

    });
}

