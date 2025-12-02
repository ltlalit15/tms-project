const Audit = require("../models/audit.model");

module.exports = (action, module, referenceId, oldValue, newValue) => {
  return async (req, res, next) => {
    try {
      await Audit.create({
        userId: req.user.id,
        action,
        module,
        referenceId,
        oldValue,
        newValue,
      });
    } catch (error) {
      console.error("Audit save failed:", error);
    }
    next();
  };
};
