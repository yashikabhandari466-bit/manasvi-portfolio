# Manasvi — Journalist Portfolio

A responsive React portfolio with a private admin login and persistent image uploads using Supabase Storage.

## 1. Requirements

- Node.js 18+ (LTS recommended)
- A Supabase account: https://supabase.com/
- A code editor such as VS Code

## 2. Run the website locally

Open this project folder in VS Code. Open Terminal and run:

```bash
npm install
```

Create a file named `.env` in the project root (same folder as `package.json`). Copy the values from `.env.example` and replace them with your Supabase project values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

In Supabase, find the Project URL and anon/public (or publishable) key under Project Settings > API. The browser key is intended for frontend use; never put a `service_role` or secret key in this file.

Then run:

```bash
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## 3. Set up permanent photo storage

1. Create a Supabase project.
2. Open SQL Editor in the Supabase dashboard.
3. Open `supabase-setup.sql` from this project, copy all its contents and run it.
4. This creates a public image bucket named `portfolio-media`, a gallery table and access policies.
5. Open Authentication > Users and create the admin user with Manasvi's email and a strong password.
6. Use that email and password in the website's Admin window.
7. Upload an image, title and category. It will be saved in Supabase Storage and shown in the public gallery.

The bucket is public for viewing portfolio images. Uploading and deleting require the authenticated admin account. Do not share the admin password.

## 4. Publish the website

A straightforward option is Vercel:

1. Push this project to a private or public GitHub repository.
2. Import the repository into https://vercel.com/.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Project Settings > Environment Variables.
4. Deploy.
5. Add your deployed website domain to Supabase Authentication > URL Configuration > Site URL and Redirect URLs.

You can also host the built `dist` folder on another static hosting provider.

## 5. Personalise before publishing

- Replace the portrait placeholder with Manasvi's real photograph. For now, upload photos in Admin to populate the gallery; the hero portrait is a placeholder area.
- Check the education dates and update if needed.
- Add a professional email address if you want email contact on the page.
- Add verified work samples, video links and publication links when available.
- Confirm that Manasvi has permission to publish every photograph, especially event guests and children.

## Notes

- Uploaded image files are stored in Supabase Storage, not only in the browser, so they persist across devices and deployments while the Supabase project and storage remain active.
- This starter currently accepts image files up to 10 MB. Video upload is not enabled.
- Supabase free-plan quotas and inactivity policies may change; check the current plan limits and keep a backup of original media.
- The admin login uses Supabase email/password authentication. Create the admin user from the Supabase dashboard; public sign-up is not implemented.
