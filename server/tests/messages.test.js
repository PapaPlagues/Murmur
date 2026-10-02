import { afterAll, beforeEach, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../lib/prisma.js";

describe("Messages", () => {
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
      data: { username, email, passwordHash: "test-password" },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { user, token };
  };

  const createConversation = async (firstUserId, secondUserId) =>
    prisma.conversation.create({
      data: {
        members: {
          create: [{ userId: firstUserId }, { userId: secondUserId }],
        },
      },
    });

  it("returns an empty message list for a new conversation", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const response = await request(app)
      .get(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("sends a text message and returns it in the conversation history", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const sendResponse = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`)
      .field("content", "  Hello, Alice!  ");

    expect(sendResponse.status).toBe(201);
    expect(sendResponse.body.content).toBe("Hello, Alice!");
    expect(sendResponse.body.sender.id).toBe(tester.user.id);

    const historyResponse = await request(app)
      .get(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`);

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body).toHaveLength(1);
    expect(historyResponse.body[0].id).toBe(sendResponse.body.id);
  });

  it("rejects a message without text or an image", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const response = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`)
      .field("content", "   ");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Message must contain text or an image");
  });

  it("rejects a null request body without an internal error", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const response = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`)
      .send(null);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Message must contain text or an image");
  });

  it("rejects non-string and oversized message content", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const response = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`)
      .field("content", "a".repeat(10001));

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid message content");
  });

  it("rejects an image whose bytes do not match its declared MIME type", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const response = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${tester.token}`)
      .field("content", "Look at this")
      .attach(
        "image",
        Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
        { filename: "image.png", contentType: "image/png" },
      );

    expect(response.status).toBe(415);
    expect(response.body.error).toBe("Unsupported message image contents");
  });

  it("denies message reads and sends from non-members", async () => {
    const tester = await createUser("Tester", "tester@example.com");
    const alice = await createUser("Alice", "alice@example.com");
    const outsider = await createUser("Outsider", "outsider@example.com");
    const conversation = await createConversation(
      tester.user.id,
      alice.user.id,
    );

    const readResponse = await request(app)
      .get(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${outsider.token}`);
    const sendResponse = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${outsider.token}`)
      .field("content", "Intruding");
    const uploadResponse = await request(app)
      .post(`/conversations/${conversation.id}/messages`)
      .set("Cookie", `token=${outsider.token}`)
      .attach("image", Buffer.from("not-an-image"), "attempt.png");

    expect(readResponse.status).toBe(403);
    expect(sendResponse.status).toBe(403);
    expect(uploadResponse.status).toBe(403);
  });

  it("rejects unauthenticated message requests", async () => {
    const response = await request(app).get(
      "/conversations/00000000-0000-0000-0000-000000000000/messages",
    );

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication required");
  });
});
