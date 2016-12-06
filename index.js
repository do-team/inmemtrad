var redis = require("redis");
var connection = process.env.IMTCONNECT;

switch (connection) {
    case "LOCALHOST":
        var client = redis.createClient();
        break;
    case "INTERNET":
        var client = redis.createClient(6379, '35.156.118.89'); // This will be parametrized via ENV VAR as well.
        break;
    case "SOCKET":
        var client = redis.createClient('/tmp/redis.sock');
        break;
    default:
        console.log('Environmental variable IMTCONNECT seems to be not set correctly (LOCALHOST, INTERNET or SOCKET), you will be not able to connect.');
        return;
}

// if you'd like to select database 3, instead of 0 (default), call client.select(3, function() { /* ... */ });

client.on("error", function(err) {
    console.log("Error: " + err);
});

// List of items
var products = Array("wood", "gold", "fish", "wine");
var customers = Array("AUX1", "BFG2", "CRE3", "DRS4", "EFI5", "FRA6", "GOR1", "AAR1");
var ordertypes = Array("buy", "sell");

// Main function

function orderGenerator(cycles, callback) {

    // Randomiser
    var randomPrice = Math.floor((Math.random() * 98) + 1);
    var randomProduct = products[Math.floor(Math.random() * products.length)];
    var randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    var randomOrderType = ordertypes[Math.floor(Math.random() * ordertypes.length)];
    //console.log(randomCustomer + ' ' + randomOrderType + ' ' + randomProduct + ' ' + randomPrice);

    // Evaluation
    switch (randomOrderType) {
        case "buy":
            var redisKey = randomProduct + "-" + randomPrice + "-sell";
            client.lrange(redisKey, 0, 0, function(err, reply) {
                if (reply.length == 0) {
                    client.rpush(redisKey, randomCustomer);
                    console.log("New order inserted! " + redisKey +" " + randomCustomer)
                } else {
                    console.log("TRADE DETECTED! " + randomCustomer + " just bought " + redisKey + ", best offer by: " + reply + ". Removing from orderbook.");
                    client.lpop(redisKey)
                }

            });
            break;

        case "sell":
            var redisKey = randomProduct + "-" + randomPrice + "-buy";
            client.lrange(redisKey, 0, 0, function(err, reply) {
                if (reply.length == 0) {
                    client.rpush(redisKey, randomCustomer);
                    console.log("New order inserted! " + redisKey +" " + randomCustomer)
                } else {
                    console.log("TRADE DETECTED! " + randomCustomer + " just sold " + redisKey + ", best offer by: " + reply + ". Removing from orderbook.");
                    client.lpop(redisKey)
                }

            });
            break;
    }
}

// Main loop generating random orders

for (var cycles = 0; cycles < 10; cycles++) {
    orderGenerator(cycles, function(response) {
        console.log("cycles = " + this.cycles + " , response = " + response);
    }.bind({
        cycles: cycles
    }))
}
// End of loop

client.quit();