// Standard API response helpers
module.exports = {
  success(res, data = null, message = 'OK', status = 200) {
    return res.status(status).json({ success: true, message, data });
  },

  error(res, error = null, message = 'Internal Server Error', status = 500) {
    const errMsg = error && error.message ? error.message : error;
    return res.status(status).json({ success: false, message, error: errMsg });
  },
};
