| Feature                         | Description                                                  | Priority |
| ------------------------------- | ------------------------------------------------------------ | -------- |
| **Automatic email detection**   | Scan visible page content for email addresses                | MVP      |
| **Click-to-verify**             | Click an email to verify it                                  | MVP      |
| **Inline status badge**         | Show Valid / Invalid / Risky beside an email                 | MVP      |
| **Bulk verification**           | Verify all detected emails on a page                         | MVP      |
| **Extension popup**             | Show summary of detected emails and results                  | MVP      |
| **Side panel**                  | Persistent list of all emails found on the page              | High     |
| **Google Sheets verification**  | Verify emails from selected cells or columns                 | High     |
| **Bulk Sheet processing**       | Process hundreds/thousands of emails in batches              | High     |
| **Custom Sheet menu**           | Example: `Email Verifier → Verify Selected Column`           | High     |
| **Result columns**              | Write status, reason, score, provider, etc. beside the email | High     |
| **Disposable email detection**  | Detect temporary/disposable providers                        | High     |
| **Syntax validation**           | Check email format before API verification                   | MVP      |
| **Domain/MX validation**        | Check whether the domain can receive email                   | High     |
| **Catch-all detection**         | Identify catch-all domains                                   | High     |
| **Role-based detection**        | Flag `info@`, `sales@`, `support@`, etc.                     | Medium   |
| **Risk score**                  | Convert provider response into a simple 0–100 score          | Medium   |
| **Verification history**        | Store previous results                                       | Medium   |
| **Smart caching**               | Don't recheck recently verified emails                       | High     |
| **Duplicate removal**           | Detect and verify duplicate emails only once                 | High     |
| **Export results**              | CSV/Excel export                                             | Medium   |
| **Domain grouping**             | Group results by email domain                                | Medium   |
| **Auto-verify new emails**      | Detect new content using `MutationObserver`                  | Medium   |
| **Context menu**                | Right-click an email → Verify Email                          | Medium   |
| **Email extraction from links** | Detect `mailto:` links                                       | High     |
| **CRM/web app support**         | Better handling for LinkedIn-like CRMs, dashboards, web apps | Later    |
| **Team accounts**               | Shared credits and usage                                     | Later    |
| **Usage dashboard**             | API calls, credits, success rates                            | Later    |
| **Webhook/API access**          | Let other applications use your verification system          | Later    |

