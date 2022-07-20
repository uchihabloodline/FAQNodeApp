var express = require('express');
var app = express();
var fs = require('fs');
var ejs = require('ejs');

module.exports.home = async function (req, res) {
    console.log("inside home controller");
    try{
        fs.readFile('./views/faq.json', (err, data) => {
            if (err) throw err;
            var faqInfo = JSON.parse(data);
            faqInfo.sort(function (a, b) {
                return a["index"] - b["index"];
            });
            res.render("faq", {
                faqInfo: faqInfo
            });
        });
    }catch(err){
        console.log("ERROR in rendering home FAQ page--> ",err);
        return;
    }
}
// app.get('/', (req, res) => {
//     fs.readFile('./views/faq.json', (err, data) => {
//         if (err) throw err;
//         var faqInfo = JSON.parse(data);
//         faqInfo.sort(function (a, b) {
//             return a["index"] - b["index"];
//         });
//         res.render("faq", {
//             faqInfo: faqInfo
//         });
//     });
// });

//module.exports = app;