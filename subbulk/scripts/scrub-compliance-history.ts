import prisma from "../app/db.server";
import {
  COMPLIANCE_EVENT_TYPES,
  buildRedactedPayload,
  payloadContainsComplianceIdentifiers,
} from "../app/services/compliance.server";

function parsePayloadJson(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function scrubReasonForType(type: string) {
  return `${type.replace(/^compliance\./, "").replace(/\./g, "_")}_history_scrubbed`;
}

async function main() {
  const events = await prisma.merchantEvent.findMany({
    where: { type: { in: [...COMPLIANCE_EVENT_TYPES] } },
    select: { id: true, type: true, payloadJson: true },
  });

  let scanned = 0;
  let updated = 0;

  for (const event of events) {
    scanned += 1;
    const payload = parsePayloadJson(event.payloadJson);
    if (!payloadContainsComplianceIdentifiers(payload)) {
      continue;
    }

    await prisma.merchantEvent.update({
      where: { id: event.id },
      data: {
        payloadJson: JSON.stringify(buildRedactedPayload(scrubReasonForType(event.type))),
      },
    });
    updated += 1;
  }

  console.info(
    JSON.stringify(
      {
        ok: true,
        scanned,
        updated,
      },
      null,
      2,
    ),
  );
}

void main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });