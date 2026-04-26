# Learning Analytics Platform

A dynamic, role-based educational platform designed to bridge the gap between instructors and students (candidates) for Phero team. The platform features dedicated portals for assignment management, real-time feedback, smart AI-assisted teaching tools, and interactive data visualizations. 

## 🚀 Key Features

### 1. Role-Based Access Control & Authentication (Without NextAuth)
Instead of relying on heavy server-side authentication libraries like NextAuth, this project implements a fast, client-side **Role-Based Access Control (RBAC)** system using **Zustand** and `localStorage`. 

- **Session Management:** The `useAuthStore` manages the global authentication state (`user`, `isAuthenticated`). It assigns specific roles (`instructor` or `student`) upon login.
- **Route Protection:** Layout files (`app/instructor/layout.tsx` and `app/candidate/layout.tsx`) actively listen to the authentication state. If a user attempts to access a portal they do not have the role for (e.g., a student trying to access the instructor dashboard), the system instantly redirects them to the home page.
- **Data Persistence:** User sessions and submissions are persisted in the browser's local storage via Zustand's `persist` middleware, ensuring state is not lost upon page refresh.

### 2. The "Smart" Element: AI-Assisted Teaching
To significantly reduce an instructor's manual workload, the platform integrates strategic **Smart Assistance** logic. Rather than requiring external LLM API keys for the demo, this feature uses algorithmic pattern matching to simulate intelligent automation:

- **Auto-Generating Feedback:** When an instructor reviews a student's submission note, the `generatePreliminaryFeedback` algorithm analyzes the text for keywords related to code quality (e.g., "test", "complexity", "documentation"). It instantly drafts personalized, constructive feedback outlining the student's strengths and suggesting specific next steps.
- **Refining Assignment Descriptions:** Instructors can use the `refineAssignmentDescription` tool to optimize their assignment instructions. Based on the selected difficulty level (beginner, intermediate, advanced), the system automatically structures the description to include expected outcomes, deliverables, and reflection points.

### 3. Data Visualization with Recharts
To help instructors quickly identify struggling students and optimize their teaching strategies, raw submission data is transformed into actionable insights using **Recharts**.

- **Submission Status Distribution (Donut Chart):** Visualizes the exact proportion of submissions that are "Accepted", "Pending", or "Needs Improvement". If the "Needs Improvement" slice grows too large, the instructor knows to intervene and provide a class-wide review.
- **Submissions by Difficulty (Bar Chart):** Tracks the volume of submissions across Beginner, Intermediate, and Advanced assignments. This helps the instructor gauge student engagement and determine if the curriculum is advancing at the right pace.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **State Management:** Zustand (with persist middleware)
- **Charts/Analytics:** Recharts
- **Forms & Validation:** React Hook Form + Zod

## 💻 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **Testing Roles (Important Note):** 
   Because this application uses Local Storage to persist data instead of a backend database, **you must test the Instructor and Candidate flows in the exact same browser window**. If you open the Instructor portal in Chrome and the Candidate portal in an Incognito window, they will not share the same local storage state.

   *Flow: Log in as Candidate -> Submit Assignment -> Logout -> Log in as Instructor -> Review -> Logout -> Log in as Candidate -> View Feedback.*
   *Use email: [admin@gmail.com] and password:admin@gmail.com for both roles, just switch between them by logging out and logging in with the same email and password. 
   
