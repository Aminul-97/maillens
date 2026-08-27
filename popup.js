const summary = document.querySelector("#summary");
const verifyAll = document.querySelector("#verify-all");
const list = document.querySelector("#email-list");
let emails = [];

function render(results = []) {
  list.replaceChildren(...emails.map((email) => {
    const result = results.find((item) => item.email === email);
    const item = document.createElement("li");
    item.innerHTML = `<span>${email}</span>${result ? `<b class="${result.status}">${result.status}</b>` : ""}`;
    return item;
  }));
}

async function initialize() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    emails = await chrome.tabs.sendMessage(tab.id, { type: "SCAN_PAGE" });
  } catch {
    const saved = await chrome.storage.local.get("currentPageEmails");
    emails = saved.currentPageEmails || [];
  }
  summary.textContent = `${emails.length} email${emails.length === 1 ? "" : "s"} found on this page`;
  verifyAll.disabled = emails.length === 0;
  render();
}

verifyAll.addEventListener("click", async () => {
  verifyAll.disabled = true;
  verifyAll.textContent = "Verifying…";
  const results = await chrome.runtime.sendMessage({ type: "VERIFY_EMAILS", emails });
  render(results);
  verifyAll.textContent = "Verified";
});

initialize();
