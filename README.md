# Kanban Board

A modern, responsive **Kanban board web application** inspired by Trello. Built with **React**, **TypeScript**, **Tailwind CSS**, and **Zustand** for state management. Supports drag-and-drop, dark/light themes, and customizable user settings.

---

## ✨ Features

### 📋 Kanban Board
- Create, edit, and delete tasks
- Drag-and-drop tasks between columns
- Task categories and quick actions

### ⚙️ User Settings
- Dark and light theme toggle
- Auto-save changes
- Notification and email digest preferences
- Language and timezone selection

### 📊 Progress Tracking
- Visual progress circles with dynamic colors based on completion rate

### ♿ Accessibility
- High-contrast colors and keyboard focus indicators

### 📱 Responsive Design
- Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript |
| Styling | Tailwind CSS, custom CSS variables |
| State Management | Zustand |
| Icons | Lucide React |
| Animations | CSS keyframes (`fadeIn`, `scaleIn`, `slideInLeft`) |
| Persistence | LocalStorage (optional, for auto-save) |

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdelhamed-Elsayed/kanban.git
   cd kanban-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
/src
  /components   # Reusable UI components (Toggle, SettingRow, Section, etc.)
  /pages        # Application pages (Dashboard, Analytics, Settings)
  /store        # Zustand state management
  /styles       # Global CSS & Tailwind configuration
  /data         # Optional JSON files for task data
```

---

## 🎨 Customization

- **Theme:** Toggle between dark and light mode in Settings
- **Language & Timezone:** Choose from multiple options in Settings
- **Auto-save & Notifications:** Enable or disable in Settings
- **Task Categories:** Organize tasks by project or type

---

## 🚀 Roadmap

- [ ] User authentication and multi-user boards
- [ ] Backend API integration for persistent storage
- [ ] Advanced filters and task search
- [ ] Email and push notification support