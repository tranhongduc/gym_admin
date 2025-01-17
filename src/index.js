import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./scenes/auth";
import GlobalProvider, { useGlobalContext } from "./context/GlobalProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

const AppRoutes = () => {
  const { isLoggedIn } = useGlobalContext();
  console.log(isLoggedIn);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/app/*"
        element={isLoggedIn ? <App /> : <Navigate to="/" />}
      />
    </Routes>
  );
};


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
          <AppRoutes />
      </GlobalProvider>
      {/* <App /> */}
    </BrowserRouter>
  </React.StrictMode>
);
