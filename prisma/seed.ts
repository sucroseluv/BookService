import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@bookservice.com",
      password: await hash("Admin123"),
      role: 2,
      active: true,
    },
  });
  await prisma.book.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Война и мир",
      author: "Лев Толстой",
      publicationDate: "1867-01-01T00:00:00.000Z",
      genres: {
        connectOrCreate: [
          {
            where: { name: "Роман" },
            create: { name: "Роман" },
          },
          {
            where: { name: "Историческая проза" },
            create: { name: "Историческая проза" },
          },
          {
            where: { name: "Исторический жанр" },
            create: { name: "Исторический жанр" },
          },
        ],
      },
    },
  });
  await prisma.book.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Мастер и маргарита",
      author: "Михаил Булгаков",
      publicationDate: "1966-01-01T00:00:00.000Z",
      genres: {
        connectOrCreate: [
          {
            where: { name: "Роман" },
            create: { name: "Роман" },
          },
          {
            where: { name: "Сатира" },
            create: { name: "Сатира" },
          },
          {
            where: { name: "Фэнтези" },
            create: { name: "Фэнтези" },
          },
        ],
      },
    },
  });
  await prisma.book.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      publicationDate: "1866-01-01T00:00:00.000Z",
      genres: {
        connectOrCreate: [
          {
            where: { name: "Роман" },
            create: { name: "Роман" },
          },
          {
            where: { name: "Криминальный жанр" },
            create: { name: "Криминальный жанр" },
          },
          {
            where: { name: "Психологический реализм" },
            create: { name: "Психологический реализм" },
          },
        ],
      },
    },
  });
}
main()
  .then(async () => {
    console.log("seeding completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log("seeding error");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
