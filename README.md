# 🌱 EcoSync | Personal Carbon Tracker & Habit Builder

**EcoSync** is an interactive, highly responsive, and visually stunning web application designed to help individuals calculate, track, and systematically reduce their daily environmental footprint. 

Developed as a submission for **Prompt Wars Challenge 3**, EcoSync merges scientific emissions calculations with a gamified habit-building loop, dynamic sliders, and a smart context-aware AI assistant.

Live Demo: *[Insert your Netlify / Hosting URL here]*  
GitHub Repository: *[Insert your GitHub Repository URL here]*

---

## 📋 Project Documentation (Organizer Requirements)

### 1. Chosen Vertical
*   **Vertical**: Sustainability, Climate Action, and Ecological Coaching.
*   **Persona Design**: Designed around an empathetic, data-driven "Eco-Coach" persona. The system acts as a digital companion that does not just present numbers, but guides, quizzes, and rewards users through their daily habit transformations.

### 2. Approach and Logic
Our approach focuses on transforming abstract carbon numbers into concrete, actionable steps:
*   **Input Heuristics**: The app uses a multi-step questionnaire covering travel patterns, home utilities, dietary habits, and shopping behaviors.
*   **Real-time Math**: Inputs are immediately converted into carbon output values (in kilograms of CO2e per year) and categorized into four main sectors.
*   **Contextual AI Reasoning**: The **AI Assistant** component parses messages locally and reasons directly from the user's current calculations data. If the user's transportation emissions are the highest sector, the coach proactively steers suggestions toward transit reductions.
*   **Habit Gamification**: Daily tasks completed on the dashboard reward users with Eco-Hero points. Completing long-term catalog goals aggregates carbon offsets and advances their Eco-Hero rank.

### 3. How the Solution Works
1.  **Calculate (Stepper Wizard)**: Users fill in details about their car fuel, annual driving distance, flying hours, monthly electricity draw, diet style, and waste levels.
2.  **Visualize (Dashboard & SVG Donut)**: Computed results are shown alongside global average benchmarks and the Paris Agreement 2.0-tonne goal. An interactive SVG chart displays categorical proportions.
3.  **Simulate (Dynamic Sliders)**: Users use sliders to preview hypothetical habit changes (e.g., cutting flights by 50% or switching utilities) and see their simulated total carbon decline.
4.  **Chat (EcoSync AI Assistant)**: A built-in chat UI loads the active profile context, answering user questions about travel adjustments, custom action plans, and how to improve their footprint.
5.  **Commit (Roadmap Catalog)**: Users browse 23 curated actions (filtered by category, difficulty, cost, and impact), adding targets to their active roadmap and ticking them off to log permanent carbon offsets.

### 4. Assumptions Made
Calculations are based on conversion factors from the US EPA, UK DEFRA, and IPCC:
*   **Car Emissions**: Petrol (0.17 kg CO2e/km), Diesel (0.16 kg/km), Hybrid (0.10 kg/km), Electric (0.05 kg/km).
*   **Aviation**: Short-haul flights (<3 hours) emit 150 kg/hour; long-haul flights (>3 hours) emit 110 kg/hour.
*   **Public Transit**: Emits 1.2 kg CO2e per hour of travel.
*   **Electricity**: Average grid intensity is 0.38 kg/kWh. Green tariffs reduce electric emissions to 0.
*   **Home Heating**: Natural Gas (0.18 kg/kWh), LPG (0.24 kg/kWh), Oil (0.27 kg/kWh), Wood (0.03 kg/kWh).
*   **Diet**: Heavy meat (2,500 kg CO2e/yr), Average meat (1,700 kg/yr), Low meat (1,200 kg/yr), Vegetarian (900 kg/yr), Vegan (500 kg/yr). Local food sourcing reduces diet emissions by up to 10%.
*   **Waste**: Trash volume: High (800 kg/yr), Average (500 kg/yr), Low (250 kg/yr). Recycling reduces trash footprint by up to 40%.
*   **Tree Equivalency**: 1 mature urban tree absorbs approximately 22 kg of CO2e per year.

---

## ✨ Features

*   **📊 Stepper Carbon Calculator**: Contextual tips and error-validated form stepping.
*   **🤖 Smart AI Assistant**: Reads calculator context and answers custom environmental queries.
*   **📈 Dynamic Reduction Simulator**: Interactive slider controls to forecast potential offsets.
*   **🎯 Custom Green Roadmap**: Commits, completes, and logs carbon offsets.
*   **🧠 Eco-trivia Quiz**: 5-question trivia game with scoring and feedback.
*   **♿ Accessibility Settings**: Theme selection, text resizing (up to 130%), high contrast layout, and reduced motion.

---

## 🛠️ Tech Stack & Architecture

*   **Core**: React 19 + TypeScript + Vite.
*   **Styling**: Vanilla CSS (Custom properties & responsive editorial layouts).
*   **Icons**: Lucide React.
*   **Testing**: Vitest + JSDOM.

---

## 🚀 Getting Started Locally

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```
3.  **Run Unit Tests**:
    ```bash
    npm run test
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```
