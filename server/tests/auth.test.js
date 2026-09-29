import { describe, it, expect, beforeEach, afterAll } from "vitest";
import bcrypt from "bcryptjs";
import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../lib/prisma.js";

describe("Authentication", () => {
  beforeEach(async () => {
    await prisma.message.deleteMany();
    await prisma.conversationMember.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a new user", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe("TestUser");
    expect(response.body.user.email).toBe("test@example.com");
  });

  it("rejects duplicate username or email", async () => {
    await request(app).post("/auth/register").send({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app).post("/auth/register").send({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username or email already exists");
  });

  it("rejects registration with missing fields", async () => {
    const response = await request(app).post("/auth/register").send({
      username: "TestUser",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Username, email, and password are required",
    );
  });

  it("rejects short and bcrypt-truncated passwords at registration", async () => {
    const shortPasswordResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "TestUser",
        email: "test@example.com",
        password: "short",
      });
    const longPasswordResponse = await request(app)
      .post("/auth/register")
      .send({
        username: "TestUser",
        email: "test@example.com",
        password: "a".repeat(73),
      });

    expect(shortPasswordResponse.status).toBe(400);
    expect(longPasswordResponse.status).toBe(400);
  });

  it("logs in a registered user", async () => {
    await request(app).post("/auth/register").send({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^token=/)]),
    );
    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"][0]).toContain("SameSite=Lax");
    expect(response.headers["set-cookie"][0]).toContain("Path=/");
  });

  it("authenticates existing mixed-case email records case-insensitively", async () => {
    await prisma.user.create({
      data: {
        username: "LegacyUser",
        email: "Legacy@Example.com",
        passwordHash: await bcrypt.hash("password123", 10),
      },
    });

    const response = await request(app).post("/auth/login").send({
      email: "legacy@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^token=/)]),
    );
  });

  it("rejects an incorrect password", async () => {
    await request(app).post("/auth/register").send({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });

  it("rejects login for a nonexistent user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "doesnotexist@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });

  it("rejects login with missing credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email and password are required");
  });

  it("returns the current authenticated user", async () => {
    await request(app).post("/auth/register").send({
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    });

    const loginResponse = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app)
      .get("/auth/me")
      .set("Cookie", loginResponse.headers["set-cookie"]);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("TestUser");
    expect(response.body.email).toBe("test@example.com");
  });

  it("rejects /me without authentication", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication required");
  });

  it("rejects /me with an invalid token", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Cookie", "token=this-is-not-a-real-token");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid or expired token");
  });

  it("clears the authentication cookie on logout", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^token=;/)]),
    );
  });

  it("limits repeated failed login attempts", async () => {
    const statuses = [];

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const response = await request(app).post("/auth/login").send({
        email: "missing@example.com",
        password: "wrong-password",
      });
      statuses.push(response.status);
      if (response.status === 429) break;
    }

    expect(statuses).toContain(429);
    expect(statuses.at(-1)).toBe(429);
  });

  it("rejects disallowed origins and returns standard security headers", async () => {
    const blockedOriginResponse = await request(app)
      .get("/auth/me")
      .set("Origin", "https://attacker.example");
    const headersResponse = await request(app).get("/auth/me");

    expect(blockedOriginResponse.status).toBe(403);
    expect(blockedOriginResponse.body.error).toBe("Origin not allowed");
    expect(blockedOriginResponse.text).not.toContain("at ");
    expect(headersResponse.headers["x-content-type-options"]).toBe("nosniff");
    expect(headersResponse.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });
});
