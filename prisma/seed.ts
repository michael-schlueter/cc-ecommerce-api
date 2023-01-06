import { Prisma, PrismaClient } from "@prisma/client";

const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// async function main() {
//   await prisma.user.createMany({
//     data: [
//       {
//         email: "alice@email.com",
//         password: bcrypt.hashSync("P4$sword", 12),
//         firstName: "Alice",
//         lastName: "Cooper,",
//       },
//       {
//         email: "bob@email.com",
//         password: bcrypt.hashSync("P4$sword", 12),
//         firstName: "Bob",
//         lastName: "Dylan,",
//       },
//       {
//         email: "carol@email.com",
//         password: bcrypt.hashSync("P4$sword", 12),
//         firstName: "Carol",
//         lastName: "Deck,",
//       },
//       {
//         email: "dauphne@email.com",
//         password: bcrypt.hashSync("P4$sword", 12),
//         firstName: "Dauphne",
//         lastName: "Swan,",
//       },
//     ],
//   });

//   await prisma.product.create({
//     data:
//       {
//         name: "T-Shirt",
//         description: "Simple white t-shirt",
//         price: 12.99,
//         image: "/images/tshirt.jpg",
//         categories: {
//             create: [
//                 {
//                     description: "Summer"
//                 },
//                 {
//                     description: "Men"
//                 },
//                 {
//                     description: "Clothing"
//                 }
//             ]
//         }
//       },
//   });

//   await prisma.product.create({
//     data:
//     {
//         name: "Suit",
//         description: "Elegant suit",
//         price: 99.99,
//         image: "/images/suit.jpg",
//         categories: {
//             create: [
//                 {
//                     description: "Women"
//                 },
//             ]
//         }
//     }
//   })
// }

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@email.com" },
    update: {},
    create: {
      email: "alice@email.com",
      password: bcrypt.hashSync("P4$sword", 12),
      firstName: "Alice",
      lastName: "Cooper,",
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@email.com" },
    update: {},
    create: {
      email: "bob@email.com",
      password: bcrypt.hashSync("P4$sword", 12),
      firstName: "Bob",
      lastName: "Dylan,",
    },
  });
  const carol = await prisma.user.upsert({
    where: { email: "carol@email.com" },
    update: {},
    create: {
      email: "carol@email.com",
      password: bcrypt.hashSync("P4$sword", 12),
      firstName: "Carol",
      lastName: "Deck,",
    },
  });
  const dauphne = await prisma.user.upsert({
    where: { email: "dauphne@email.com" },
    update: {},
    create: {
      email: "dauphne@email.com",
      password: bcrypt.hashSync("P4$sword", 12),
      firstName: "Dauphne",
      lastName: "Swan,",
    },
  });
  const tshirt = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "T-Shirt",
      description: "Simple white t-shirt",
      price: 12.99,
      image: "/images/tshirt.jpg",
      categories: {
        connectOrCreate: [
          {
            where: {
              name: "summer",
            },
            create: {
              name: "summer",
            },
          },
          {
            where: {
              name: "women",
            },
            create: {
              name: "women",
            },
          },
        ],
      },
    },
  });
  const suit = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Suit",
      description: "Elegant suit",
      price: 99.99,
      image: "/images/suit.jpg",
      categories: {
        connectOrCreate: [
          {
            where: {
              name: "winter",
            },
            create: {
              name: "winter",
            },
          },
          {
            where: {
              name: "women",
            },
            create: {
              name: "women",
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect;
    process.exit(1);
  });
