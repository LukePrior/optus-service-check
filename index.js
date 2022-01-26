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
    var result = {}
    var url0 = "https://www.optus.com.au/mcssapi/rp-webapp-9-common/qas/searchaddress";
    var data0 = {"ImplDoSearchAddressRequest":{"searchAddressTerm":address,"addressType":"Installation"}}
    postURL(url0, data0, function(response0) {
        response0 = JSON.parse(response0);
        var url1 = "https://www.optus.com.au/mcssapi/rp-webapp-9-common/sdp/manageAddress/retriveFormattedAddress";
        var data1 = {"ImplRetrieveFormattedAddrInput":{"addressType":"Physical","layout":"Service Address Layout","transactionID":response0.ImplQASAddressResponse.listOfMatchingAddresses[0].addressID}}
        result["Address"] = response0.ImplQASAddressResponse.listOfMatchingAddresses[0].addressEntry;
        result["Response0"] = JSON.stringify(response0);
        postURL(url1, data1, function(response1) {
            response1 = JSON.parse(response1);
            var url2 = "https://www.optus.com.au/mcssapi/rp-webapp-9-common/sdp/manageAddress/matchServiceableAddress";
            var data2 = response1;
            result["Response1"] = JSON.stringify(response1);
            postURL(url2, data2, function(response2) {
                response2 = JSON.parse(response2);
                var url3 = "https://www.optus.com.au/mcssapi/rp-webapp-9-common/sdp/matrix/check-service-coverage";
                var data3 = {"ImplCheckServiceCoverageInput":{}}
                result["Response2"] = JSON.stringify(response2);
                res.send(JSON.stringify(result));
            });
        });
    })
});

app.listen(3000);