import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "white" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
        <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Accueil</Link></li>
        <li><Link to="/about" style={{ color: "white", textDecoration: "none" }}>À propos</Link></li>
        <li><Link to="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
