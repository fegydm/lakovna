/*
  Warnings:

  - You are about to drop the column `createdAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `stage_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDuration` on the `stage_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `stageId` on the `stage_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `stage_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the column `isRequired` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the column `positionX` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `stages` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `stageId` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `task_progress` table. All the data in the column will be lost.
  - You are about to drop the column `fromStage` on the `vehicle_history` table. All the data in the column will be lost.
  - You are about to drop the column `toStage` on the `vehicle_history` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `vehicle_history` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `vehicle_history` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `entryTime` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCompletion` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `positionX` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `stageId` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `trackingToken` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `actualCost` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `actualEnd` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `actualStart` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCost` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `plannedEnd` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `plannedStart` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the column `authMethod` on the `work_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `work_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `work_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `work_sessions` table. All the data in the column will be lost.
  - You are about to drop the `workers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stage_id,sequence]` on the table `stage_tasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicle_id,task_id]` on the table `task_progress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qr_code]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tracking_token]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicle_id]` on the table `work_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_number]` on the table `work_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage_id` to the `stage_tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `stage_tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_x` to the `stages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_y` to the `stages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `stages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage_id` to the `task_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_id` to the `task_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `task_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `task_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `vehicle_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - The required column `qr_code` was added to the `vehicles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `tracking_token` was added to the `vehicles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - The required column `order_number` was added to the `work_orders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `work_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `work_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auth_method` to the `work_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worker_id` to the `work_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."JoinRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."stage_tasks" DROP CONSTRAINT "stage_tasks_stageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_progress" DROP CONSTRAINT "task_progress_stageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_progress" DROP CONSTRAINT "task_progress_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_progress" DROP CONSTRAINT "task_progress_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_progress" DROP CONSTRAINT "task_progress_workerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vehicle_history" DROP CONSTRAINT "vehicle_history_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vehicle_history" DROP CONSTRAINT "vehicle_history_workerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vehicles" DROP CONSTRAINT "vehicles_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vehicles" DROP CONSTRAINT "vehicles_stageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."work_orders" DROP CONSTRAINT "work_orders_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."work_sessions" DROP CONSTRAINT "work_sessions_workerId_fkey";

-- DropIndex
DROP INDEX "public"."stage_tasks_stageId_sequence_key";

-- DropIndex
DROP INDEX "public"."task_progress_vehicleId_taskId_key";

-- DropIndex
DROP INDEX "public"."vehicles_qrCode_key";

-- DropIndex
DROP INDEX "public"."vehicles_trackingToken_key";

-- DropIndex
DROP INDEX "public"."work_orders_orderNumber_key";

-- DropIndex
DROP INDEX "public"."work_orders_vehicleId_key";

-- AlterTable
ALTER TABLE "public"."customers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."stage_tasks" DROP COLUMN "createdAt",
DROP COLUMN "estimatedDuration",
DROP COLUMN "stageId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimated_duration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "stage_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."stages" DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "isRequired",
DROP COLUMN "positionX",
DROP COLUMN "positionY",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "position_x" INTEGER NOT NULL,
ADD COLUMN     "position_y" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."task_progress" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "stageId",
DROP COLUMN "startedAt",
DROP COLUMN "taskId",
DROP COLUMN "updatedAt",
DROP COLUMN "vehicleId",
DROP COLUMN "workerId",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stage_id" INTEGER NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3),
ADD COLUMN     "task_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicle_id" TEXT NOT NULL,
ADD COLUMN     "worker_id" TEXT;

-- AlterTable
ALTER TABLE "public"."vehicle_history" DROP COLUMN "fromStage",
DROP COLUMN "toStage",
DROP COLUMN "vehicleId",
DROP COLUMN "workerId",
ADD COLUMN     "vehicle_id" TEXT NOT NULL,
ADD COLUMN     "worker_id" TEXT;

-- AlterTable
ALTER TABLE "public"."vehicles" DROP COLUMN "createdAt",
DROP COLUMN "customerId",
DROP COLUMN "entryTime",
DROP COLUMN "estimatedCompletion",
DROP COLUMN "positionX",
DROP COLUMN "positionY",
DROP COLUMN "qrCode",
DROP COLUMN "stageId",
DROP COLUMN "trackingToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "entry_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimated_completion" TIMESTAMP(3),
ADD COLUMN     "position_x" INTEGER,
ADD COLUMN     "position_y" INTEGER,
ADD COLUMN     "qr_code" TEXT NOT NULL,
ADD COLUMN     "stage_id" INTEGER,
ADD COLUMN     "tracking_token" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."work_orders" DROP COLUMN "actualCost",
DROP COLUMN "actualEnd",
DROP COLUMN "actualStart",
DROP COLUMN "createdAt",
DROP COLUMN "estimatedCost",
DROP COLUMN "orderNumber",
DROP COLUMN "plannedEnd",
DROP COLUMN "plannedStart",
DROP COLUMN "updatedAt",
DROP COLUMN "vehicleId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order_number" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicle_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."work_sessions" DROP COLUMN "authMethod",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "workerId",
ADD COLUMN     "auth_method" TEXT NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3),
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "worker_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."workers";

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vat_number" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Worker" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "google_id" TEXT,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "role" "public"."WorkerRole" NOT NULL DEFAULT 'WORKER',
    "rfid_tag" TEXT,
    "qr_code" TEXT,
    "usb_key_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memberships" (
    "workerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "public"."WorkerRole" NOT NULL DEFAULT 'WORKER',
    "status" "public"."MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("workerId","organizationId")
);

-- CreateTable
CREATE TABLE "public"."invitations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."WorkerRole" NOT NULL DEFAULT 'WORKER',
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."join_requests" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "status" "public"."JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_vat_number_key" ON "public"."Organization"("vat_number");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "public"."Worker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_google_id_key" ON "public"."Worker"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_rfid_tag_key" ON "public"."Worker"("rfid_tag");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_qr_code_key" ON "public"."Worker"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_usb_key_id_key" ON "public"."Worker"("usb_key_id");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "public"."invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_organization_id_email_key" ON "public"."invitations"("organization_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "join_requests_organization_id_worker_id_key" ON "public"."join_requests"("organization_id", "worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "public"."Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "stage_tasks_stage_id_sequence_key" ON "public"."stage_tasks"("stage_id", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "task_progress_vehicle_id_task_id_key" ON "public"."task_progress"("vehicle_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_qr_code_key" ON "public"."vehicles"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_tracking_token_key" ON "public"."vehicles"("tracking_token");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_vehicle_id_key" ON "public"."work_orders"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_order_number_key" ON "public"."work_orders"("order_number");

-- AddForeignKey
ALTER TABLE "public"."memberships" ADD CONSTRAINT "memberships_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."memberships" ADD CONSTRAINT "memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invitations" ADD CONSTRAINT "invitations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invitations" ADD CONSTRAINT "invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "public"."Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."join_requests" ADD CONSTRAINT "join_requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."join_requests" ADD CONSTRAINT "join_requests_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stage_tasks" ADD CONSTRAINT "stage_tasks_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."stage_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."work_orders" ADD CONSTRAINT "work_orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_history" ADD CONSTRAINT "vehicle_history_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_history" ADD CONSTRAINT "vehicle_history_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."work_sessions" ADD CONSTRAINT "work_sessions_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "public"."Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
