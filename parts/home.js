const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Offer = require("../models/Offer");

app.get("/home", function(req, res) {
	Offer.find({
		$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
		ageMax: { $gte: req.query.age },
		ageMin: { $lte: req.query.age }
	})
		.populate("company")
		.exec(function(err, result) {
			res.json(result);
		});
});

app.get("/home/with-count", function(req, res) {
	let filter = {};

	//filter = { industry.name : { $in: req.query.selectedCategories.split(" ")}}
	if (
		(req.query.online == "false" && req.query.physical == "false") ||
		(req.query.online == "true" && req.query.physical == "true")
	) {
		// console.log("ok");
		filter = {
			$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
			ageMax: { $gte: req.query.age },
			ageMin: { $lte: req.query.age }
		};
		if (
			(req.query.priceMin !== undefined && req.query.priceMin !== "") ||
			(req.query.priceMax !== undefined && req.query.priceMax !== "")
		) {
			filter.price = {};
			if (req.query.priceMin) {
				filter.price["$gte"] = req.query.priceMin;
			}
			if (req.query.priceMax) {
				filter.price["$lte"] = req.query.priceMax;
			}
		}
	} else {
		if (req.query.online === "true") {
			filter = {
				$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
				ageMax: { $gte: req.query.age },
				ageMin: { $lte: req.query.age },
				typeOffer: "Online"
			};
			if (
				(req.query.priceMin !== undefined && req.query.priceMin !== "") ||
				(req.query.priceMax !== undefined && req.query.priceMax !== "")
			) {
				filter.price = {};
				if (req.query.priceMin) {
					filter.price["$gte"] = req.query.priceMin;
				}
				if (req.query.priceMax) {
					filter.price["$lte"] = req.query.priceMax;
				}
			}
		} else {
			filter = {
				$or: [{ genderTarget: req.query.genderTarget }, { genderTarget: "" }],
				ageMax: { $gte: req.query.age },
				ageMin: { $lte: req.query.age },
				typeOffer: "Physique"
			};
			if (
				(req.query.priceMin !== undefined && req.query.priceMin !== "") ||
				(req.query.priceMax !== undefined && req.query.priceMax !== "")
			) {
				filter.price = {};
				if (req.query.priceMin) {
					filter.price["$gte"] = req.query.priceMin;
				}
				if (req.query.priceMax) {
					filter.price["$lte"] = req.query.priceMax;
				}
			}
		}
	}
	// if (req.query.selectedCategoryJoin) {
	// 	console.log(req.query.selectedCategoryJoin.split(" "));
	// 	filter.industry = {
	// 		$elemMatch: {
	// 			name:
	// 				"Cosmétique" /* { $in: req.query.selectedCategoryJoin.split(" ") } */
	// 		}
	// 	};
	// }

	// console.log(filter);

	Offer.count(filter, (err, count) => {
		// const query = Offer.find(filter).populate({
		// 	path: "creator",
		// 	select: "account"
		// });
		// console.log(filter);
		let query;
		if (req.query.selectedCategoryJoin) {
			query = Offer.find(filter)
				.populate("company")
				.populate({
					path: "industry",
					match: { name: { $in: req.query.selectedCategoryJoin.split(" ") } }
				});
		} else {
			query = Offer.find(filter)
				.populate("company")
				.populate("industry");
		}
		// .populate("industry", { match: { name: { $in: ["Food", "politics"] } } });
		// Offer.find(filter)
		// 	.populate("company")
		// 	// .populate("industry");
		// 	.populate({
		// 		path: "industry",
		// 		match: { name: { $in: ["Food"] } }
		// 	})
		// 	.exec(function(err, users) {
		// 		users.forEach(element => {
		// 			if (element.industry.length !== 0) {
		// 				console.log(element);
		// 			}
		// 		});
		// 		// users = users.filter(function(user) {
		// 		// 	console.log(user); // return only users with email matching 'type: "Gmail"' query
		// 		// });
		// 	});
		// console.log(query);
		// if (req.query.skip !== undefined) {
		// 	query.skip(parseInt(req.query.skip));
		// }
		// if (req.query.limit !== undefined) {
		// 	query.limit(parseInt(req.query.limit));
		// } else {
		// 	// valeur par défaut de la limite
		// 	query.limit(100);
		// }
		// let query = await results.lookup({
		// 	path: "industry",
		// 	query: { name: { $in: ["Food", "Music"] } }
		// });

		switch (req.query.sort) {
			case "Prix décroissants":
				query.sort({ price: -1 });
				break;
			case "Prix croissants":
				query.sort({ price: 1 });
				break;
			case "Les plus récentes":
				query.sort({ creationDate: 1 });
				break;
			case "date-asc":
				query.sort({ creationDate: 1 });
				break;
			case "date-asc":
				query.sort({ created: 1 });
				break;
			case "date-asc":
				query.sort({ created: 1 });
				break;
			default:
				query.sort({ creationDate: 1 });
				break;
		}

		query.exec((err, result) => {
			let offers;
			// console.log(req.query.selectedCategoryJoin);
			if (req.query.selectedCategoryJoin) {
				// console.log("yes");
				offers = [];
				result.forEach(element => {
					if (element.industry.length !== 0) {
						offers.push(element);
					}
				});
			} else {
				// console.log("no");
				offers = result;
			}
			if (!req.query.title) {
				res.json({ count, offers });
			} else {
				const regex = new RegExp(req.query.title.toLowerCase(), "g");
				const result1 = offers.filter(({ offerName }) => {
					return offerName.toLowerCase().match(regex);
				});
				const result2 = offers.filter(offer => {
					// company: {companyAccount:{ companyName}}})
					if (
						offer.company.companyAccount.companyName.toLowerCase().match(regex)
					) {
						return true;
					}
					return false;
				});
				function arrayUnique(array) {
					var a = array.concat();
					for (var i = 0; i < a.length; ++i) {
						for (var j = i + 1; j < a.length; ++j) {
							if (a[i] === a[j]) a.splice(j--, 1);
						}
					}

					return a;
				}
				// console.log("toto", result1.concat(result2));
				res.json({
					offers: arrayUnique(result1.concat(result2))
				});
			}
		});
	});
});

module.exports = app;
