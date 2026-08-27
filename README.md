# MailLens

MailLens is a Chrome extension for finding email addresses on a web page and checking their initial validity.

## Current MVP

- Detects visible email addresses and `mailto:` links
- Adds click-to-verify badges beside standalone email text
- Shows all discovered addresses in the extension popup
- Performs bulk syntax and role-account checks

## Load it in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked** and select this folder: `I:\maillens`.
4. Visit a page containing email addresses and open MailLens from the extensions toolbar.

## Next integration point

`background.js` holds the verification adapter. Replace its local `verifyEmail` function with the chosen verification API once credentials and provider are decided.
