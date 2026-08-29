const DEFAULT_API_URL = "http://127.0.0.1:8787";
const REQUEST_TIMEOUT_MS = 15_000;

function getUnavailableReason(apiUrl, error) {
  const message = error instanceof Error ? error.message : "Unknown connection error";

  if (message === "Failed to fetch" || error?.name === "AbortError") {
    return `Could not reach the verifier at ${apiUrl}. Start it with npm start, then try again.`;
  }

  if (message.startsWith("Verification timed out")) {
    return "Verification timed out. Please try again.";
  }

  return `MailLens verifier is unavailable: ${message}`;
}

async function verifyEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  const { verifierApiUrl = DEFAULT_API_URL } = await chrome.storage.local.get("verifierApiUrl");
  const configuredUrl = verifierApiUrl === "http://localhost:8787" ? DEFAULT_API_URL : verifierApiUrl;
  const apiUrl = configuredUrl.replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${apiUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      signal: controller.signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Verification service error");
    return result;
  } catch (error) {
    return {
      email,
      status: "unknown",
      reason: getUnavailableReason(apiUrl, error),
      score: null
    };
  } finally {
    clearTimeout(timeout);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type === "VERIFY_EMAIL") {
    verifyEmail(message.email).then(respond).catch((error) => {
      respond({
        email: String(message.email || "").trim().toLowerCase(),
        status: "unknown",
        reason: getUnavailableReason(DEFAULT_API_URL, error),
        score: null
      });
    });
    return true;
  }

  if (message.type === "VERIFY_EMAILS") {
    Promise.all((message.emails || []).map(verifyEmail)).then(respond).catch(() => {
      respond((message.emails || []).map((email) => ({
        email: String(email || "").trim().toLowerCase(),
        status: "unknown",
        reason: "Verification could not be completed. Please try again.",
        score: null
      })));
    });
    return true;
  }
});
