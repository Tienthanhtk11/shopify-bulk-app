import { createRequire } from "node:module";
import type { PrismaClient as PrismaClientType } from "../generated/prisma/client";
import { serverConfig } from "./config.server";

const require = createRequire(import.meta.url);

function loadPrismaClient() {
  for (const candidate of ["../generated/prisma/client", "../../generated/prisma/client"]) {
    try {
      return require(candidate) as {
        PrismaClient: new () => PrismaClientType;
      };
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        error.code !== "MODULE_NOT_FOUND"
      ) {
        throw error;
      }
    }
  }

  throw new Error("Unable to resolve generated Prisma client from source or build runtime.");
}

const { PrismaClient } = loadPrismaClient();

declare global {
  var prismaGlobal: PrismaClientType;
}

if (!serverConfig.isProduction) {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient();

export default prisma;
