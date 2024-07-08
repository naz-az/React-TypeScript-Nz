import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VenturiFlowAnimation from './pages/VenturiFlowAnimation';
import SharpCrestedWeirAnimation3 from './pages/SharpCrestedWeirAnimation3';
import CrumpWeir from './pages/CrumpWeir';
import BroadCrestedWeir from './pages/BroadCrestedWeir';
import RadialGate from './pages/RadialGate';
import SluiceGate from './pages/SluiceGate';
import SquareEdge from './pages/SquareEdge';
import RoundEdge from './pages/RoundEdge';
import RoundedSplitter from './pages/RoundedSplitter';
import PointedSplitter from './pages/PointedSplitter';
import FlatSplitter from './pages/FlatSplitter';
import SkiJump from './pages/SkiJump3';
import SlopingApron from './pages/SlopingApron';
import ReverseCurvature from './pages/ReverseCurvature';
import SiphonSpillway from './pages/SiphonSpillway';
import RoughenedBed from './pages/RoughenedBed';
import TrapezoidalWeir from './pages/TrapezoidalWeir';
import ChangeWaterDepth from './pages/ChangeWaterDepth';
import './App.css';
import Navbar from './components/Navbar';
import ZigZagPipe from './pages/ZigZagPipe';
import DigitalFlowMeter from './pages/DigitalFlowMeter2';
import DragDropIcons from './pages/DragDropIcons';
import NonModularCrumpWeir from './pages/NonModularCrumpWeir';
import DigitalClock from './pages/DigitalClock';
const App: React.FC = () => {
  return (
    <Router>
      <div className="Navbar">
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/venturi-flow" element={<VenturiFlowAnimation />} />
            <Route path="/sharpcrestedweir" element={<SharpCrestedWeirAnimation3 />} />
            <Route path="/crumpweir" element={<CrumpWeir />} />
            <Route path="/broadcrestedweir" element={<BroadCrestedWeir />} />
            <Route path="/radialgate" element={<RadialGate />} />
            <Route path="/sluicegate" element={<SluiceGate />} />
            <Route path="/square-edge" element={<SquareEdge />} />
            <Route path="/round-edge" element={<RoundEdge />} />
            <Route path="/rounded-splitter" element={<RoundedSplitter />} />
            <Route path="/pointed-splitter" element={<PointedSplitter />} />
            <Route path="/flat-splitter" element={<FlatSplitter />} />
            <Route path="/ski-jump" element={<SkiJump />} />
            <Route path="/sloping-apron" element={<SlopingApron />} />
            <Route path="/reverse-curvature" element={<ReverseCurvature />} />
            <Route path="/siphon-spillway" element={<SiphonSpillway />} />
            <Route path="/roughened-bed" element={<RoughenedBed />} />
            <Route path="/trapezoidal-weir" element={<TrapezoidalWeir />} />
            <Route path="/change-water-depth" element={<ChangeWaterDepth />} />
            <Route path="/zigzag" element={<ZigZagPipe />} />
            <Route path="/digitalflowmeter" element={<DigitalFlowMeter />} />
            <Route path="/nonmodularcrumpweir" element={<NonModularCrumpWeir />} />

            <Route path="/dragdropicons" element={<DragDropIcons />} />
            
            <Route path="/digitalclock" element={<DigitalClock />} />

            

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
