import { describe, expect, it } from "vitest";
import { canSendRemoteApiKey } from "../src/main/hermes";

describe("remote API key transport policy", () => {
  it("allows HTTPS URLs when an API key is present", () => {
    expect(
      canSendRemoteApiKey("https://hermes.example.com:8642", "secret"),
    ).toBe(true);
  });

  it("allows HTTP loopback URLs for SSH tunnels when an API key is present", () => {
    expect(canSendRemoteApiKey("http://localhost:8642", "secret")).toBe(true);
    expect(canSendRemoteApiKey("http://127.0.0.1:8642", "secret")).toBe(true);
    expect(canSendRemoteApiKey("http://[::1]:8642", "secret")).toBe(true);
  });

  it("rejects plaintext HTTP to non-loopback hosts when an API key is present", () => {
    expect(canSendRemoteApiKey("http://192.168.1.100:8642", "secret")).toBe(
      false,
    );
    expect(
      canSendRemoteApiKey("http://hermes.example.com:8642", "secret"),
    ).toBe(false);
  });

  it("does not restrict unauthenticated HTTP connections", () => {
    expect(canSendRemoteApiKey("http://192.168.1.100:8642", "")).toBe(true);
  });
});
