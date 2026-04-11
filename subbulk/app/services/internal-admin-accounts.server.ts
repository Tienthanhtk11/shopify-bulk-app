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

export async function authenticateInternalAdminAccount(email: string, password: string) {
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

export async function bootstrapInternalAdminAccount(input: {
  email: string;
  displayName: string;
  password: string;
  forceResetPassword?: boolean;
}) {
  const email = normalizeEmail(input.email);
  const displayName = input.displayName.trim();
  const password = input.password.trim();

  if (!email || !displayName || !password) {
    throw new Error("Email, display name, and password are required.");
  }

  const existing = await prisma.internalAdminAccount.findUnique({ where: { email } });
  if (!existing) {
    const created = await prisma.internalAdminAccount.create({
      data: {
        email,
        displayName,
        passwordHash: buildPasswordHash(password),
        isActive: true,
      },
    });

    return {
      account: toAdminViewModel(created),
      created: true,
      passwordReset: true,
    };
  }

  if (!input.forceResetPassword) {
    throw new Error(
      `Internal admin account already exists for ${email}. Re-run with --force-reset-password to update it.`,
    );
  }

  const updated = await prisma.internalAdminAccount.update({
    where: { id: existing.id },
    data: {
      displayName,
      isActive: true,
      passwordHash: buildPasswordHash(password),
    },
  });

  return {
    account: toAdminViewModel(updated),
    created: false,
    passwordReset: true,
  };
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