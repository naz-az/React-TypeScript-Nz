import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">DT</Link>
      </div>
      <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <li className="dropdown">
          <button onClick={handleDropdownClick} className="dropdown-toggle">
            Configuration
          </button>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
          <li><Link to="/digitalflowmeter">DigitalFlowMeter</Link></li>

          <li><Link to="/venturi-flow">1.Venturi Flow (done-)</Link></li>
<li><Link to="/sharpcrestedweir">2.Sharp Crested Weir(done)</Link></li>
<li><Link to="/crumpweir">3. Modular flow Crump Weir (done-)</Link></li>
<li><Link to="/nonmodularcrumpweir">4.Non Modular flow Crump Weir (done-)</Link></li>
<li><Link to="/broadcrestedweir">5.Broad Crested Weir (done--)</Link></li>
<li><Link to="/radialgate">6.Radial Gate (done)</Link></li>
<li><Link to="/sluicegate">7.Sluice Gate (done)</Link></li>
<li><Link to="/siphon-spillway">8.Siphon Spillway</Link></li>
<li><Link to="/roughened-bed">9.Roughened Bed (done)</Link></li>
<li><Link to="/square-edge">10.Square Edge (done)</Link></li>
<li><Link to="/round-edge">11.Round Edge (done)</Link></li>
<li><Link to="/rounded-splitter">12.Rounded Splitter (done)</Link></li>
<li><Link to="/pointed-splitter">13.Pointed Splitter (done)</Link></li>
<li><Link to="/flat-splitter">14.Flat Splitter (done)</Link></li>
<li><Link to="/change-water-depth">15.Change Water Depth (done)</Link></li>
<li><Link to="/sloping-apron">16.Sloping Apron (done)</Link></li>
<li><Link to="/ski-jump">17.Ski Jump (done)</Link></li>
<li><Link to="/reverse-curvature">18.Reverse Curvature(done)r</Link></li>
<li><Link to="/trapezoidal-weir">19.Trapezoidal Weir (done+)</Link></li>

            <li><Link to="/zigzag">Zig Zag Pipe</Link></li>
            <li><Link to="/digitalclock">Digital Clock </Link></li>

          </ul>

        </li>
        {/* Additional menu items can go here */}
      </ul>
      <div className="navbar-toggle" id="mobile-menu" onClick={handleToggleClick}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
