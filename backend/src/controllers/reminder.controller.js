const prisma = require("../config/prisma");
const { createApplicationEvent } = require("../utils/applicationEvent.service");

// GET /api/reminders
// Récupère tous les reminders de l'utilisateur connecté
// On filtre via la relation : reminder → application → userId
const getReminders = async (req, res) => {
  try {
    const { status } = req.query; // optionnel : ?status=PENDING

    const reminders = await prisma.reminder.findMany({
      where: {
        application: { userId: req.user.id }, // vérifie la propriété via jointure
        ...(status && { status }), // ajoute le filtre status seulement s'il est fourni
      },
      include: {
        application: {
          select: { id: true, company: true, title: true },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return res.status(200).json({ reminders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// POST /api/reminders
// Crée un reminder pour une candidature spécifique
const createReminder = async (req, res) => {
  try {
    const { applicationId, title, dueDate, note } = req.body;

    if (!applicationId || !title || !dueDate) {
      return res.status(400).json({ message: "applicationId, title and dueDate are required" });
    }

    // Vérifier que la candidature appartient bien à l'utilisateur
    const application = await prisma.jobApplication.findFirst({
      where: { id: applicationId, userId: req.user.id },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const reminder = await prisma.reminder.create({
      data: { applicationId, title, dueDate: new Date(dueDate), note },
    });

    // On logue l'événement dans l'historique de la candidature
    await createApplicationEvent(applicationId, "REMINDER_CREATED", {
      note: `Reminder créé : "${title}" pour le ${dueDate}`,
    });

    return res.status(201).json({ reminder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// PUT /api/reminders/:id
// Met à jour un reminder (titre, date, statut, note)
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dueDate, status, note } = req.body;

    // Vérifier que le reminder appartient à l'utilisateur (via jointure)
    const existing = await prisma.reminder.findFirst({
      where: { id, application: { userId: req.user.id } },
    });

    if (!existing) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(status && { status }),
        ...(note !== undefined && { note }),
      },
    });

    // Si on marque comme DONE, on logue un événement spécial
    if (status === "DONE") {
      await createApplicationEvent(existing.applicationId, "REMINDER_DONE", {
        note: `Reminder complété : "${existing.title}"`,
      });
    }

    return res.status(200).json({ reminder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.reminder.findFirst({
      where: { id, application: { userId: req.user.id } },
    });

    if (!existing) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await prisma.reminder.delete({ where: { id } });

    return res.status(200).json({ message: "Reminder deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
