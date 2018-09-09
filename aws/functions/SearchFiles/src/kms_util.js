'use strict';
var aws = require('aws-sdk');
aws.config.region = 'ap-northeast-1';

exports.authIdValidate = async function (plainId, encryptId) {

    var result = false;

    var kms = new aws.KMS();
    console.log(encryptId);
    var decode = new Buffer(encryptId, 'base64');

    let params = {
        CiphertextBlob: decode
    };

    return new Promise((resolve, reject) => {
        kms.decrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                result = data.Plaintext.toString() == plainId;
                resolve(result);
            }
        })
    });

}

exports.decryptId = async function (encryptId) {

    var result = false;

    var kms = new aws.KMS();
    console.log(encryptId);
    var decode = new Buffer(encryptId, 'base64');

    let params = {
        CiphertextBlob: decode
    };

    return new Promise((resolve, reject) => {
        kms.decrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data);
                resolve(data.Plaintext.toString());
            }
        })
    });

}
