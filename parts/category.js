const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Industry = require("../models/Industry");

app.get("/get_category", function(req, res) {
	// console.log("toto", req.query.id);
	Industry.find({}).exec(function(err, result) {
		// console.log(result);
		res.json(result);
	});
});

module.exports = app;
