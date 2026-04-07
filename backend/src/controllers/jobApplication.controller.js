const prisma = require("../config/prisma");
const { createApplicationEvent } = require("../utils/applicationEvent.service");

const createApplication = async (req, res) => {
  try {
    const {
      company,
      title,
      location,
      country,
      workMode,
      contractType,
      salaryMin,
      salaryMax,
      currency,
      source,
      sourceUrl,
      rawOfferText,
      summary,
      experienceLevel,
      yearsExperience,
      status,
      priority,
      appliedAt,
      followUpAt,
      nextAction,
      notes,
      personalRating,
      fitScore,
    } = req.body;

    if (!company || !title) {
      return res.status(400).json({
        message: "Company and title are required",
      });
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: req.user.id,
        company,
        title,
        location,
        country,
        workMode,
        contractType,
        salaryMin,
        salaryMax,
        currency,
        source,
        sourceUrl,
        rawOfferText,
        summary,
        experienceLevel,
        yearsExperience,
        status,
        priority,
        appliedAt: appliedAt ? new Date(appliedAt) : null,
        followUpAt: followUpAt ? new Date(followUpAt) : null,
        nextAction,
        notes,
        personalRating,
        fitScore,
      },
    });

    await createApplicationEvent({
      applicationId: application.id,
      type: "CREATED",
      note: `Application created for ${application.company} - ${application.title}`,
    });

    return res.status(201).json({
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const {
      status,
      priority,
      company,
      search,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (company) {
      where.company = {
        contains: company,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        {
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "salaryMin",
      "salaryMax",
      "fitScore",
      "personalRating",
    ];

    const orderBy = allowedSortFields.includes(sort)
      ? { [sort]: order === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" };

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy,
    });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json({
      application,
    });
  } catch (error) {
    console.error("Get application by id error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const allowedFields = [
      "company",
      "title",
      "location",
      "country",
      "workMode",
      "contractType",
      "salaryMin",
      "salaryMax",
      "currency",
      "source",
      "sourceUrl",
      "rawOfferText",
      "summary",
      "experienceLevel",
      "yearsExperience",
      "status",
      "priority",
      "nextAction",
      "notes",
      "personalRating",
      "fitScore",
    ];

    const dataToUpdate = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        dataToUpdate[field] = req.body[field];
      }
    }

    if (req.body.appliedAt !== undefined) {
      dataToUpdate.appliedAt = req.body.appliedAt
        ? new Date(req.body.appliedAt)
        : null;
    }

    if (req.body.followUpAt !== undefined) {
      dataToUpdate.followUpAt = req.body.followUpAt
        ? new Date(req.body.followUpAt)
        : null;
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: dataToUpdate,
    });

    const eventsToCreate = [];

    if (
      req.body.status !== undefined &&
      req.body.status !== existingApplication.status
    ) {
      eventsToCreate.push({
        applicationId: id,
        type: "STATUS_CHANGED",
        oldValue: existingApplication.status,
        newValue: req.body.status,
        note: `Status changed from ${existingApplication.status} to ${req.body.status}`,
      });
    }

    if (
      req.body.notes !== undefined &&
      req.body.notes !== existingApplication.notes
    ) {
      eventsToCreate.push({
        applicationId: id,
        type: "NOTE_ADDED",
        oldValue: existingApplication.notes || null,
        newValue: req.body.notes || null,
        note: "Application notes were added or updated",
      });
    }

    const hasOtherChanges = Object.keys(dataToUpdate).some(
      (field) => field !== "status" && field !== "notes"
    );

    if (hasOtherChanges) {
      eventsToCreate.push({
        applicationId: id,
        type: "UPDATED",
        note: "Application updated",
      });
    }

    if (eventsToCreate.length > 0) {
      await prisma.applicationEvent.createMany({
        data: eventsToCreate,
      });
    }

    return res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    await prisma.jobApplication.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getApplicationEvents = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const events = await prisma.applicationEvent.findMany({
      where: {
        applicationId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get application events error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationEvents,
};