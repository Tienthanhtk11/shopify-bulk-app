import { bootstrapInternalAdminAccount } from "../app/services/internal-admin-accounts.server";

function readFlag(flag: string) {
  const exact = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (exact) {
    return exact.slice(flag.length + 1).trim();
  }

  const index = process.argv.findIndex((arg) => arg === flag);
  if (index >= 0) {
    return String(process.argv[index + 1] || "").trim();
  }

  return "";
}

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function printUsage() {
  console.error(
    "Usage: npm run admin:bootstrap -- --email <email> --display-name <name> --password <password> [--force-reset-password]",
  );
}

async function main() {
  const email = readFlag("--email");
  const displayName = readFlag("--display-name");
  const password = readFlag("--password");
  const forceResetPassword = hasFlag("--force-reset-password");

  if (!email || !displayName || !password) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const result = await bootstrapInternalAdminAccount({
    email,
    displayName,
    password,
    forceResetPassword,
  });

  const action = result.created ? "created" : "updated";
  console.log(
    `Internal admin account ${action}: ${result.account.email} (${result.account.displayName})`,
  );
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? error.message
      : "Failed to bootstrap the internal admin account.",
  );
  process.exitCode = 1;
});