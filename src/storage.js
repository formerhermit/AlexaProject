/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    return {
        loadMessage: function (session, callback) {
            dynamodb.getItem({
                TableName: 'Messages',
                Key: {
                    ID: {
                        N: "1"
                    }
                }
            }, function (err, data) {
                var currentMessage;
                if (err) {
                    console.log(err, err.stack);
                    currentMessage = err.message;
                    session.attributes.currentMessage = currentMessage;
                    callback(currentMessage);
                } else if (data.Item === undefined) {
                    currentMessage = "Couldn't find message";
                    session.attributes.currentMessage = currentMessage;
                    callback(currentMessage);
                } else if (data.Item.Message === '') {
                    currentMessage = "Message was empty";
                    session.attributes.currentMessage = currentMessage;
                    //TODO Delete message
                    callback(currentMessage);
                } else {
                    console.log('get message from dynamodb=' + data.Item.Message.S);
                    currentMessage = data.Item.Message.S;
                    session.attributes.currentMessage = currentMessage;
                    callback(currentMessage);
                }
            });
        }
    };
})();
module.exports = storage;
