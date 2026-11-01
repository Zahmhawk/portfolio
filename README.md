# Portfolio localhost 29.3

Requires Node.js 24+. Run `npm install` and `npm run dev`.

Read START_HERE.txt for initial administrator login, Google/Apple registration,
email verification and password reset setup. All integration fields are listed
in .dev.vars.example. Keep .dev.vars and .wrangler state private and backed up.

Mandatory server-side authentication uses hashed passwords and server-validated,
revocable sessions. Only owner accounts have administrator access. There is no
platform mock identity. Anonymous sign-in does not assume a visitor name.
New email accounts require configured verification delivery. Google and Apple
are unavailable until their real provider configuration is present. Apple needs
an HTTPS domain and cannot work directly on localhost.

No external provider sign-in or inbox delivery is claimed as tested. This is a
local derivative; it does not replace or deploy the online Sites project.
