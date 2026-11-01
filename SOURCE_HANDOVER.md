# Source handover 29.3

This local derivative includes persistent password accounts, mandatory login,
Google OAuth, Apple authorization with signed-token validation, and verification/
recovery email transport. External services require owner configuration; none
are represented as live-tested. See START_HERE.txt for exact requirements.

Runtime records, private files, API secrets and node_modules are excluded.
The live hosted site was not changed. npm install and npm run dev prepare the
local database automatically; existing data and changed passwords are preserved.
