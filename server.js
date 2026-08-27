import http from "node:http";
import { validate } from "deep-email-validator";

const port = Number(process.env.PORT || 8787);
const MAX_BODY_BYTES = 4_096;

function send(response, status, body) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

http.createServer((request, response) => {
  if (request.method === "OPTIONS") return send(response, 204, {});
  if (request.method !== "POST" || request.url !== "/verify") {
    return send(response, 404, { error: "Use POST /verify." });
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
      const result = await validate({
        email: normalizedEmail,
        validateRegex: true,
        validateTypo: true,
        validateDisposable: true,
        validateMx: true,
        validateSMTP: true
      });
      send(response, 200, mapResult(normalizedEmail, result));
    } catch (error) {
      send(response, 500, { error: error instanceof Error ? error.message : "Verification failed." });
    }
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`MailLens verifier listening on http://localhost:${port}`);
});
