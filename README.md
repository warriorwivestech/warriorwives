
# Warrior Wives Unite

## About

[Warrior Wives Unite](https://usawarriorwives.com/) is a dedicated platform created for [USA Warrior Wives](https://usawarriorwives.org/), designed to help them connect and build meaningful communities no matter where they are in the world. The platform enables members to join and form groups based on shared interests, host and attend events, exchange valuable resources, and support one another through the unique journey of being a military spouse.

Security is a top priority for Warrior Wives Unite. The platform leverages [SheerID](https://sheerid.com/) for military wife verification and uses Google Authentication to ensure a safe and secure user experience.

**Note for recruiters**: Please be aware that for this project, the code quality, file organization, and naming conventions could definitely be improved. However, we prioritized speed to meet tight deadlines. This is not a reflection of our refactoring skills or our typical approach to maintaining high-quality code. These areas will be addressed in future iterations as we revisit and refine the project.

## Tech Stack
- [Next.js](https://nextjs.org/) for the frontend
- [Supabase](https://supabase.com/) for database and storage
- [Prisma](https://prisma.io/) for database
- [Auth.js](https://authjs.dev/) for authentication
- [SheerID](https://sheerid.com/) for identity verification
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://shadcn.com/) for UI components
- [Resend](https://resend.com/) for email sending
- [Render](https://render.com/) for hosting

## Contributors
### Nicholas Farm
- GitHub: [nickfarm27](https://github.com/nickfarm27)
- LinkedIn: [nicholas-farm](https://www.linkedin.com/in/nicholas-farm/)

### Daniel Yuen
- GitHub: [danielyuenhx](https://github.com/danielyuenhx)
- LinkedIn: [danielyuenhx](https://www.linkedin.com/in/danielyuenhx/)

### Zheng Jie
- GitHub: [ZhengJieGan](https://github.com/ZhengJieGan)
- LinkedIn: [gan-zheng-jie](https://www.linkedin.com/in/gan-zheng-jie-35631a171/)

---
## Getting Started
### Installation
1. Clone the repository
```bash
git clone https://github.com/WarriorWives/warriorwives.git
```
2. Install dependencies
```bash
npm install
```
3. Create a .env file in the root directory and add the following variables
```
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
NEXT_PUBLIC_MAPTILER_API_KEY=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_BLOB_URL=
NEXT_PUBLIC_BUCKET_NAME=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXT_AUTH_SECRET=
AUTH_TRUST_HOST=
AUTH_SECRET=
NOTIFICATIONS_EMAIL=
NEXT_PUBLIC_SHEERID_PROGRAM_ID
NEXT_PUBLIC_PLATFORM_GUIDE_URL
```
4. Run the development server
```bash
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the production server
1. Build the application
```bash
npm run build
```
1. Run the production server
```bash
npm start
```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
