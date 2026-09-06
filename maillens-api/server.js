import http from "node:http";
import { validate } from "deep-email-validator";

const port = Number(process.env.PORT || 8787);
const MAX_BODY_BYTES = 4_096;
const VALIDATION_TIMEOUT_MS = Number(process.env.VALIDATION_TIMEOUT_MS || 12_000);

function validateWithTimeout(options) {
  let timeout;
  const validation = validate(options);
  const deadline = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error("Verification timed out.")), VALIDATION_TIMEOUT_MS);
  });

  return Promise.race([validation, deadline]).finally(() => clearTimeout(timeout));
}

function send(response, status, body) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(body));
}

function mapResult(email, result) {
  const validators = result.validators || {};
  const reason = validators[result.reason]?.reason || result.reason || "Verification complete";
  let status = result.valid ? "valid" : "invalid";
  if (!result.valid && ["smtp", "mx"].includes(result.reason)) status = "risky";

  return {
    email,
    status,
    reason,
    score: result.valid ? 90 : status === "risky" ? 45 : 0,
    details: validators
  };
}

function createVerifierServer() {
  return http.createServer((request, response) => {
    if (request.method === "OPTIONS") return send(response, 204, {});

    if (request.method === "GET" && (request.url === "/" || request.url === "/health")) {
      return send(response, 200, { status: "ok", service: "maillens-api" });
    }

    if (request.method !== "POST" || request.url !== "/verify") {
      return send(response, 404, { error: "Use POST /verify or GET /health." });
    }

    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) request.destroy();
    });

    request.on("end", async () => {
      try {
        const { email } = JSON.parse(body);
        if (typeof email !== "string" || !email.trim()) {
          return send(response, 400, { error: "A non-empty email is required." });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const result = await validateWithTimeout({
          email: normalizedEmail,
          validateRegex: true,
          validateTypo: true,
          validateDisposable: true,
          validateMx: true,
          validateSMTP: true
        });
        send(response, 200, mapResult(normalizedEmail, result));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Verification failed.";
        send(response, message === "Verification timed out." ? 504 : 500, { error: message });
      }
    });
  });
}

const serverV4 = createVerifierServer();
serverV4.listen(port, "127.0.0.1", () => {
  console.log(`MailLens API listening on http://127.0.0.1:${port}`);
});

const serverV6 = createVerifierServer();
serverV6.on("error", (err) => {
  // Gracefully handle IPv6 dual-stack conflicts or unavailability
  if (err.code !== "EADDRINUSE") {
    console.warn(`IPv6 listener warning: ${err.message}`);
  }
});
try {
  serverV6.listen(port, "::1", () => {
    console.log(`MailLens API listening on http://localhost:${port}`);
  });
} catch {
  // Ignored if IPv6 is unsupported
}
