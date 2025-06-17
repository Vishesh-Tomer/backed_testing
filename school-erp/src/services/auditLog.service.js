const { AuditLogModel } = require('../models/auditLog.model');

const logAction = async (action, performedBy, target, details, ipAddress, schoolId) => {
  await AuditLogModel.create({
    action,
    performedBy,
    target,
    details,
    ipAddress,
    schoolId,
  });
};

module.exports = {
  logAction,
};