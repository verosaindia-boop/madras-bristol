# Madras Bristol website

The deployable site is at the repository root: static pages and images in `public/`, serverless handlers in `api/`, and Vercel configuration in `vercel.json`. Keep the Vercel project's Root Directory at the repository root (the default), with Framework Preset **Other** and no custom build command.

## Email setup

Set `SMTP_USER` and `SMTP_PASS` in the Vercel project's Production environment (the older `EMAIL_USER` and `EMAIL_PASSWORD` names are also accepted). The authenticated Hostinger mailbox sends reservations and contact enquiries to `booking@madrasbristol.com`. Do not commit SMTP credentials. Redeploy after adding or updating the variables. The page reports delivery failure to visitors if SMTP is unavailable.

## Local checks

```sh
npm ci
npm test
```

The tests stub SMTP, so they do not send real mail. For a final production check, make one booking enquiry with an address controlled by the restaurant and confirm the message arrives in its mailbox.
