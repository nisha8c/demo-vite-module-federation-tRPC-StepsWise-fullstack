-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "stepThreshold" INTEGER NOT NULL DEFAULT 100,
    "moneyPerThreshold" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
