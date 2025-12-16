# 🧾 AI Receipt Tracking App

An AI-powered receipt tracking application that automatically scans uploaded receipts, extracts structured data using AI, and securely stores it in a real-time database. Built with modern web technologies and workflow automation for reliability and scalability.

---

## ✨ Features

- 📸 Upload receipt images or PDFs
- 🤖 AI-powered receipt scanning & data extraction
- 🧠 Automated background workflows using Inngest
- 💾 Real-time database storage with Convex
- 🔐 Secure authentication with Clerk
- ✅ Schema validation using Zod
- ⚡ Fast, modern UI with shadcn/ui
- 🧩 Fully typed with TypeScript
- 🌐 Built on Next.js App Router

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Convex
- **Background Jobs / Workflows**: Inngest
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **Validation**: Zod
- **Language**: TypeScript
- **AI**: Tool-based AI receipt parsing

---

## 🧠 How It Works

1. User uploads a receipt (image or PDF)
2. File is securely stored and processed
3. Inngest triggers an AI workflow
4. AI scans the receipt and extracts details such as:
   - Merchant name
   - Date
   - Amount
   - Category
5. Validated data is saved to Convex database
6. User can view receipts in real-time

---

## 📂 Project Structure

```
├── app/ # Next.js App Router
├── components/ # UI components (shadcn)
├── convex/ # Convex schema, queries & mutations
├── inngest/ # Inngest workflows and agents
├── lib/ # Utilities and helpers
├── schemas/ # Zod validation schemas
├── public/ # Static assets
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Environment Variables

### Create a .env.local file and add the following:

``` env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ="your_next_public_clerk_publishable_key"
CLERK_SECRET_KEY = "clerk_secret_key"
CONVEX_DEPLOYMENT = ""
NEXT_PUBLIC_CONVEX_URL = ""
INNGEST_EVENT_KEY = ""
INNGEST_SIGNING_KEY = "" 
```
Make sure your Convex, Clerk, and Inngest projects are properly set up.


### 4️⃣ Run Convex

``` bash
npx convex dev
```

### 5️⃣ Run Inngest Dev Server
``` bash
npx inngest dev
```

### 6️⃣ Start the App
``` bash
npm run dev
```

Open http://localhost:3000 in your browser 🚀

## 🔐 Authentication

Authentication is handled using **Clerk**:

- Secure sign-up & sign-in
- User-based receipt ownership
- Protected routes

---

## 🧪 Validation

All AI-extracted data is validated using **Zod** before being saved to the database to ensure data integrity and correctness.

---

## 📌 Use Cases

- Personal expense tracking
- Business receipt management
- Automated bookkeeping
- Finance & accounting tools
- AI-powered document processing

---

## 🧑‍💻 Author

Built by **Dipanjan Roy**  
Computer Science Engineering student & full-stack developer  
Passionate about AI, backend systems, and scalable applications.

---

## 📜 License

This project is licensed under the **MIT License**.
