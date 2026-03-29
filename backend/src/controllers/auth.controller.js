const prisma = require("../config/prisma");

const register = async (req, res) => {
  try {
    const { name, email, password, targetStack, targetCity, targetContractType } = req.body;

    return res.status(200).json({
      message: "Register route is working",
      receivedData: {
        name,
        email,
        password,
        targetStack,
        targetCity,
        targetContractType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
};