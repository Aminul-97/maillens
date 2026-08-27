const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_ACCOUNTS = new Set([
  "admin", "billing", "contact", "help", "hello", "info", "jobs", "legal",
  "marketing", "privacy", "sales", "support", "team"
]);

function verifyEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  const localPart = email.split("@")[0] || "";

  if (!EMAIL_PATTERN.test(email)) {
    return { email, status: "invalid", reason: "Invalid email format", score: 0 };
  }

  if (ROLE_ACCOUNTS.has(localPart)) {
    return { email, status: "risky", reason: "Role-based address", score: 55 };
  }

  return { email, status: "valid", reason: "Syntax looks valid", score: 90 };
}

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type === "VERIFY_EMAIL") {
    respond(verifyEmail(message.email));
  }

  if (message.type === "VERIFY_EMAILS") {
    respond((message.emails || []).map(verifyEmail));
  }
});
