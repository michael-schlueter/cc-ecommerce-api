import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: "alice@email.com" },
        update: {},
        create: {
            email: "alice@email.com",
            password: bcrypt.hashSync("P4$sword", 12),
            firstName: "Alice",
            lastName: "Cooper,"
        }
    })
    const bob = await prisma.user.upsert({
        where: { email: "bob@email.com" },
        update: {},
        create: {
            email: "bob@email.com",
            password: bcrypt.hashSync("P4$sword", 12),
            firstName: "Bob",
            lastName: "Dylan,"
        }
    })
    const carol = await prisma.user.upsert({
        where: { email: "carol@email.com" },
        update: {},
        create: {
            email: "carol@email.com",
            password: bcrypt.hashSync("P4$sword", 12),
            firstName: "Carol",
            lastName: "Deck,"
        }
    })
    const dauphne = await prisma.user.upsert({
        where: { email: "dauphne@email.com" },
        update: {},
        create: {
            email: "dauphne@email.com",
            password: bcrypt.hashSync("P4$sword", 12),
            firstName: "Dauphne",
            lastName: "Swan,"
        }
    })
    const tshirt = await prisma.product.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "T-Shirt",
            description: "Simple white t-shirt",
            price: 12.99,
            image: "/images/tshirt.jpg",
            category: {
                create:
                    {
                        description: "Summer"
                    },
            }
        }
    })
    const suit = await prisma.product.upsert({
        where: { id: 3 },
        update: {},
        create: {
            name: "Suit",
            description: "Elegant suit",
            price: 99.99,
            image: "/images/suit.jpg",
            category: {
                create:
                    {
                        description: "Men"
                    },
            }
        }
    })
}

main().then(async () => {
    await prisma.$disconnect;
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect;
    process.exit(1);
});