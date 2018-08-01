'use strict';
var aws = require('aws-sdk');
var aws4 = require("aws4");
var https = require("https");

aws.config.region = 'ap-northeast-1';

module.exports.handler = async (event) => {

    var req = aws4.sign({region: 'ap-northeast-1', service: 's3', method: "GET", path: '/'+process.env.S3_BUCKET+'/'+process.env.SETTING_PAGE_PATH+'?X-Amz-Expires=12345&userid='+ event.id, signQuery: true });

    console.log(req);
    await request(req);
    var url = "https://"+req.hostname+req.path;
    return url;
};

function request(o) {

    return new Promise((resolve,reject)=>{
        var req = https.request(o, function (res) {
            console.log(res);
            res.on("data",(chunk)=>{
                console.log(chunk);
                resolve();
            });
            res.pipe(process.stdout);
            res.on("error",()=>{
                reject();
            });
            res.on("end",()=>{
                resolve();
            })

        }).end(o.body || '');
    
    });
   
}
