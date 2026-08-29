const EMAIL_FINDER = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const MARKER_CLASS = "maillens-processed";

function findEmails() {
  const found = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.parentElement?.closest("script, style, textarea, .maillens-badge")) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue?.match(EMAIL_FINDER) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  while (walker.nextNode()) {
    for (const email of walker.currentNode.nodeValue.match(EMAIL_FINDER) || []) {
      found.add(email.toLowerCase());
    }
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const email = link.href.replace(/^mailto:/i, "").split("?")[0];
    if (email) found.add(email.toLowerCase());
  });

  return [...found];
}

function addBadge(email) {
  const targets = [...document.querySelectorAll("a, span, p, li, td, div")]
    .filter((element) => !element.classList.contains(MARKER_CLASS) && element.childElementCount === 0 && element.textContent.trim().toLowerCase() === email);

  targets.forEach((target) => {
    target.classList.add(MARKER_CLASS);
    const badge = document.createElement("button");
    badge.className = "maillens-badge maillens-pending";
    badge.type = "button";
    badge.textContent = "Verify";
    badge.title = `Verify ${email}`;
    badge.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      badge.disabled = true;
      badge.textContent = "Checking…";
      let result;
      try {
        result = await chrome.runtime.sendMessage({ type: "VERIFY_EMAIL", email });
      } catch {
        result = {
          status: "unknown",
          reason: "Verification could not be completed. Please try again."
        };
      }
      badge.className = `maillens-badge maillens-${result.status}`;
      badge.textContent = result.status;
      badge.title = result.reason;
      badge.disabled = false;
    });
    target.insertAdjacentElement("afterend", badge);
  });
}

async function scanPage() {
  const emails = findEmails();
  await chrome.storage.local.set({ currentPageEmails: emails, currentPageUrl: location.href });
  emails.forEach(addBadge);
  return emails;
}

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type === "SCAN_PAGE") scanPage().then(respond);
  if (message.type === "GET_EMAILS") respond(findEmails());
});

scanPage();
