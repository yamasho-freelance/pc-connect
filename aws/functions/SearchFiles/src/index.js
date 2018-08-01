'use strict';
var aws = require('aws-sdk');

aws.config.region = 'ap-northeast-1';
var dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    var indexName = getIndexName(event.sort);
    var res = null;
    var result = {
        Items: []
    };
    event.indexName = indexName;

    var offsetKey = event.offsetKey;
    for (; ;) {
        if (offsetKey) {
            res = await getFileMeta(event, offsetKey);
        }
        else {
            res = await getFileMeta(event);
        }

        var rem = event.limit - result.Items.length;
        offsetKey = res.LastEvaluatedKey;


        console.log(offsetKey);
        console.log("rem=" + rem);
        result.Items = result.Items.concat(res.Items.slice(0, rem));

        if (!offsetKey || result.Items.length >= event.limit) {
            break;
        }

    }

    result.offsetKey = offsetKey;
    if (result.offsetKey) {
        result.hasNext = true;
    } else {
        result.hasNext = false;
    }
    console.log("---------------" + result.Items.length);
    console.log(result.hasNext);
    console.log(result.offsetKey);

    return result;

};

function getIndexName(sortName) {

    var result = null;
    switch (sortName) {
        case "sort":
            result = process.env.SORT_UPDATE_INDEX;
            break;

        default:
            result = process.env.SORT_UPDATE_INDEX;
            break;
    }

    return result;
}

async function getFileMeta(params, lastEvaluatedKey) {

    return new Promise((resolve, reject) => {

        var queryParams = {
            TableName: process.env.TABLE_NAME,
            IndexName: params.indexName,
            KeyConditionExpression: "#user_id = :user_id",
            ExpressionAttributeNames: {
                "#user_id": "user_id"
            },
            ExpressionAttributeValues: {
                ":user_id": params.userid
            },
            FilterExpression: "",
            ScanIndexForward: getDirection(params.sortDirection),
            ReturnConsumedCapacity: "TOTAL",
            Limit: 1500
        }

        if (params.keywords && params.keywords.length) {

            queryParams.ExpressionAttributeNames["#filepath"] = "filepath"
            for (var index in params.keywords) {
                queryParams.ExpressionAttributeValues[":keyword" + index] = params.keywords[index];
                queryParams.FilterExpression += " AND contains(#filepath, :keyword" + index + ")";
            }
        }

        if (params.users && params.users.length > 0) {

            queryParams.ExpressionAttributeNames["#username"] = "username"
            var userAttributes = []
            for (var index in params.users) {
                queryParams.ExpressionAttributeValues[":users" + index] = params.users[index];
                userAttributes.push(":users" + index);
            }

            queryParams.FilterExpression += " AND #username IN (" + userAttributes.join(",") + ")";
        }

        if (queryParams.FilterExpression.length == 0) {
            delete queryParams.FilterExpression;
        } else {
            queryParams.FilterExpression = queryParams.FilterExpression.replace("AND", "");
        }

        if (lastEvaluatedKey) {
            queryParams.ExclusiveStartKey = lastEvaluatedKey
        }

        console.log(queryParams);

        dynamo.query(queryParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        })
    })

}

function getDirection(sortName) {
    return sortName == "asc"
}