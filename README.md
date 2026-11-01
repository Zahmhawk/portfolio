
# Portfolio

This is my personal portfolio website.

## Local Development

Requires Node.js 24+.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Authentication Setup

Read `START_HERE.txt` for initial administrator login, Google/Apple registration, email verification and password reset setup.

All integration fields are listed in `.dev.vars.example`.

Keep `.dev.vars` and `.wrangler` state private and backed up.

## Security

Mandatory server-side authentication uses hashed passwords and server-validated, revocable sessions.

Only owner accounts have administrator access.

There is no platform mock identity. Anonymous sign-in does not assume a visitor name.

New email accounts require configured verification delivery.

Google and Apple are unavailable until their real provider configuration is present.

Apple needs an HTTPS domain and cannot work directly on localhost.

## Deployment Notes

No external provider sign-in or inbox delivery is claimed as tested.

This is a local derivative; it does not replace or deploy the online Sites project.
