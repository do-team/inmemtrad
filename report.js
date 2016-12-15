var AWS = require("aws-sdk");

// ARN: arn:aws:iam::322653911670:role/zu697-IMTdynamo
var params.RoleArn = 'arn:aws:iam::322653911670:role/zu697-IMTdynamo';
var sts = new AWS.STS();
sts.assumeRole(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

//AWS.config.update({
//  region: "eu-central-1",
//  endpoint: "https://dynamodb.eu-central-1.amazonaws.com",
//  aws_access_key_id: assumeRoleResult.AccessKeyId,
//  aws_secret_access_key: assumeRoleResult.SecretAccessKey
//});

//console.log(assumeRoleResult.AccessKeyId);
//console.log(assumeRoleResult.SecretAccessKey);
//
//var docClient = new AWS.DynamoDB.DocumentClient();
//
//var table = "IMTreports";
//
//var price = 200;
//var product = "gold";
//
//var params = {
//    TableName:table,
//    Item:{
//        "product": product,
//        "price": price,
//        "info":{
//            "plot": "Nothing happens at all.",
//            "rating": 0
//        }
//    }
//};
//
//console.log("Adding a new item...");
//docClient.put(params, function(err, data) {
//    if (err) {
//        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//    } else {
//        console.log("Added item:", JSON.stringify(data, null, 2));
//    }
//});