import {organizations} from "@/drizzle/schema/organizations";
import {userOrganization} from "@/drizzle/schema/user_organization";
import {userProfiles} from "@/drizzle/schema/user_profiles";
import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";
import {randomUUID} from "crypto";

// Wrap in an async IIFE
(async () => {
  console.log("🌱 Seeding test data...");

  const password = await bcrypt.hash("password123", 10);
  const userId = randomUUID();
  const orgId = randomUUID();

  // 1. Create user
  await db.insert(users).values({
    id: userId,
    email: "admin@example.com",
    hashedPassword: password,
  });

  // 2. Create profile
  await db.insert(userProfiles).values({
    userId,
    firstName: "Admin",
    lastName: "User",
    gender: "male",
    phone: "+96891234567",
  });

  // 3. Create organization
  await db.insert(organizations).values({
    id: orgId,
    name: "Acme Inc.",
    slug: "acme",
  });

  // 4. Assign user to organization
  await db.insert(userOrganization).values({
    userId,
    organizationId: orgId,
    role: "owner",
    status: "active",
  });

  console.log("✅ Seed complete!");
})();
