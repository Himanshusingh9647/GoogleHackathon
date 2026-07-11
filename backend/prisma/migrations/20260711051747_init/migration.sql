-- CreateTable
CREATE TABLE "UserRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schedule" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "dietType" TEXT NOT NULL,
    "exclusions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "menu" TEXT NOT NULL,
    "groceryList" TEXT NOT NULL,
    "substitutions" TEXT NOT NULL,
    "budgetCheck" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MealPlan_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "UserRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
