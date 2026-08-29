const input = document.querySelector("#api-url");
const status = document.querySelector("#status");

chrome.storage.local.get("verifierApiUrl").then(({ verifierApiUrl }) => {
  input.value = verifierApiUrl === "http://localhost:8787" ? "http://127.0.0.1:8787" : verifierApiUrl || "http://127.0.0.1:8787";
});

document.querySelector("#save").addEventListener("click", async () => {
  const verifierApiUrl = input.value.trim().replace(/\/$/, "");
  if (!/^https?:\/\//.test(verifierApiUrl)) {
    status.textContent = "Enter a complete http:// or https:// URL.";
    return;
  }

  const origin = new URL(verifierApiUrl).origin;
  const hasAccess = await chrome.permissions.contains({ origins: [`${origin}/*`] });
  if (!hasAccess) {
    const granted = await chrome.permissions.request({ origins: [`${origin}/*`] });
    if (!granted) {
      status.textContent = "MailLens needs access to that verifier URL.";
      return;
    }
  }

  await chrome.storage.local.set({ verifierApiUrl });
  status.textContent = "Saved.";
});
