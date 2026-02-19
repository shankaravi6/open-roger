This is the **Open Roger** client: a Next.js app for the human-approved, multi-agent software factory.

## Demo mode (frontend only, no backend / no DB)

- Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`, or leave `NEXT_PUBLIC_API_URL` unset.
- Open the dashboard. Create a project (e.g. “Create a Gym CRM from scratch”). Data is stored in **localStorage**.
- Use the dashboard: live folder structure, phase workflow, default agents, mock file contents. Approve phases to advance; add custom agents.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app runs on port **1000** by default. Open [http://localhost:1000](http://localhost:1000) to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
