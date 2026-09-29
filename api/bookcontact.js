const { handleEnquiry } = require('./enquiry');
module.exports = (req, res) => handleEnquiry(req, res, true);
