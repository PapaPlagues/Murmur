import { describe, expect, it } from "vitest";
import { getAllowedOrigins } from "../src/utils/allowedOrigins.js";

describe("CORS origin selection", () => {
  it("excludes the development origin in production", () => {
    expect(
      getAllowedOrigins({
        isProduction: true,
        devOrigin: "http://localhost:5173",
        productionOrigin: "https://murmur.example",
      }),
    ).toEqual(["https://murmur.example"]);
  });

  it("allows configured development and production origins outside production", () => {
    expect(
      getAllowedOrigins({
        isProduction: false,
        devOrigin: "http://localhost:5173",
        productionOrigin: "https://murmur.example",
      }),
    ).toEqual(["http://localhost:5173", "https://murmur.example"]);
  });

  it("does not include missing origins", () => {
    expect(
      getAllowedOrigins({
        isProduction: true,
        devOrigin: "http://localhost:5173",
        productionOrigin: undefined,
      }),
    ).toEqual([]);
  });

  it("normalizes configured frontend URLs to their origins", () => {
    expect(
      getAllowedOrigins({
        isProduction: true,
        productionOrigin: "https://murmur.example/some/path/",
      }),
    ).toEqual(["https://murmur.example"]);
  });

  it("allows multiple explicitly configured production frontend origins", () => {
    expect(
      getAllowedOrigins({
        isProduction: true,
        productionOrigin:
          "https://murmur.example, https://murmur-kj71fmgip-papaplagues1.vercel.app/",
      }),
    ).toEqual([
      "https://murmur.example",
      "https://murmur-kj71fmgip-papaplagues1.vercel.app",
    ]);
  });

  it("ignores malformed configured origins", () => {
    expect(
      getAllowedOrigins({
        isProduction: true,
        productionOrigin: "murmur.example",
      }),
    ).toEqual([]);
  });

  it("rejects non-web origins", () => {
    expect(
      getAllowedOrigins({
        isProduction: true,
        productionOrigin: "file:///some/path",
      }),
    ).toEqual([]);
  });
});