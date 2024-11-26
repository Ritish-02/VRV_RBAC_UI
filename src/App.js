import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import { Container } from "@mui/material";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <Container sx={{ marginTop: "80px" }}>
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
            </Routes>
          </Container>
        </div>
      </div>
    </Router>
  );
}

export default App;
