const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password, targetStack, targetCity, targetContractType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        targetStack,
        targetCity,
        targetContractType,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetStack: user.targetStack,
        targetCity: user.targetCity,
        targetContractType: user.targetContractType,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetStack: user.targetStack,
        targetCity: user.targetCity,
        targetContractType: user.targetContractType,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        targetStack: true,
        targetCity: true,
        targetContractType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, targetStack, targetCity, targetContractType } = req.body;

    // On construit l'objet de mise à jour uniquement avec les champs fournis
    // Si l'utilisateur n'envoie pas "name", on ne l'écrase pas avec undefined
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (targetStack !== undefined) dataToUpdate.targetStack = targetStack;
    if (targetCity !== undefined) dataToUpdate.targetCity = targetCity;
    if (targetContractType !== undefined) dataToUpdate.targetContractType = targetContractType;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        targetStack: true,
        targetCity: true,
        targetContractType: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  me,
  updateMe,
};
