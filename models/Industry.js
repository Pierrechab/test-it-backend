const mongoose = require("mongoose");

const IndustrySchema = new mongoose.Schema({
	name: String,
	criterias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Criteria" }]
});
module.exports = mongoose.model("Industry", IndustrySchema, "industries");
