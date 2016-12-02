// inmemtrad redis nodejs
var crypto = require("crypto");
var biguint = require('biguint-format');

var redis = require("redis"),
    //client = redis.createClient(); //when running on localhost
    //client = redis.createClient('/tmp/redis.sock'); //when running on local unix socket (fastest possible)
    client = redis.createClient(6379,'35.156.118.89'); //when running remotely
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
