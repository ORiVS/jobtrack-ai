-- CreateEnum
CREATE TYPE "public"."WorkMode" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "public"."ContractType" AS ENUM ('CDI', 'CDD', 'STAGE', 'ALTERNANCE', 'FREELANCE', 'INTERNSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('TO_ANALYZE', 'READY_TO_APPLY', 'APPLIED', 'FOLLOW_UP', 'HR_INTERVIEW', 'TECH_INTERVIEW', 'REJECTED', 'OFFER', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."ReminderStatus" AS ENUM ('PENDING', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'NOTE_ADDED', 'REMINDER_CREATED', 'REMINDER_DONE', 'AI_PARSED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "targetStack" TEXT,
    "targetCity" TEXT,
    "targetContractType" "public"."ContractType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "country" TEXT,
    "workMode" "public"."WorkMode",
    "contractType" "public"."ContractType",
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "currency" TEXT,
    "source" TEXT,
    "sourceUrl" TEXT,
    "rawOfferText" TEXT,
    "summary" TEXT,
    "experienceLevel" TEXT,
    "yearsExperience" INTEGER,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'TO_ANALYZE',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "appliedAt" TIMESTAMP(3),
    "followUpAt" TIMESTAMP(3),
    "nextAction" TEXT,
    "notes" TEXT,
    "personalRating" INTEGER,
    "fitScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobApplicationTechnology" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "JobApplicationTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reminder" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApplicationEvent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "JobApplication_userId_idx" ON "public"."JobApplication"("userId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "public"."JobApplication"("status");

-- CreateIndex
CREATE INDEX "JobApplication_company_idx" ON "public"."JobApplication"("company");

-- CreateIndex
CREATE INDEX "JobApplication_title_idx" ON "public"."JobApplication"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "public"."Technology"("name");

-- CreateIndex
CREATE INDEX "JobApplicationTechnology_applicationId_idx" ON "public"."JobApplicationTechnology"("applicationId");

-- CreateIndex
CREATE INDEX "JobApplicationTechnology_technologyId_idx" ON "public"."JobApplicationTechnology"("technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplicationTechnology_applicationId_technologyId_key" ON "public"."JobApplicationTechnology"("applicationId", "technologyId");

-- CreateIndex
CREATE INDEX "Reminder_applicationId_idx" ON "public"."Reminder"("applicationId");

-- CreateIndex
CREATE INDEX "Reminder_dueDate_idx" ON "public"."Reminder"("dueDate");

-- CreateIndex
CREATE INDEX "Reminder_status_idx" ON "public"."Reminder"("status");

-- CreateIndex
CREATE INDEX "ApplicationEvent_applicationId_idx" ON "public"."ApplicationEvent"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationEvent_type_idx" ON "public"."ApplicationEvent"("type");

-- CreateIndex
CREATE INDEX "ApplicationEvent_createdAt_idx" ON "public"."ApplicationEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplicationTechnology" ADD CONSTRAINT "JobApplicationTechnology_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplicationTechnology" ADD CONSTRAINT "JobApplicationTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "public"."Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationEvent" ADD CONSTRAINT "ApplicationEvent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
