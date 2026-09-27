# Brevo and backend reliability

Fill SMTP_USER and SMTP_PASS in the ignored local .env using the SMTP login/key at https://app.brevo.com/settings/keys/smtp. EMAIL_FROM must be a verified Brevo sender. CONTACT_EMAIL is the receiving inbox for contact forms; it defaults to EMAIL_FROM. Existing EMAIL_USER/EMAIL_PASS are retained locally but are no longer used to send mail. Other existing secrets were preserved.

Brevo documentation: https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP

Run `npm run email:verify` to check connection/authentication without sending mail. This does not prove sender verification or inbox delivery. Restart the server after changing SMTP settings. No credentials or sender were available during this change, so live delivery remains unverified.

Run `npm start`. Startup waits for MongoDB and requires JWT secrets. GET /health reports process health; GET /ready returns 503 until MongoDB is ready. Database outages return 503 from API routes. Configure your deployment to probe /ready. Configure TRUST_PROXY_HOPS to match your hosting topology; see Render deployment below.

Run `npm run test:reliability` for isolated regression tests, which mock external dependencies. The old module integration tests are not a production acceptance suite: some reference obsolete routes, invalid IDs or undefined model variables, and several call dropDatabase on MONGODB_URI_TEST. Only run those after repairing them against an explicitly disposable test database. They were not executed against the existing .env database.

Client-visible changes:
- Invalid data, duplicate records and expired tokens receive appropriate 400/409/401 responses in the shared handler. Unexpected errors hide internal details.
- Cart routes require authentication and ownership. Profile edits accept only profile fields, not email/security/account state. User-scoped consent, walkthrough, face verification and order access enforce ownership.
- Registration can return 503 after an account was saved if SMTP fails. POST /api/users/resend-verification with { "email": "..." } provides recovery. Password-reset delivery failures also return 503.
- Contact messages remain saved if admin email delivery fails; notification delivery is best effort and failures are logged. There is no durable email retry queue.
- Checkout validates quantities and address, uses catalog/variant prices, and sets payments Pending. Client payment status and transaction data are no longer trusted.
- The refund endpoint returns 501 because no gateway refund implementation exists. Cancellation requests a refund for completed payments; it does not claim money has been returned.

Remaining production work: verify SMTP sender/delivery, run checkout against a disposable MongoDB replica set (transactions require one), implement gateway payment verification/refund processing, add idempotency for checkout, durable email/notification retries, audit remaining module authorization, and reconcile analytics writes with transaction outcomes. The changes do not guarantee elimination of all server errors or constitute an exhaustive security audit.


## Render deployment

The server uses .env (or Render dashboard environment variables); .env.production is a local saved copy. Set TRUST_PROXY_HOPS=1 for Render's reverse-proxy entrypoint and SMTP_PORT=2525 for Brevo on Render free instances. Keep SMTP_HOST=smtp-relay.brevo.com and existing SMTP credentials. The application defaults to one trusted hop when RENDER=true, otherwise zero; explicit TRUST_PROXY_HOPS takes precedence. Do not use unrestricted trust proxy=true. Reassess the hop setting if additional proxies or direct ingress paths are introduced.

Render documents blocked outbound ports 25, 465 and 587 on free instances. Port 2525 is supported by Brevo, but delivery must still be verified from the deployed service. Run pnpm email:verify there to test SMTP connection/authentication without sending mail. If it still times out, inspect outbound connectivity or use Brevo's HTTPS API (requires a separate API integration/key).

A registration 503 after email failure can leave an unverified account saved. For that account use POST /api/users/resend-verification with an email field; repeated registration correctly returns 409. Neither changing the proxy setting nor changing the SMTP port removes existing accounts.
