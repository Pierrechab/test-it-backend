//Importer les dépendances
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));

// Connecter la base de données
const mongoose = require("mongoose");
mongoose.connect(
	process.env.MONGODB_URI
		? process.env.MONGODB_URI
		: "mongodb://heroku_nj380ldn:pmsteqpn0ksi0qhgltst5kjtvd@ds151012.mlab.com:51012/heroku_nj380ldn",
	{ useNewUrlParser: true, useCreateIndex: true }
);

// Importer les routes
// Home
const homeRoutes = require("./parts/home.js");
app.use(homeRoutes);
// Connexion
const connexionRoutes = require("./parts/connexion.js");
app.use(connexionRoutes);
// offersRoutes
const offersRoutes = require("./parts/Offer.js");
app.use(offersRoutes);
// MyOffers
const MyOffersRoutes = require("./parts/MyOffers.js");
app.use(MyOffersRoutes);
// getOfferCompany
const getOfferCompany = require("./parts/getOfferCompany");
app.use(getOfferCompany);
// Publish
const publishRoutes = require("./parts/publish.js");
app.use(publishRoutes);
// Connexion
const connexionCompanyRoutes = require("./parts/connexionCompany.js");
app.use(connexionCompanyRoutes);
// Company Profile
const profileRoutes = require("./parts/profile.js");
app.use(profileRoutes);
// Category
const industryRoutes = require("./parts/category.js");
app.use(industryRoutes);

app.listen(process.env.PORT || 3000, function() {
	console.log("Server has started");
});
