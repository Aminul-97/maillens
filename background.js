const DEFAULT_API_URL = "http://localhost:8787";

async function verifyEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  const { verifierApiUrl = DEFAULT_API_URL } = await chrome.storage.local.get("verifierApiUrl");

  try {
    const response = await fetch(`${verifierApiUrl.replace(/\/$/, "")}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Verification service error");
    return result;
  } catch (error) {
    return {
      email,
      status: "unknown",
      reason: `MailLens verifier is unavailable: ${error.message}`,
      score: null
    };
  }
}

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type === "VERIFY_EMAIL") {
    verifyEmail(message.email).then(respond);
    return true;
  }

  if (message.type === "VERIFY_EMAILS") {
    Promise.all((message.emails || []).map(verifyEmail)).then(respond);
    return true;
  }
});
