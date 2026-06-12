-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "location" TEXT,
    "publicSlug" TEXT NOT NULL,
    "adminKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignupSlot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignupSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignupClaim" (
    "id" TEXT NOT NULL,
    "personName" TEXT NOT NULL,
    "description" TEXT,
    "slotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignupClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_publicSlug_key" ON "Event"("publicSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_adminKey_key" ON "Event"("adminKey");

-- CreateIndex
CREATE UNIQUE INDEX "SignupClaim_slotId_key" ON "SignupClaim"("slotId");

-- AddForeignKey
ALTER TABLE "SignupSlot" ADD CONSTRAINT "SignupSlot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignupClaim" ADD CONSTRAINT "SignupClaim_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "SignupSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
