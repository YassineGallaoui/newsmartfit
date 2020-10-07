const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var conditionsSchema = new Schema({
	link : String,
	operator : String,
	type: String,
	value1 : String,
	value2 : String
  });

const ruleSchema = new Schema({
	name: String,
	athletesId: [String],
	conditions: [conditionsSchema],
	message: String
})

const rule = mongoose.model('rules', ruleSchema);

module.exports = rule;