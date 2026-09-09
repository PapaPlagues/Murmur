import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import { prisma } from "../lib/prisma.js";

describe("Conversations", () => {
  beforeEach(async () => {
    await prisma.message.deleteMany();
    await prisma.conversationMember.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const createUser = async (username, email) => {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: "test-password",
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      user,
      token,
    };
  };

  it("creates a conversation between two users", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const alice = await createUser("Alice", "alice@example.com");

    const response = await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({
        userId: alice.user.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.members).toHaveLength(2);

    expect(
      response.body.members.some((member) => member.user.username === "Tester"),
    ).toBe(true);

    expect(
      response.body.members.some((member) => member.user.username === "Alice"),
    ).toBe(true);
  });

  it("rejects a conversation without a user ID", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const response = await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("User ID is required");
  });

  it("rejects a conversation with yourself", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const response = await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({
        userId: tester.user.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "You cannot start a conversation with yourself",
    );
  });

  it("rejects a conversation with a nonexistent user", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const response = await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({
        userId: 99999,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("gets the current user's conversations", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const alice = await createUser("Alice", "alice@example.com");

    await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({
        userId: alice.user.id,
      });

    const response = await request(app)
      .get("/conversations")
      .set("Authorization", `Bearer ${tester.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].members).toHaveLength(2);
  });

  it("gets a specific conversation", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const alice = await createUser("Alice", "alice@example.com");

    const createResponse = await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({
        userId: alice.user.id,
      });

    const conversationId = createResponse.body.id;

    const response = await request(app)
      .get(`/conversations/${conversationId}`)
      .set("Authorization", `Bearer ${tester.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(conversationId);
    expect(response.body.members).toHaveLength(2);
  });

  it("rejects access to a conversation the user is not a member of", async () => {
    const tester = await createUser("Tester", "tester@example.com");

    const alice = await createUser("Alice", "alice@example.com");

    const conversationResponse = await request(app)
      .post("/conversations")
      .set("Authorization", `Bearer ${tester.token}`)
      .send({
        userId: alice.user.id,
      });

    const conversationId = conversationResponse.body.id;

    const bob = await createUser("Bob", "bob@example.com");

    const response = await request(app)
      .get(`/conversations/${conversationId}`)
      .set("Authorization", `Bearer ${bob.token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Conversation not found");
  });

  it("rejects unauthenticated conversation requests", async () => {
    const response = await request(app).get("/conversations");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication required");
  });
});
