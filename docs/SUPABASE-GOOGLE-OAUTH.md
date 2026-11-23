# Google OAuth and owner setup

This project uses Supabase Auth for identity and the public church site at:

- App origin: https://esperanzadevida.github.io
- GitHub Pages base path: /home
- Supabase project ref: bbeekinrotbobyaeokmg

Google sign-in identifies a person. It never sets their account role. New OAuth profiles start as visitors; the protected admin-users Edge Function is the only client-facing path for account-role changes.

## Google Cloud Console

Use a Google Cloud project controlled by the church/site owners. The screenshot showed a project called “My First Project”; confirm it belongs to this app before creating credentials or changing its audience.

In Google Auth Platform:

1. Configure Branding with the church app name, a support contact, and the public home page.
2. Set Audience to External for Google accounts outside a single Workspace organization.
3. Keep the app in Testing while configuring and verifying the login. Add the two previously authorized owner accounts to Test users.
4. In Data Access, request only the identity scopes required for login: `openid`, `https://www.googleapis.com/auth/userinfo.email`, and `https://www.googleapis.com/auth/userinfo.profile`. Do not add Drive, Gmail, Calendar, or Cloud Platform scopes.
5. Under Clients, create an OAuth client with application type Web application.
6. Add this Authorized JavaScript origin:

   https://esperanzadevida.github.io

7. Add this Authorized redirect URI exactly:

   https://bbeekinrotbobyaeokmg.supabase.co/auth/v1/callback

8. Copy the generated Client ID and Client Secret directly into Supabase Auth provider settings. Do not save the secret in this repository, GitHub Actions, a local .env file committed to Git, or chat.

When the app is ready for all Google users, review Google’s audience and brand verification requirements before changing the publishing status from Testing.

## Supabase Auth

In Authentication → URL Configuration:

- Site URL: https://esperanzadevida.github.io/home/
- Additional redirect URL: https://esperanzadevida.github.io/home/**
- Development redirects: http://localhost:3000/** and http://127.0.0.1:3000/**

In Authentication → Providers → Google:

- Enable Google.
- Paste the Google OAuth Client ID and Client Secret.
- Save.

The Google provider callback above is different from the post-login app redirect. Google returns to Supabase; Supabase then sends the browser to the GitHub Pages route.

## Publish the browser configuration

Set these GitHub Actions repository variables or secrets for the Pages build:

- NEXT_PUBLIC_SUPABASE_URL = https://bbeekinrotbobyaeokmg.supabase.co
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = the project’s sb_publishable key

Never set the Supabase service-role or secret key in a NEXT_PUBLIC variable.

## Apply the database and function changes

1. Apply the project migrations in order, including the existing initial schema and the new migration named auth_google_profiles_and_admin_user_management.
2. Set the Edge Function secret BOOTSTRAP_OWNER_EMAILS to the two authorized owner emails, separated by a comma. Enter the value in Supabase Dashboard → Edge Functions → Secrets; do not commit it.
3. Deploy the admin-users Edge Function with JWT verification enabled. It also checks the caller’s current profile role on every privileged operation.
4. In the app, open /home/login/?setup=owner and sign in with one authorized Google account. The function grants the first owner only when the allowlist matches and no owner profile exists.
5. The first owner can invite or promote the second account to Owner from Admin → Usuarios. A second owner may not need a new invitation if the account already exists.
6. Confirm both owners can sign in and that a non-owner Google account stays a Visitor. Keep at least one active owner; the function prevents disabling or demoting the last one.

## Configuration still needed in the live services

The application code and migration are prepared locally. This session did not have access to the matching Google Cloud project, the target Supabase project, or an authenticated browser session in Google Cloud Console. Therefore no provider credentials, allowed redirects, migrations, function secrets, invitations, or deployment have been written to those services yet.

References:

- Supabase Google sign-in: https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase Edge Function security: https://supabase.com/docs/guides/functions/auth
- Google OAuth web client: https://developers.google.com/identity/protocols/oauth2/web-server
- Google OAuth audience and test users: https://developers.google.com/identity/protocols/oauth2/production-readiness/overview
