const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaseSchema = new Schema({
    licenseplate: { type: String, required: true },
    information: { type: String, required: true },
    status: { type: Number, default: 0 }
});

module.exports = mongoose.models.Case || mongoose.model('Case', CaseSchema);
