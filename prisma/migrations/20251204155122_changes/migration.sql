/*
  Warnings:

  - You are about to drop the column `nodeId` on the `Connection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Connection" DROP CONSTRAINT "Connection_nodeId_fkey";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "nodeId";
