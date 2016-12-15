var redis = require("redis");

// Define amount of cycles
var maxcycles = process.env.IMTCYCLES;
if (!maxcycles) {
    maxcycles = 10;
}

// Create connection, depending on your environment
var connection = process.env.IMTCONNECT;
if (!connection) {
    connection = 'LOCALHOST';
}

var dbport = process.env.IMTDBPORT;
if (!dbport) {
    dbport = 6379;
}

var dbip = process.env.IMTDBIP;
if (!dbip) {
    dbip = '127.0.0.1';
}

switch (connection) {
    case "LOCALHOST":
        var client = redis.createClient();
        console.log('Connecting to localhost...')
        break;
    case "INTERNET":
        var client = redis.createClient(dbport, dbip); // This will be parametrized via ENV VAR as well.
        console.log('Connecting via internet to public port...')
        break;
    case "SOCKET":
        var client = redis.createClient('/tmp/redis.sock');
        console.log('Connecting to unix socket...')
        break;
    case "DOCKER":
        var client = redis.createClient(6379, 'redis');
        console.log('Connecting to Redis container...')
        break;
    default:
        console.log('Environmental variable IMTCONNECT seems to be not set correctly (LOCALHOST, INTERNET, DOCKER or SOCKET), you will be not able to connect.');
        return;
}

// If you'd like to select database 3, instead of 0 (default), call client.select(3, function() { /* ... */ });
client.on("error", function(err) {
    console.log("Error: " + err);
});

// List of items - products, customers, order types
var products = Array("wood", "gold", "fish", "wine");
var customers = Array("AUX1", "BFG2", "CRE3", "DRS4", "EFI5", "FRA6", "GOR1", "AAR1");
var ordertypes = Array("buy", "sell");

// Lambda requires handler being defined:
exports.handler = quitter();

// Main function
function orderGenerator(cycles, callback) {
    // Randomiser
    var randomPrice = Math.floor((Math.random() * 98) + 1);
    var randomProduct = products[Math.floor(Math.random() * products.length)];
    var randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    var randomOrderType = ordertypes[Math.floor(Math.random() * ordertypes.length)];
    // Evaluator
    switch (randomOrderType) {
        case "buy":
            var redisKey = randomProduct + "-" + randomPrice + "-sell";
            client.lrange(redisKey, 0, 0, function(err, reply) {
                //console.log(reply);
                if (reply.length === 0) {
                    var pushBuy = randomProduct + "-" + randomPrice + "-buy";
                    client.rpush(pushBuy, randomCustomer);
                    console.log("New order inserted! " + pushBuy + " " + randomCustomer);
                } else {
                    console.log("TRADE DETECTED! " + randomCustomer + " just traded " + redisKey + ", best offer by: " + reply + ". Removing from orderbook.");
                    client.lpop(redisKey);
                }
                quitter(); // To ensure client.quit at end of loop
            });
            break;
        case "sell":
            var redisKey = randomProduct + "-" + randomPrice + "-buy";
            client.lrange(redisKey, 0, 0, function(err, reply) {
                //console.log(reply);
                if (reply.length === 0) {
                    var pushSell = randomProduct + "-" + randomPrice + "-sell";
                    client.rpush(pushSell, randomCustomer);
                    console.log("New order inserted! " + pushSell + " " + randomCustomer);
                } else {
                    console.log("TRADE DETECTED! " + randomCustomer + " just traded " + redisKey + ", best offer by: " + reply + ". Removing from orderbook.");
                    client.lpop(redisKey);
                }
                quitter(); // To ensure client.quit at end of loop
            });
            break;
    }
}

// To ensure proper client.quit and context succeed at the end of program
var quitCycles = 0;

function quitter() {
    ++quitCycles;
    //console.log(quitCycles);
    if (quitCycles === maxcycles) {
        client.quit();
    }
}

// Main loop generating random orders
for (var cycles = 0; cycles < maxcycles; cycles++) {
    orderGenerator(cycles, function(response) {
        console.log("cycles = " + this.cycles + " , response = " + response);
    });
}