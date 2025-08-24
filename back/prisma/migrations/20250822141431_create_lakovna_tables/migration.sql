-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('WAITING', 'MOVING', 'DELAYED', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'DELAYED');

-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."WorkerRole" AS ENUM ('ADMIN', 'MANAGER', 'WORKER', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."OrderPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."WorkOrderStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "color" TEXT,
    "year" INTEGER,
    "vin" TEXT,
    "customerId" TEXT NOT NULL,
    "stageId" INTEGER,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'WAITING',
    "positionX" INTEGER,
    "positionY" INTEGER,
    "qrCode" TEXT NOT NULL,
    "trackingToken" TEXT NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stage_tasks" (
    "id" SERIAL NOT NULL,
    "stageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "priority" "public"."TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "estimatedDuration" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stage_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_progress" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "stageId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "workerId" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."WorkerRole" NOT NULL DEFAULT 'WORKER',
    "rfidTag" TEXT,
    "qrCode" TEXT,
    "usbKeyId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."work_orders" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "description" TEXT,
    "priority" "public"."OrderPriority" NOT NULL DEFAULT 'NORMAL',
    "estimatedCost" DECIMAL(65,30),
    "actualCost" DECIMAL(65,30),
    "plannedStart" TIMESTAMP(3),
    "plannedEnd" TIMESTAMP(3),
    "actualStart" TIMESTAMP(3),
    "actualEnd" TIMESTAMP(3),
    "status" "public"."WorkOrderStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicle_history" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStage" INTEGER,
    "toStage" INTEGER,
    "details" JSONB,
    "workerId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."work_sessions" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "authMethod" TEXT NOT NULL,

    CONSTRAINT "work_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "public"."customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_registration_key" ON "public"."vehicles"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_key" ON "public"."vehicles"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_qrCode_key" ON "public"."vehicles"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_trackingToken_key" ON "public"."vehicles"("trackingToken");

-- CreateIndex
CREATE UNIQUE INDEX "stages_sequence_key" ON "public"."stages"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "stage_tasks_stageId_sequence_key" ON "public"."stage_tasks"("stageId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "task_progress_vehicleId_taskId_key" ON "public"."task_progress"("vehicleId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "workers_email_key" ON "public"."workers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workers_rfidTag_key" ON "public"."workers"("rfidTag");

-- CreateIndex
CREATE UNIQUE INDEX "workers_qrCode_key" ON "public"."workers"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "workers_usbKeyId_key" ON "public"."workers"("usbKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_vehicleId_key" ON "public"."work_orders"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_orderNumber_key" ON "public"."work_orders"("orderNumber");

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stage_tasks" ADD CONSTRAINT "stage_tasks_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."stage_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_progress" ADD CONSTRAINT "task_progress_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."work_orders" ADD CONSTRAINT "work_orders_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_history" ADD CONSTRAINT "vehicle_history_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_history" ADD CONSTRAINT "vehicle_history_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."work_sessions" ADD CONSTRAINT "work_sessions_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
