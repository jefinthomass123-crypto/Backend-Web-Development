
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: { name: "Community User" },
    create: {
      id: 1,
      name: "Community User",
    },
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: {
      title: "First post",
      body: "The contract survives storage changes.",
      authorId: 1,
    },
    create: {
      id: 1,
      title: "First post",
      body: "The contract survives storage changes.",
      authorId: 1,
    },
  });

  await prisma.post.upsert({
    where: { id: 2 },
    update: {
      title: "Second post",
      body: "Migrations record database design.",
      authorId: 1,
    },
    create: {
      id: 2,
      title: "Second post",
      body: "Migrations record database design.",
      authorId: 1,
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
