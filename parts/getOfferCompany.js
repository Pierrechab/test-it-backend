const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");
const Company = require("../models/Company");

app.get("/get_offer_company", function(req, res) {
	// console.log("toto", req.query.id);
	const resultData = { offers: "", company: "" };
	Offer.find({
		company: req.query.id
	})
		.populate("listTesters")
		.populate("industry")
		.exec(function(err, result) {
			// console.log("offers", result);
			resultData.offers = result;
			// res.json(result);
			Company.findOne({
				_id: req.query.id
			}).exec(function(err, result) {
				// console.log(result);
				resultData.company = result.companyAccount;
				// res.json(result);
				// console.log(resultData);
				res.json(resultData);
			});
		});
});

app.get("/get_offer_listTesters/:id", function(req, res) {
	// console.log("toto", req.params.id);
	Offer.find({
		_id: req.params.id
	})
		.populate("listTesters")
		.exec(function(err, result) {
			// console.log("offers", result);
			res.json(result);
		});
});

module.exports = app;
