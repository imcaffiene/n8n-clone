/*
  Warnings:

  - Made the column `workFlowId` on table `Connection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Connection" ALTER COLUMN "workFlowId" SET NOT NULL;
