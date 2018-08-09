'use strict';
var aws = require('aws-sdk');

aws.config.region = 'ap-northeast-1';
var dynamo = new aws.DynamoDB();
var dynamoDocument = new aws.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

    var indexName = getIndexName(event.sort);
    var offsetKeyAttributes = await getLocalSecondaryIndexSchema(indexName);
    var res = null;
    var result = {
        Items: []
    };

    event.indexName = indexName;


    var offsetKey = event.offsetKey;
    var resOffsetKey = null;
    for (; ;) {
        if (offsetKey) {
            res = await getFileMeta(event, offsetKey);
        }
        else {
            res = await getFileMeta(event);
        }

        var rem = event.limit - result.Items.length;
        result.Items = result.Items.concat(res.Items.slice(0, rem));
        offsetKey = res.LastEvaluatedKey;

        if (rem < res.Items.length) {
            var offsetItem = result.Items[result.Items.length - 1];
            resOffsetKey = {};
            console.log(offsetItem);
            for (var i in offsetKeyAttributes) {
                resOffsetKey[offsetKeyAttributes[i]] = offsetItem[offsetKeyAttributes[i]];
            }
        }

        if (!offsetKey || result.Items.length >= event.limit) {
            break;
        }

    }

    result.offsetKey = resOffsetKey;
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

function getLocalSecondaryIndexSchema(indexName) {

    return new Promise((resolve, reject) => {
        var params = {
            TableName: process.env.TABLE_NAME
        };

        dynamo.describeTable(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                var schema = [];
                for (var i in data.Table.KeySchema) {
                    schema.push(data.Table.KeySchema[i].AttributeName);
                }
                var lsi = data.Table.LocalSecondaryIndexes.filter(x => { return x.IndexName == indexName })[0];
                var rangeKey = lsi.KeySchema.filter(x => { return x.KeyType == "RANGE" })[0];
                schema.push(rangeKey.AttributeName);
                resolve(schema);
            }
        })
    });

}

function getIndexName(sortName) {

    var result = null;
    switch (sortName) {
        case "latest":
            result = process.env.LATEST_INDEX;
            break;
        case "size":
            result = process.env.SIZE_INDEX;
            break;
        case "filename":
            result = process.env.FILENAME_INDEX;
            break;
        case "username":
            result = process.env.USERNAME_INDEX;
            break;

        default:
            result = process.env.LATEST_INDEX;
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

        dynamoDocument.query(queryParams, (err, data) => {
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