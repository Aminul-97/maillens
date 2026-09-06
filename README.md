# MailLens

MailLens is a Chrome extension for finding email addresses on any web page and verifying their validity using `deep-email-validator` through a local or remote verification API service.

## Project Structure

```text
maillens/
├── maillens-api/          # Backend verification API service (Node.js)
│   ├── package.json
│   ├── server.js          # REST API (POST /verify, GET /health)
│   └── README.md
├── maillens-plugin/       # MailLens Chrome extension (Manifest V3)
│   ├── manifest.json
│   ├── background.js      # Service worker calling the verification API
│   ├── content.js         # On-page email scanner and inline badge injector
│   ├── content.css        # Badge styling
│   ├── popup.html/.js/.css# Extension popup with batch verification
│   ├── options.html/.js/.css# Settings page to configure API endpoint
│   └── README.md
├── package.json           # Root workspace scripts
└── README.md
```

## Quick Start

### 1. Start the Verification API (`maillens-api`)

The verifier is server-side because `deep-email-validator` requires Node.js and establishes DNS/SMTP connections.

```bash
cd maillens-api
npm install
npm start
```

Or from the repository root:

```bash
npm run install:api
npm run start:api
```

The API starts on `http://127.0.0.1:8787` by default. You can verify it is healthy:

```bash
curl http://127.0.0.1:8787/health
```

### 2. Load the Extension in Chrome (`maillens-plugin`)

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `maillens-plugin` directory.
5. Navigate to any web page with email addresses and use MailLens from your extension toolbar or via inline badges.
