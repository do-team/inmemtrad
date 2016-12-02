// inmemtrad redis nodejs
var crypto = require("crypto");
var biguint = require('biguint-format');
var redis = require("redis");
var connection = process.env.IMTCONNECT;

console.log (connection);

switch (connection) {
    case "LOCALHOST":
        var client = redis.createClient();
        break;
    case "INTERNET":
        var client = redis.createClient(6379,'35.156.118.89'); // This will be parametrized via ENV VAR as well.
        break;
    case "SOCKET":
        var client = redis.createClient('/tmp/redis.sock');
        break;
    default:
        console.log('Environmental variable IMTCONNECT seems to be not set correctly (LOCALHOST, INTERNET or SOCKET), you will be not able to connect.');
}

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

// testing function

function randomPrice (qty) {
    return crypto.randomBytes(qty);
}
var rndPrc = biguint(randomPrice(1), 'dec');
console.log(rndPrc);

client.set("zkouska", rndPrc);
client.get("zkouska", function(err, reply) {
     console.log(reply);
     });

// end of test

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
