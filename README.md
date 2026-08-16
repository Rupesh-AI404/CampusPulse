📌 Campus Pulse

Campus Pulse is a web-based student opportunity management platform designed to connect university students with academic, professional, and extracurricular opportunities — all in one place.

    🎯 Discover → Apply → Participate → Achieve

🚀 Live Demo

(Add your deployed link here if applicable)
📖 About The Project

Students often miss out on great opportunities because information is scattered across social media, notice boards, WhatsApp groups, and multiple websites. Even when they find something interesting, tracking applications and deadlines becomes a headache.

Campus Pulse solves this by providing a centralized platform where:

    Students can discover, filter, and apply for opportunities that match their skills and interests.

    Organizers can publish opportunities and manage student applications seamlessly.

All data is persisted using localStorage, making it a fully frontend-based solution — perfect for university projects, demos, or prototypes.
✨ Key Features
👨‍🎓 For Students

    Create & update profile with skills and interests

    Explore opportunities with search and filters

    View personalized match percentage for each opportunity

    Bookmark opportunities for later

    Apply directly through the platform

    Track application statuses: Pending, Accepted, Rejected

    View personal dashboard showing your journey

🧑‍💼 For Organizers

    Create, publish, edit, and manage opportunities

    View all student applications

    Review applicant profiles and match scores

    Accept or reject applications

🔐 Authentication

    Role-based login (Student / Organizer)

    Demo accounts included for testing

🛠️ Built With

    React – Frontend library

    TypeScript – Type-safe JavaScript

    localStorage – Client-side persistence

    CSS / Tailwind / Bootstrap (mention what you used)

📦 Getting Started
Prerequisites

    Node.js (v14 or later)

    npm or yarn

Installation

    Clone the repository
    bash

    git clone https://github.com/YOUR_USERNAME/campus-pulse.git
    cd campus-pulse

    Install dependencies
    bash

    npm install
    # or
    yarn install

    Start the development server
    bash

    npm start
    # or
    yarn start

    Open http://localhost:3000 to view it in the browser.

🔑 Demo Accounts
Role	Email	Password
Student	student@demo.com	password
Organizer	organizer@demo.com	password
📁 Project Structure
text

campus-pulse/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript interfaces/types
│   ├── utils/           # Helper functions
│   ├── context/         # Context API (if used)
│   └── styles/          # CSS/styling files
├── public/
├── package.json
└── README.md

🧪 Future Enhancements

    □

    Backend integration with real database
    □

    Email notifications for application updates
    □

    Calendar view for deadlines
    □

    Resume/CV upload
    □

    Student-to-student collaboration features