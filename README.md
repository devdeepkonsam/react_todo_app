# React Todo App

A straightforward todo list application built with React, Node.js, Express, and MongoDB. It has user authentication (JWT) and a clean, responsive layout.

The project is split into two layout versions:
1. The new card-based dashboard (`src/components` and `App.css`)
2. The old simple interface (archived in `Frontend/backups/`)

---

Setup:
1. Backend Setup: go to 'Backend' directory and intall package 
   by running 'npm install' 
   create an .env file inside the 'Backend' with 
   PORT=3000
   MONGODB=your_mongodb_connection_string
   JWT_KEY=your_secret_key
   then run 'node index.js'

2. Frontend Setup: go to 'Frontend' directory and install package 
   by running 'npm install'
   create an .env file inside the 'Frontend' with 
   VITE_BACKEND_API=http://localhost:3000/api (if u r running backend locally, or else use ur 'backend_url/api')
   then run 'npm run dev' 

3. Browser : Open `localhost:5173` on ur browser
