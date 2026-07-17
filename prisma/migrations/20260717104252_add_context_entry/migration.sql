-- CreateEnum
CREATE TYPE "entryType" AS ENUM ('DECISION', 'CONVETION', 'SNIPPET', 'TASK_STATUS');

-- CreateTable
CREATE TABLE "ContextEntry" (
    "id" SERIAL NOT NULL,
    "type" "entryType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ContextEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContextEntry" ADD CONSTRAINT "ContextEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
