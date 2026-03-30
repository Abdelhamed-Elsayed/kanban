# Kanban Board Project

A modern and responsive **Kanban board web application** inspired by Trello. Built with **React, TypeScript, Tailwind CSS**, and **Zustand** for state management. The app supports **drag-and-drop**, **dark/light themes**, and **custom user settings**.

---

## 📝 Features

- **Kanban Board**
  - Create, edit, and delete tasks.
  - Drag-and-drop tasks between columns.
  - Task categories and quick actions.
- **User Settings**
  - Dark and light themes.
  - Auto-save changes.
  - Notifications and email digest preferences.
  - Language and timezone selection.
- **Completion Tracking**
  - Visual progress circles with dynamic colors based on completion rate.
- **Accessibility**
  - High contrast colors and keyboard focus indicators.
- **Responsive Design**
  - Works seamlessly on desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS, custom CSS variables
- **State Management:** Zustand
- **Icons:** Lucide React
- **Animations:** CSS keyframes (fadeIn, scaleIn, slideInLeft)
- **Optional:** LocalStorage for auto-save

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/kanban-board.git
   cd kanban-board

2. **Install dependencies:**
      npm install


3. **Run the development server:**
      npm run dev


4. **Preview the production build:**
    npm run preview


🎨 Customization
   Themes: Toggle dark/light mode in Settings.
   Language & Timezone: Choose from multiple options.
   Auto-save & Notifications: Enable or disable in Settings.
   Task Categories: Organize tasks by project or type.


📁 Project Structure
/src
  /components   - Reusable components (Toggle, SettingRow, Section, etc.)
  /pages        - Pages like Dashboard, Analytics, Settings
  /store        - Zustand state management
  /styles       - Global CSS & Tailwind setup
  /data         - Optional JSON files for tasks


🚀 Future Enhancements
       User authentication and multi-user boards.
       Backend API integration for persistent storage.
       Advanced filters and search for tasks.
       Notifications via email or push services.