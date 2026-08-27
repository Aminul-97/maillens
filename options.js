const input = document.querySelector("#api-url");
const status = document.querySelector("#status");

chrome.storage.local.get("verifierApiUrl").then(({ verifierApiUrl }) => {
  input.value = verifierApiUrl || "http://localhost:8787";
});

document.querySelector("#save").addEventListener("click", async () => {
  const verifierApiUrl = input.value.trim().replace(/\/$/, "");
  if (!/^https?:\/\//.test(verifierApiUrl)) {
    status.textContent = "Enter a complete http:// or https:// URL.";
    return;
  }
  await chrome.storage.local.set({ verifierApiUrl });
  status.textContent = "Saved.";
});
