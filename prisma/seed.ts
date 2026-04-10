import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

// Ensure DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create PostgreSQL pool and adapter
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("🌱 Seeding development data...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.deliveryTracking.deleteMany();
  await prisma.withdrawalRequest.deleteMany();
  await prisma.bidImage.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.requestImage.deleteMany();
  await prisma.request.deleteMany();
  await prisma.vendorCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.platformSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Cleared existing data");

  // ============================================================================
  // Create Users
  // ============================================================================
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin User
  await prisma.user.create({
    data: {
      fullName: "Admin User",
      email: "admin@shoofly.com",
      password: hashedPassword,
      phone: "+20100000001",
      role: "ADMIN",
      isActive: true,
      walletBalance: 10000,
    },
  });

  // Client Users
  const client1 = await prisma.user.create({
    data: {
      fullName: "Ahmed Hassan",
      email: "client1@shoofly.com",
      password: hashedPassword,
      phone: "+20100000002",
      role: "CLIENT",
      isActive: true,
      walletBalance: 5000,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      fullName: "Fatima ElSawy",
      email: "client2@shoofly.com",
      password: hashedPassword,
      phone: "+20100000003",
      role: "CLIENT",
      isActive: true,
      walletBalance: 3000,
    },
  });

  // Vendor Users
  const vendor1 = await prisma.user.create({
    data: {
      fullName: "Mohammed ElAmin",
      email: "vendor1@shoofly.com",
      password: hashedPassword,
      phone: "+20100000004",
      role: "VENDOR",
      isActive: true,
      walletBalance: 2500,
    },
  });

  const vendor2 = await prisma.user.create({
    data: {
      fullName: "Sara ElNaggar",
      email: "vendor2@shoofly.com",
      password: hashedPassword,
      phone: "+20100000005",
      role: "VENDOR",
      isActive: true,
      walletBalance: 1800,
    },
  });

  console.log("✓ Created 5 users (1 admin, 2 clients, 2 vendors)");

  // ============================================================================
  // Create Categories
  // ============================================================================
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Home Cleaning",
        slug: "home-cleaning",
      },
    }),
    prisma.category.create({
      data: {
        name: "Plumbing",
        slug: "plumbing",
      },
    }),
    prisma.category.create({
      data: {
        name: "Electrical",
        slug: "electrical",
      },
    }),
    prisma.category.create({
      data: {
        name: "Carpentry",
        slug: "carpentry",
      },
    }),
    prisma.category.create({
      data: {
        name: "Painting",
        slug: "painting",
      },
    }),
  ]);

  console.log("✓ Created 5 categories");

  // ============================================================================
  // Create Vendor Categories (assign vendors to categories)
  // ============================================================================
  await prisma.vendorCategory.createMany({
    data: [
      { vendorId: vendor1.id, categoryId: categories[0].id },
      { vendorId: vendor1.id, categoryId: categories[1].id },
      { vendorId: vendor2.id, categoryId: categories[2].id },
      { vendorId: vendor2.id, categoryId: categories[3].id },
      { vendorId: vendor2.id, categoryId: categories[4].id },
    ],
  });

  console.log("✓ Assigned vendors to categories");

  // ============================================================================
  // Create Platform Settings
  // ============================================================================
  await prisma.platformSetting.create({
    data: {
      commissionPercent: 15,
      minVendorMatchCount: 3,
      initialRadiusKm: 5,
      maxRadiusKm: 50,
      radiusExpansionStepKm: 5,
    },
  });

  console.log("✓ Created platform settings");

  // ============================================================================
  // Create Sample Requests
  // ============================================================================
  const request1 = await prisma.request.create({
    data: {
      clientId: client1.id,
      title: "Apartment Cleaning Service",
      description:
        "Need professional cleaning for my 3-bedroom apartment in Maadi",
      categoryId: categories[0].id,
      address: "123 Street, Maadi, Cairo",
      latitude: 30.0044,
      longitude: 31.2707,
      deliveryPhone: "+20100000002",
      notes: "Please bring all cleaning supplies",
      status: "OPEN_FOR_BIDDING",
    },
  });

  const request2 = await prisma.request.create({
    data: {
      clientId: client2.id,
      title: "Bathroom Plumbing Repair",
      description: "Leaky faucet and blocked drain in master bathroom",
      categoryId: categories[1].id,
      address: "456 Avenue, Heliopolis, Cairo",
      latitude: 30.0595,
      longitude: 31.3431,
      deliveryPhone: "+20100000003",
      notes: "Available on weekends",
      status: "BIDS_RECEIVED",
    },
  });

  console.log("✓ Created 2 sample requests");

  // ============================================================================
  // Create Sample Bids
  // ============================================================================
  await prisma.bid.create({
    data: {
      requestId: request1.id,
      vendorId: vendor1.id,
      description:
        "Professional deep cleaning with eco-friendly products. 5 years experience.",
      netPrice: 300,
      clientPrice: 345,
      status: "PENDING",
    },
  });

  await prisma.bid.create({
    data: {
      requestId: request1.id,
      vendorId: vendor2.id,
      description: "Quick and efficient cleaning. Premium service included.",
      netPrice: 350,
      clientPrice: 402.5,
      status: "PENDING",
    },
  });

  await prisma.bid.create({
    data: {
      requestId: request2.id,
      vendorId: vendor1.id,
      description: "Expert plumbing repairs. Licensed plumber with 10+ years.",
      netPrice: 250,
      clientPrice: 287.5,
      status: "SELECTED",
    },
  });

  console.log("✓ Created 3 sample bids");

  // ============================================================================
  // Create Sample Delivery Tracking
  // ============================================================================
  await prisma.deliveryTracking.create({
    data: {
      requestId: request2.id,
      status: "ORDER_PLACED",
      note: "Order confirmed",
      locationText: "Cairo, Egypt",
    },
  });

  console.log("✓ Created delivery tracking entries");

  // ============================================================================
  // Create Sample Transactions
  // ============================================================================
  await prisma.transaction.create({
    data: {
      userId: client1.id,
      requestId: request1.id,
      amount: 345,
      type: "ESCROW_DEPOSIT",
      description: "Escrow deposit for cleaning service",
    },
  });

  await prisma.transaction.create({
    data: {
      userId: vendor1.id,
      requestId: request2.id,
      amount: 243.75,
      type: "VENDOR_PAYOUT",
      description: "Payout for plumbing repair",
    },
  });

  console.log("✓ Created sample transactions");

  // ============================================================================
  // Create Sample Notifications
  // ============================================================================
  await prisma.notification.create({
    data: {
      userId: vendor1.id,
      type: "NEW_REQUEST",
      title: "New Request Available",
      message: "A new cleaning request has been posted in your area",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: client1.id,
      type: "NEW_BID",
      title: "New Bid Received",
      message: "You have received 2 new bids for your cleaning request",
      isRead: false,
    },
  });

  console.log("✓ Created sample notifications");

  console.log("\n✅ Seeding complete!");
  console.log("\n📊 Summary:");
  console.log(`   Users: 5 (1 admin, 2 clients, 2 vendors)`);
  console.log(`   Categories: 5`);
  console.log(`   Requests: 2`);
  console.log(`   Bids: 3`);
  console.log(`   Transactions: 2`);
  console.log(`   Notifications: 2`);
  console.log("\n🔐 Login Credentials:");
  console.log(`   Admin: admin@shoofly.com / password123`);
  console.log(`   Client: client1@shoofly.com / password123`);
  console.log(`   Vendor: vendor1@shoofly.com / password123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
