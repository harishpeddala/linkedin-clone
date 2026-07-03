Installation and SetUp :

1. npm create vite@latest
   Tailwind Setup : `https://tailwindcss.com/docs/installation/using-vite`

`Step 1 : npm install tailwindcss @tailwindcss/vite
 Step 2 : vite.config.js --> import tailwindcss from '@tailwindcss/vite'  Then Plugins -->  plugins: [react(), tailwindcss()],
 Step 3 : Import Tailwind CSS --> main.css --> @import "tailwindcss";
 Step 4 : To Start build --> npm run dev
 Step 5 : Link styles.css to index.html --> <head> <link href="/src/styles.css" rel="stylesheet"></head>
`
Formatting : Shift + Alt + F

Routing : `npm install react-router-dom`

main.jsx
`import { BrowserRouter } from "react-router-dom";
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
`
App.jsx --> Refer to App.jsx for more..
`import { Route, Routes } from "react-router-dom";
  <Routes>
    <Route>
  </Routes>
Linking button with redirecting to the page --> Use Link tag..
`
For Google Authentication --> @react-oauth/google `npm i @react-oauth/google`

For Icons --> **Material UI**

To use icons --> npm install @mui/icons-material @mui/material @emotion/styled @emotion/react

//Integration

-- npm i axios
//What is cors error --> Frontend has to take permission from backend to access backend resources.

--npm i react-toastify
--npm i socket.io (Backend)
--npm i socket.io-client (Frontend)
