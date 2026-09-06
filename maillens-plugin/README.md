# MailLens Chrome Extension

MailLens Chrome extension (Manifest V3) that discovers email addresses on active web pages and provides on-page and popup validation through the MailLens API.

## Features

- **Automatic email detection**: Scans web pages and detects text emails and `mailto:` links.
- **Click-to-verify badge**: Adds inline verification badges next to discovered emails.
- **Popup verification**: Displays all detected emails on the current page with a one-click "Verify all emails" action and live progress bar.
- **Configurable backend**: Set custom API URLs in the Options page (default is `http://127.0.0.1:8787`).

## Installation in Chrome

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click **Load unpacked**.
4. Select the `maillens-plugin` directory.

## Requirements

Ensure `maillens-api` is running on `http://127.0.0.1:8787` (or your configured URL) to perform email verification checks.
