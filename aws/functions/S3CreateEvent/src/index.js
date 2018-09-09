'use strict';
var aws = require('aws-sdk');
var unzip = require("unzipper");
var stream = require('stream');
var fs = require("fs");

aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {

    
    var item = event.Records[0];
    var decodeKey = decodeURIComponent(item.s3.object.key);
    console.log(decodeKey);

    await pickThumbnail(decodeKey);
    await saveFileMeta(decodeKey, item.s3.object.size);

    return true;


};

async function saveFileMeta(key, size) {
    var fileObj = createMadoriFileObject(key, size);
    var file = await getFileMeta(fileObj.userid, fileObj.path);

    var result = null;

    if (!file) {
        result = await putFileMeta(fileObj)
    } else {
        console.log(file)
        result = await updateFileMeta(fileObj, file.Item);
    }
    return result;
}


function getFileMeta(userid, filepath) {

    return new Promise((resolve, reject) => {

        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": userid,
                "filepath": filepath
            }
        };

        dynamo.get(params, (err, data) => {
            if (err) {

                console.log(err);
                reject(err);
            } else {
                console.log(data);
                if (Object.keys(data).length == 0) {
                    resolve(null);
                } else {
                    resolve(data);
                }
            }
        });
    });
}

function putFileMeta(fileMeta) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Item: {
                "user_id": fileMeta.userid,
                "filepath": fileMeta.path,
                "ext": fileMeta.ext,
                "latest": fileMeta.timestamp,
                "size": fileMeta.size,
                "filename": fileMeta.filename,
                "username": fileMeta.user,
                "search_filename": fileMeta.filename
            }
        };


        console.log("putFilemetaQuery");
        console.log(params);

        dynamo.put(params, (err, data) => {
            if (err) {
                reject(err);
            } else {

                console.log("ファイルデータ書き込み完了");
                resolve(data);
            }
        });
    });
}

function updateFileMeta(fileMeta, oldFileMeta) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                "user_id": fileMeta.userid,
                "filepath": fileMeta.path
            },
            ExpressionAttributeNames: {
                '#version': 'version',
                '#latest': 'latest',
                '#size': 'size',
            },
            ExpressionAttributeValues: {
                ':version': [{ "size": oldFileMeta.size, "timestamp": oldFileMeta.latest }],
                ':latest': fileMeta.timestamp,
                ':size': fileMeta.size
            },

        };
        if (!oldFileMeta.version) {
            params.UpdateExpression = 'SET #version = :version'
        } else {
            params.UpdateExpression = 'SET #version = list_append(#version, :version)'
        }

        params.UpdateExpression += ", #latest=:latest , #size = :size";


        console.log("updateFileMetaQuery");
        console.log(params);

        dynamo.update(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data);
                resolve(data);
            }
        });

    });

}



function createMadoriFileObject(key, size) {

    var result = {};

    var keyArray = key.split("/");
    var userid = keyArray.shift();
    var filenameAndTimeStamp = keyArray.pop();

    var filenameArray = filenameAndTimeStamp.split("_");
    var timestampAndExt = filenameArray.pop().split(".");
    var filename = filenameArray.join("_");
    var timestamp = timestampAndExt.shift();
    var ext = timestampAndExt.pop();

    keyArray.push(filename + "." + ext);

    result.userid = userid;
    result.filename = filename;
    result.timestamp = timestamp;
    result.ext = ext;
    result.path = keyArray.join("/");
    result.size = size;
    result.user = keyArray[0];

    console.log(result);

    return result;

}




async function pickThumbnail(key) {

    var stream = getFileStream(key);
    var thumbKey = key.replace(".mdzx", ".jpg");
    console.log(stream);
    return createThumbnail(stream, thumbKey);
}

function createThumbnail(fileStream, key) {
    return new Promise((resolve, reject) => {

        fileStream.on("error", err => {
            reject(err);
            console.log(err);
        });
        fileStream.pipe(unzip.Parse())
            .on("entry", (entry) => {
                console.log(entry.path);
                if (entry.path == process.env.THUMBNAIL_FILE_NAME) {

                    console.log("サムネイルを生成します");
                    console.log(key);

                    entry.buffer().then(content => {
                        console.log(content);
                        uploadS3(content, key).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        });
                    })

                }
                else {
                    entry.autodrain();
                }
            }).on("error", err => {
                console.log("-------------err---------------")
                console.log(err);   
                reject(err);
            })
    });
}


function uploadS3(stream, key) {

    return new Promise((resolve, reject) => {

        var params = {
            "Bucket": process.env.THUMBNAIL_BUCKET,
            "Key": key,
            "Body": stream,
            "ACL": "public-read",
            "ContentType": "image/jpg"
        }

        s3.putObject(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                console.log("サムネイルを生成完了");
                resolve(data);
            }
        });
    });
}

function getFileStream(key) {

    var params = {
        "Bucket": process.env.MADORI_BUCKET,
        "Key": key
    }


    return s3.getObject(params).createReadStream();

}



