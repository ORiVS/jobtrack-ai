const prisma = require("../config/prisma");

// GET /api/technologies
// Retourne toutes les technologies connues (pas d'auth requise)
const getTechnologies = async (req, res) => {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ technologies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// POST /api/technologies
// Crée une techno si elle n'existe pas, sinon retourne l'existante
// "upsert" = update + insert en un seul appel atomique
const upsertTechnology = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const technology = await prisma.technology.upsert({
      where: { name: name.trim() },
      create: { name: name.trim() },
      update: {}, // si elle existe déjà, on ne change rien
    });

    return res.status(200).json({ technology });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getTechnologies, upsertTechnology };
