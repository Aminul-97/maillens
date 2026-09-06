const summary = document.querySelector("#summary");
const verifyAll = document.querySelector("#verify-all");
const list = document.querySelector("#email-list");
const verifierStatus = document.querySelector("#verifier-status");
const progressContainer = document.querySelector("#progress-container");
const progressBarFill = document.querySelector("#progress-bar-fill");
const progressText = document.querySelector("#progress-text");
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
  if (progressContainer) progressContainer.style.display = "none";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    summary.textContent = "No active tab found";
    verifyAll.disabled = true;
    return;
  }
  try {
    emails = await chrome.tabs.sendMessage(tab.id, { type: "SCAN_PAGE" });
    if (!Array.isArray(emails)) {
      throw new Error("Invalid response");
    }
  } catch {
    const saved = await chrome.storage.local.get(["currentPageEmails", "currentPageUrl"]);
    if (saved.currentPageUrl === tab.url) {
      emails = saved.currentPageEmails || [];
    } else {
      emails = [];
    }
  }
  summary.textContent = `${emails.length} email${emails.length === 1 ? "" : "s"} found on this page`;
  verifyAll.disabled = emails.length === 0;
  render();
}

verifyAll.addEventListener("click", async () => {
  verifyAll.disabled = true;
  verifyAll.textContent = "Verifying…";
  verifierStatus.textContent = "";

  if (progressContainer) {
    progressContainer.style.display = "block";
    progressBarFill.style.width = "0%";
    progressText.textContent = `Verifying: 0/${emails.length}`;
  }

  let completed = 0;
  const results = [];

  try {
    const promises = emails.map(async (email) => {
      try {
        const result = await chrome.runtime.sendMessage({ type: "VERIFY_EMAIL", email });
        results.push(result);
      } catch (error) {
        const failedResult = {
          email,
          status: "unknown",
          reason: error instanceof Error ? error.message : "Verification could not be completed."
        };
        results.push(failedResult);
      } finally {
        completed++;
        if (progressContainer) {
          const percentage = Math.round((completed / emails.length) * 100);
          progressBarFill.style.width = `${percentage}%`;
          progressText.textContent = `Verifying: ${completed}/${emails.length}`;
        }
        render(results);
      }
    });

    await Promise.all(promises);

    const unavailable = results.find((result) => result.status === "unknown");
    verifierStatus.textContent = unavailable ? unavailable.reason : "";
  } catch {
    verifierStatus.textContent = "Verification could not be completed. Please try again.";
  } finally {
    verifyAll.disabled = emails.length === 0;
    verifyAll.textContent = "Verify all emails";
  }
});

initialize();
