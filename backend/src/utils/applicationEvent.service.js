const prisma = require("../config/prisma");

const createApplicationEvent = async ({
  applicationId,
  type,
  oldValue = null,
  newValue = null,
  note = null,
}) => {
  return prisma.applicationEvent.create({
    data: {
      applicationId,
      type,
      oldValue,
      newValue,
      note,
    },
  });
};

module.exports = {
  createApplicationEvent,
};