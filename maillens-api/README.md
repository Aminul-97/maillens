# MailLens API

Email validation service powered by `deep-email-validator`.

## Prerequisites

- Node.js 20 or newer

## Installation

```bash
cd maillens-api
npm install
```

## Running the API

```bash
npm start
```

By default, the server runs on `http://127.0.0.1:8787`. You can customize the port via the `PORT` environment variable:

```bash
PORT=9000 npm start
```

## Endpoints

### `GET /health`
Health check endpoint to verify that the service is running.

**Response:**
```json
{
  "status": "ok",
  "service": "maillens-api"
}
```

### `POST /verify`
Performs deep email validation including regex, typo, disposable domain, MX record, and SMTP verification.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "email": "user@example.com",
  "status": "valid",
  "reason": "Verification complete",
  "score": 90,
  "details": {
    "regex": { "valid": true },
    "typo": { "valid": true },
    "disposable": { "valid": true },
    "mx": { "valid": true },
    "smtp": { "valid": true }
  }
}
```
