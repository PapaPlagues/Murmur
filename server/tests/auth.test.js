import { describe, it, expect, beforeEach, afterAll } from "vitest";
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
    expect(response.body).toHaveProperty("token");
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

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

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
      .set("Authorization", "Bearer this-is-not-a-real-token");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid or expired token");
  });
});
