# Front Intranet

Corporate Intranet System developed with the latest technologies from the React ecosystem. The project offers a modern and responsive interface for internal communication and task management.

## 🚀 Technologies Used

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library**: [React 19](https://react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Carousel**: [Swiper](https://swiperjs.com/)

## ✨ Features

The system includes several integrated modules:

- **🔐 Authentication**: Secure login system.
- **📅 Calendar**: Visualization of corporate events.
- **📋 Tasks (Kanban)**: Kanban-style task management (To Do, In Progress, Done) with details, editing, and archiving.
- **📰 News**: Corporate news feed with image support.
- **📂 Documents**: Document repository with filters.
- **🗣️ Ombudsman**: Channel for sending and tracking requests and feedback.
- **🎂 Birthdays**: Widget to view the birthdays of the month.
- **🔗 Quick Access & Useful Links**: Shortcuts to external tools and sites.
- **🖼️ Image Gallery**: Component for viewing photos.

## 📂 Project Structure

The folder structure follows the **Next.js App Router** pattern:

```
app/
├── (auth)/            # Authentication routes (Login)
├── (dashboard)/       # Protected main dashboard routes
│   ├── calendario/    # Calendar Module
│   ├── documentos/    # Documents Module
│   ├── noticias/      # News Module
│   ├── ouvidoria/     # Ombudsman Module
│   └── tarefas/       # Tasks Module
├── components/        # Reusable components (UI)
│   ├── tasks/         # Components specific to the tasks module
│   └── ...
├── layout/            # Layout components (Sidebar, Header)
└── views/             # Specific views (e.g., login screen)
```

## 🛠️ Installation and Execution

Prerequisites: Node.js (version compatible with Next.js 16).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/front-intranet.git
   cd front-intranet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the project:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev`: Starts the development environment.
- `npm run build`: Creates the optimized production build.
- `npm run start`: Starts the production server locally.
- `npm run lint`: Runs code verification with ESLint.

---
Developed with Next.js and ❤️.
