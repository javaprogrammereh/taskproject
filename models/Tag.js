const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const TagSchema = new Schema({
  title: { type: String, required: true },
  isTrend: { type: Boolean, required: true },
});
TagSchema.plugin(timestamps);
TagSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Tag", TagSchema);
