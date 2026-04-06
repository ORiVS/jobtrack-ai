const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password, targetStack, targetCity, targetContractType } = req.body;

    // 1. Vérification basique
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // 2. Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // 3. Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Création utilisateur
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

    // 5. Réponse (sans mot de passe)
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

module.exports = {
  register,
};