# MailLens

MailLens is a Chrome extension for finding email addresses on a web page and checking their validity with `deep-email-validator`.

## Current MVP

- Detects visible email addresses and `mailto:` links
- Adds click-to-verify badges beside standalone email text
- Shows all discovered addresses in the extension popup
- Performs syntax, typo, disposable-domain, MX, and SMTP checks through a local verification service

## Load it in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked** and select this folder: `I:\maillens`.
4. Visit a page containing email addresses and open MailLens from the extensions toolbar.

## Start the verification service

The verifier is server-side because `deep-email-validator` requires Node.js and makes DNS/SMTP connections. Install Node.js 20 or newer, then run:

```powershell
npm install
npm start
```

It listens on `http://127.0.0.1:8787` by default. The extension uses that address by default; change it under **Extension options** when deploying the service elsewhere. MailLens asks for access when you save a custom verifier URL.
