-- CreateTable
CREATE TABLE "Temperature" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Temperature_pkey" PRIMARY KEY ("id")
);
