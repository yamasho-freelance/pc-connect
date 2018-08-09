'use strict';
var aws = require('aws-sdk');
var unzip = require("unzip");
var stream = require('stream');

aws.config.region = 'ap-northeast-1';
var s3 = new aws.S3();
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    var taskList = [];
    var item = event.Records[0];
    var decodeKey = decodeURI(item.s3.object.key);
    console.log(decodeKey);

    taskList.push(pickThumbnail(decodeKey));
    taskList.push(saveFileMeta(decodeKey, item.s3.object.size));

    await Promise.all(taskList).then(() => {
        return true;
    }).catch((err) => {
        throw (err);
    });

};

async function saveFileMeta(key, size) {
    var fileObj = createMadoriFileObject(key, size);
    var file = await getFileMeta(fileObj.userid, fileObj.path);

    var result = null;

    if (!file) {
        result = putFileMeta(fileObj)
    } else {
        console.log(file)
        result = updateFileMeta(fileObj, file.Item);
    }
    return result;
}


function getFileMeta(userid, filepath) {

    return new Promise((resolve, reject) => {

        console.log("koko");
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
                "username": fileMeta.user
            }
        };

        dynamo.put(params, (err, data) => {
            if (err) {
                reject(err);
            } else {

                console.log(data);
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

        dynamo.update(params, (err, data) => {
            if (err) {
                reject(err);
            } else {

                console.log("kokokokokko");
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

    var file = await getFile(key);
    var thumbKey = key.replace(".mdzx", ".jpg");
    return createThumbnail(file.Body, thumbKey);
}

function createThumbnail(binary, key) {
    return new Promise((resolve, reject) => {


        var bufferStream = new stream.PassThrough();
        bufferStream.end(binary);
        bufferStream.pipe(unzip.Parse())
            .on("entry", async (entry) => {
                console.log(entry);
                if (entry.path == process.env.THUMBNAIL_FILE_NAME) {

                    console.log(key);

                    const transform = new stream.Transform({ transform(chunk, encoding, callback) { callback(null, chunk); } });

                    var bufs = new Array();

                    transform.on('data', (chunk) => {
                        bufs.push(chunk);
                    });
                    transform.on('end', async () => {
                        var thumbBinary = Buffer.concat(bufs);
                        uploadS3(thumbBinary, key).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        });
                    });

                    transform.on('error', (error) => {
                        reject(error);
                    });

                    entry.pipe(transform);
                }
                else {
                    entry.autodrain();
                }
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
                resolve(data);
            }
        });
    });
}

function getFile(key) {

    return new Promise((resolve, reject) => {

        var params = {
            "Bucket": process.env.MADORI_BUCKET,
            "Key": key
        }

        s3.getObject(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    });
}



