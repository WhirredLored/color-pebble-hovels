// =============================================================================
// Huestone Homes LLC — Database Seed Script
// =============================================================================
// Populates the database with contextual test entities for development:
// - 1 Admin user + profile (Huestone Homes admin)
// - 1 Client user + profile (test homeowner)
// - 1 Active painting/restoration project
// - 1 Draft estimate with 3 line items (materials, labor, CNC trim)
// - 1 Warranty object (2-year coverage)
// =============================================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏠 Seeding Huestone Homes database...\n");

  // =========================================================================
  // 1. Admin User + Profile
  // =========================================================================
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@huestonehomes.com" },
    update: {},
    create: {
      workosId: "user_workos_admin_seed_001",
      email: "admin@huestonehomes.com",
      role: "ADMIN",
      profile: {
        create: {
          firstName: "Marcus",
          lastName: "Huestone",
          companyName: "Huestone Homes LLC",
          phone: "(555) 100-2000",
          bio: "Founder & lead craftsman specializing in high-end home restoration and CNC architectural carving.",
        },
      },
    },
    include: { profile: true },
  });

  console.log(
    `  ✅ Admin user created: ${adminUser.email} (${adminUser.role})`
  );
  console.log(
    `     Profile: ${adminUser.profile?.firstName} ${adminUser.profile?.lastName}\n`
  );

  // =========================================================================
  // 2. Client User + Profile
  // =========================================================================
  const clientUser = await prisma.user.upsert({
    where: { email: "sarah.mitchell@example.com" },
    update: {},
    create: {
      workosId: "user_workos_client_seed_002",
      email: "sarah.mitchell@example.com",
      role: "CLIENT",
      profile: {
        create: {
          firstName: "Sarah",
          lastName: "Mitchell",
          companyName: "Mitchell Family Trust",
          phone: "(555) 234-5678",
          bio: "Homeowner with a 1920s craftsman bungalow in need of full exterior restoration.",
        },
      },
    },
    include: { profile: true },
  });

  console.log(
    `  ✅ Client user created: ${clientUser.email} (${clientUser.role})`
  );
  console.log(
    `     Profile: ${clientUser.profile?.firstName} ${clientUser.profile?.lastName}\n`
  );

  // =========================================================================
  // 3. Active Painting & Restoration Project
  // =========================================================================
  const project = await prisma.project.create({
    data: {
      userId: clientUser.id,
      name: "Mitchell Craftsman Bungalow — Full Exterior Restoration",
      description:
        "Complete exterior restoration of a 1920s craftsman bungalow including wood repair, lead paint abatement, custom CNC-carved porch brackets, and full repaint in period-accurate colors.",
      address: "742 Maple Avenue",
      city: "Portland",
      state: "OR",
      zipCode: "97205",
      projectStatus: "ACTIVE",
      projectType: "RESTORATION",
      startDate: new Date("2026-07-15"),
      endDate: new Date("2026-10-15"),
      notes:
        "Client has requested Benjamin Moore Historical Colors. HOA approval obtained for color palette.",
    },
  });

  console.log(`  ✅ Project created: "${project.name}"`);
  console.log(
    `     Status: ${project.projectStatus} | Type: ${project.projectType}\n`
  );

  // =========================================================================
  // 4. Draft Estimate with 3 Line Items
  // =========================================================================
  const estimate = await prisma.estimate.create({
    data: {
      projectId: project.id,
      status: "DRAFT",
      title: "Phase 1 — Exterior Wood Repair & CNC Brackets",
      notes:
        "Initial estimate covering wood rot repair, custom CNC porch bracket fabrication, and prep work for painting.",
      subtotal: 18750.0,
      taxRate: 0.0,
      taxAmount: 0.0,
      total: 18750.0,
      validUntil: new Date("2026-08-15"),
      lineItems: {
        create: [
          {
            description:
              "Exterior-grade cedar lumber, wood hardener, epoxy filler, stainless steel fasteners, and primer coats",
            quantity: 1,
            unitCost: 4250.0,
            laborCost: 0,
            totalCost: 4250.0,
            category: "MATERIALS",
            sortOrder: 1,
            notes: "Sourced from certified sustainable forestry suppliers",
          },
          {
            description:
              "Skilled carpentry labor for wood rot removal, structural repair, sanding, and surface preparation (estimated 120 hrs)",
            quantity: 120,
            unitCost: 0,
            laborCost: 85.0,
            totalCost: 10200.0,
            category: "LABOR",
            sortOrder: 2,
            notes: "Two-person crew, lead carpenter + journeyman",
          },
          {
            description:
              "Custom CNC-carved porch bracket fabrication — 4 matching brackets in Victorian scroll pattern from white oak blanks",
            quantity: 4,
            unitCost: 575.0,
            laborCost: 500.0,
            totalCost: 4300.0,
            category: "CNC_MACHINE_TIME",
            sortOrder: 3,
            notes:
              "Design approved by client. Pattern: VIC-SCROLL-002. Includes finishing and sealant.",
          },
        ],
      },
    },
    include: { lineItems: true },
  });

  console.log(`  ✅ Estimate created: "${estimate.title}"`);
  console.log(
    `     Status: ${estimate.status} | Total: $${estimate.total}`
  );
  console.log(`     Line items: ${estimate.lineItems.length}`);
  for (const item of estimate.lineItems) {
    console.log(
      `       → [${item.category}] ${item.description.slice(0, 60)}... — $${item.totalCost}`
    );
  }
  console.log();

  // =========================================================================
  // 5. Warranty (2-Year Coverage)
  // =========================================================================
  const warranty = await prisma.warranty.create({
    data: {
      projectId: project.id,
      coverageStart: new Date("2026-10-15"),
      coverageEnd: new Date("2028-10-15"),
      terms:
        "Huestone Homes LLC warrants all workmanship and materials for a period of two (2) years from project completion. Coverage includes: wood repair integrity, paint adhesion and finish, CNC-carved element structural integrity, and all fastener connections. Excludes: acts of nature, client modifications, and normal wear. Claims must be filed within 30 days of discovery.",
    },
  });

  console.log(`  ✅ Warranty created for project`);
  console.log(
    `     Coverage: ${warranty.coverageStart.toLocaleDateString()} — ${warranty.coverageEnd.toLocaleDateString()}\n`
  );

  // =========================================================================
  // Summary
  // =========================================================================
  console.log("━".repeat(60));
  console.log("🎉 Seed complete! Created:");
  console.log(`   • 2 users (1 admin, 1 client)`);
  console.log(`   • 2 profiles`);
  console.log(`   • 1 active project`);
  console.log(`   • 1 draft estimate with 3 line items`);
  console.log(`   • 1 warranty (2-year coverage)`);
  console.log("━".repeat(60));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
