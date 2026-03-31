import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import prisma from "../db.server";

const SCRYPT_KEYLEN = 64;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildPasswordHash(password: string, salt = randomBytes(16).toString("hex")) {
  const derivedKey = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

function verifyPasswordHash(password: string, passwordHash: string) {
  const [algorithm, salt, storedKey] = passwordHash.split(":");
  if (algorithm !== "scrypt" || !salt || !storedKey) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  const left = Buffer.from(derivedKey, "hex");
  const right = Buffer.from(storedKey, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function parseBootstrapAccountsEnv() {
  return String(process.env.INTERNAL_ADMIN_PORTAL_ACCOUNTS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [email, password, displayName] = entry.split(":").map((value) => value?.trim());
      if (!email || !password) return null;
      return {
        email: normalizeEmail(email),
        password,
        displayName: displayName || email,
      };
    })
    .filter((account): account is { email: string; password: string; displayName: string } => Boolean(account));
}

function toAdminViewModel(record: {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: record.id,
    email: record.email,
    displayName: record.displayName,
    isActive: record.isActive,
    lastLoginAt: record.lastLoginAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function ensureInternalAdminBootstrap() {
  const total = await prisma.internalAdminAccount.count();
  if (total > 0) {
    return false;
  }

  const bootstrapAccounts = parseBootstrapAccountsEnv();
  if (bootstrapAccounts.length === 0) {
    return false;
  }

  await prisma.$transaction(
    bootstrapAccounts.map((account) =>
      prisma.internalAdminAccount.create({
        data: {
          email: account.email,
          displayName: account.displayName,
          passwordHash: buildPasswordHash(account.password),
          isActive: true,
        },
      }),
    ),
  );

  return true;
}

export async function authenticateInternalAdminAccount(email: string, password: string) {
  await ensureInternalAdminBootstrap();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = password.trim();
  const account = await prisma.internalAdminAccount.findUnique({ where: { email: normalizedEmail } });

  if (!account || !account.isActive) {
    return null;
  }

  if (!verifyPasswordHash(normalizedPassword, account.passwordHash)) {
    return null;
  }

  const updated = await prisma.internalAdminAccount.update({
    where: { id: account.id },
    data: { lastLoginAt: new Date() },
  });

  return toAdminViewModel(updated);
}

export async function getInternalAdminAccountById(id: string) {
  const account = await prisma.internalAdminAccount.findUnique({ where: { id } });
  return account ? toAdminViewModel(account) : null;
}

export async function listInternalAdminAccounts() {
  await ensureInternalAdminBootstrap();
  const accounts = await prisma.internalAdminAccount.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
  });
  return accounts.map(toAdminViewModel);
}

export async function createInternalAdminAccount(input: {
  email: string;
  displayName: string;
  password: string;
  isActive: boolean;
}) {
  return prisma.internalAdminAccount.create({
    data: {
      email: normalizeEmail(input.email),
      displayName: input.displayName.trim(),
      passwordHash: buildPasswordHash(input.password),
      isActive: input.isActive,
    },
  });
}

export async function updateInternalAdminAccount(input: {
  id: string;
  email: string;
  displayName: string;
  password?: string;
  isActive: boolean;
}) {
  const data: {
    email: string;
    displayName: string;
    isActive: boolean;
    passwordHash?: string;
  } = {
    email: normalizeEmail(input.email),
    displayName: input.displayName.trim(),
    isActive: input.isActive,
  };

  if (input.password && input.password.trim()) {
    data.passwordHash = buildPasswordHash(input.password.trim());
  }

  return prisma.internalAdminAccount.update({
    where: { id: input.id },
    data,
  });
}

export async function deleteInternalAdminAccount(id: string) {
  return prisma.internalAdminAccount.delete({ where: { id } });
}