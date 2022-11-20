/*
  Warnings:

  - A unique constraint covering the columns `[gitlab_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gitlab_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_gitlab_id_key" ON "users"("gitlab_id");
