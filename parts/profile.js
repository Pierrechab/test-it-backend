const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Company = require("../models/Company");

app.get("/get_company", function(req, res) {
	// console.log("toto", req.query.id);
	Company.findOne({
		_id: req.query.id
	}).exec(function(err, result) {
		// console.log(result);
		res.json(result);
	});
});

module.exports = app;
