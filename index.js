var express = require("express");
var request = require('request');
var app = express();

function postURL(url, data, callback) {
    request.post({
        headers: {"Content-Type": "application/json"},
        url: url,
        body: JSON.stringify(data)
    }, function(error, response, body){
        return callback(body); 
    });
}

app.get("/check", (req, res) => {
    var address = req.query.address;
    var url = "https://www.optus.com.au/mcssapi/rp-webapp-9-common/qas/searchaddress";
    var data = {"ImplDoSearchAddressRequest":{"searchAddressTerm":address,"addressType":"Installation"}}
    postURL(url, data, function(response) {
        response = JSON.parse(response);
        console.log(JSON.stringify(response));
        res.send('Address: ' + response.ImplQASAddressResponse.listOfMatchingAddresses[0].addressEntry);
    })
});

app.listen(3000);