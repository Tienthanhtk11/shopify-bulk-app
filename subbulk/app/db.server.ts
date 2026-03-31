import { createRequire } from "node:module";
import type { PrismaClient as PrismaClientType } from "../generated/prisma/client";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("../../generated/prisma/client") as {
  PrismaClient: new () => PrismaClientType;
};

declare global {
  var prismaGlobal: PrismaClientType;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient();

export default prisma;
