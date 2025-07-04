📊 Live Polling System — Project

This is a real-time Live Polling System built as part of an  to demonstrate understanding of full-stack development using React, Express.js, and Socket.io. The system supports two user roles — Teacher and Student — interacting in real-time over live polls.
🎯  Objective

    Develop a live polling web application with real-time communication between a teacher and multiple students.

    Implement role-based interactions using WebSockets (Socket.io).

    Host the solution with:

        Frontend on Vercel

        Backend on Render

👥 Roles & Features
👨‍🏫 Teacher

    Create new polls/questions.

    View live poll results in real-time.

    Can initiate a new question only if:

        No active question exists, or

        All students have submitted answers.

    Can optionally configure the maximum time per poll (if implemented).

🧑‍🎓 Student

    On first visit, student enters a name, which is unique to that browser tab session.

        Name persists if the tab is refreshed.

        A new name is prompted if opened in a new tab.

    Can submit answers to the teacher’s question.

    Sees live poll results:

        Immediately after answering.

        Or after 60 seconds timeout if no answer is submitted.

🔧 Tech Stack

    Frontend: React.js, Tailwind CSS

    Backend: Node.js, Express.js, Socket.io

    Deployment: Frontend on Vercel, Backend on Render

🌐 Hosted Links

    Frontend: https://live-polling-system-syn9.vercel.app/

📦 Installation (For Local Setup)
Backend

cd server
npm install
node index.js

Frontend

cd client
npm install
npm start

✅ Core Functionalities

    Teacher can create polls.

    Students can submit answers.

    Real-time live results for both teachers and students.

    Timer functionality (60 seconds for students to answer).

    Tab-specific student sessions.
