import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../lib/prisma.js";

describe("Users", () => {
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

	it("lists other users without including the current user", async () => {
		const tester = await createUser("Tester", "tester@example.com");
		const alice = await createUser("Alice", "alice@example.com");

		const response = await request(app)
			.get("/users/")
			.set("Cookie", `token=${tester.token}`);

		expect(response.status).toBe(200);
		expect(response.body.map((user) => user.id)).toEqual([alice.user.id]);
		expect(response.body[0].username).toBe("Alice");
	});

	it("returns an empty list when there are no other users", async () => {
		const tester = await createUser("Tester", "tester@example.com");

		const response = await request(app)
			.get("/users/")
			.set("Cookie", `token=${tester.token}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual([]);
	});

	it("returns a profile by ID and reports missing profiles as not found", async () => {
		const tester = await createUser("Tester", "tester@example.com");

		const profileResponse = await request(app)
			.get(`/users/${tester.user.id}`)
			.set("Cookie", `token=${tester.token}`);
		const missingResponse = await request(app)
			.get(`/users/${randomUUID()}`)
			.set("Cookie", `token=${tester.token}`);

		expect(profileResponse.status).toBe(200);
		expect(profileResponse.body.username).toBe("Tester");
		expect(missingResponse.status).toBe(404);
		expect(missingResponse.body.error).toBe("User not found");
	});

	it("updates the authenticated user's profile details", async () => {
		const tester = await createUser("Tester", "tester@example.com");

		const response = await request(app)
			.patch("/users/me")
			.set("Cookie", `token=${tester.token}`)
			.send({
				username: "UpdatedTester",
				displayName: "Updated Name",
				bio: "A short profile bio",
			});

		expect(response.status).toBe(200);
		expect(response.body.username).toBe("UpdatedTester");
		expect(response.body.displayName).toBe("Updated Name");
		expect(response.body.bio).toBe("A short profile bio");

		const storedUser = await prisma.user.findUnique({
			where: { id: tester.user.id },
		});
		expect(storedUser.username).toBe("UpdatedTester");
		expect(storedUser.bio).toBe("A short profile bio");
	});

	it("does not allow profile updates to override media or target another user", async () => {
		const tester = await createUser("Tester", "tester@example.com");
		const target = await createUser("Target", "target@example.com");

		const response = await request(app)
			.patch("/users/me")
			.set("Cookie", `token=${tester.token}`)
			.send({
				userId: target.user.id,
				avatar: "https://attacker.example/image.svg",
				banner: "https://attacker.example/banner.svg",
				bio: "Attempted profile takeover",
			});

		const testerAfter = await prisma.user.findUnique({
			where: { id: tester.user.id },
		});
		const targetAfter = await prisma.user.findUnique({
			where: { id: target.user.id },
		});

		expect(response.status).toBe(400);
		expect(testerAfter.avatar).toBeNull();
		expect(testerAfter.banner).toBeNull();
		expect(testerAfter.bio).toBeNull();
		expect(targetAfter.bio).toBeNull();
	});

	it("rejects oversized profile fields", async () => {
		const tester = await createUser("Tester", "tester@example.com");

		const response = await request(app)
			.patch("/users/me")
			.set("Cookie", `token=${tester.token}`)
			.send({ bio: "a".repeat(2001) });

		expect(response.status).toBe(400);
		expect(response.body.error).toBe("Invalid bio");
	});

	it("rejects unauthenticated profile operations", async () => {
		const readResponse = await request(app).get(`/users/${randomUUID()}`);
		const updateResponse = await request(app)
			.patch("/users/me")
			.send({ bio: "No session" });

		expect(readResponse.status).toBe(401);
		expect(updateResponse.status).toBe(401);
	});

	it("rejects avatar and banner updates without files", async () => {
		const tester = await createUser("Tester", "tester@example.com");

		const avatarResponse = await request(app)
			.patch("/users/me/avatar")
			.set("Cookie", `token=${tester.token}`);
		const bannerResponse = await request(app)
			.patch("/users/me/banner")
			.set("Cookie", `token=${tester.token}`);

		expect(avatarResponse.status).toBe(400);
		expect(avatarResponse.body.error).toBe("Avatar image is required");
		expect(bannerResponse.status).toBe(400);
		expect(bannerResponse.body.error).toBe("Banner image is required");
	});

	it("rejects SVG and oversized avatar uploads before storage", async () => {
		const tester = await createUser("Tester", "tester@example.com");
		const svgResponse = await request(app)
			.patch("/users/me/avatar")
			.set("Cookie", `token=${tester.token}`)
			.attach(
				"avatar",
				Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"),
				{ filename: "avatar.svg", contentType: "image/svg+xml" },
			);
		const spoofedMimeResponse = await request(app)
			.patch("/users/me/avatar")
			.set("Cookie", `token=${tester.token}`)
			.attach(
				"avatar",
				Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"),
				{ filename: "avatar.png", contentType: "image/png" },
			);
		const oversizedResponse = await request(app)
			.patch("/users/me/avatar")
			.set("Cookie", `token=${tester.token}`)
			.attach("avatar", Buffer.alloc(5 * 1024 * 1024 + 1), {
				filename: "large.png",
				contentType: "image/png",
			});

		expect(svgResponse.status).toBe(415);
		expect(svgResponse.body.error).toBe("Only raster image uploads are supported");
		expect(spoofedMimeResponse.status).toBe(415);
		expect(spoofedMimeResponse.body.error).toBe("Unsupported avatar image contents");
		expect(oversizedResponse.status).toBe(413);
		expect(oversizedResponse.body.error).toBe("Uploaded file is too large");
	});
});
