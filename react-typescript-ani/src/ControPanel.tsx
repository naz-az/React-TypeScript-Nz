// import React, { useState, useEffect, useRef } from "react";
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import fm27bPID from "../../../../assets/images/schematics/fm27b_schematic.png";
// import "../../../../css/style.css";
// import MeasureTape from "./MeasureTape";
// import Row from "../../../../components/Row";
// import FlexRow from "../../../../components/FlexRow";
// import WaterTank from "./WaterTank";
// import ControlValve from "./ControlValve";
// import DischargeValve from "./DischargeValve";

// import VenturiView from "./VenturiView";

// import Sharpcrestedweir from "./Sharpcrestedweir";

// import VenturiFlowAnimation from "./VenturiFlowAnimation";

// import VenturiFlowAnimation2 from "./VenturiFlowAnimation2";

// import VenturiFlowAnimation3 from "./VenturiFlowAnimation3";

// import VenturiFlowAnimation4 from "./VenturiFlowAnimation4";

// interface Props {
//   HTCDisplayValue: string;
//   setShowModelling: React.Dispatch<React.SetStateAction<boolean>>;
//   tubeHeater: boolean;
//   setTubeHeater: React.Dispatch<React.SetStateAction<boolean>>;
//   onAirBlower: boolean;
//   setOnAirBlower: React.Dispatch<React.SetStateAction<boolean>>;
//   onHeater: boolean;
//   setOnHeater: React.Dispatch<React.SetStateAction<boolean>>;
//   finnedtubeHeater: boolean;
//   setfinnedTubeHeater: React.Dispatch<React.SetStateAction<boolean>>;
//   avDisplayValue: string;
//   atDisplayValue: string;
//   surfaceTempValue: string;
//   introWater: boolean;
//   setintroWater: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const ItemTypes = {
//   VENTURI_FLUME: 'venturi_flume',
// };

// const VenturiFlume: React.FC<{ onDrop: (didDropInZone: boolean) => void; isDropped: boolean }> = ({ onDrop, isDropped }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.VENTURI_FLUME,
//     end: (item, monitor) => {
//       if (!monitor.didDrop()) {
//         onDrop(false);
//       }
//     },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         fontSize: 14,
//         fontWeight: 'bold',
//         cursor: 'move',
//         backgroundColor: 'lightblue',
//         padding: '14px',
//         width: '150px',
//         height: '50px',
//         textAlign: 'center',
//         display: isDropped ? 'none' : 'block',
//       }}
//     >
//       Venturi Flume
//     </div>
//   );
// };

// const DropZone: React.FC<{ onDrop: () => void; isDropped: boolean }> = ({ onDrop, isDropped }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: ItemTypes.VENTURI_FLUME,
//     drop: () => {
//       onDrop(true);
//       return { name: 'DropZone' };
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       style={{
//         height: '200px',
//         width: '400px',
//         margin: '16px',
//         backgroundColor: isDropped || isOver ? 'lightgreen' : 'lightgrey',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       {isDropped ? (
//         <div style={{
//           fontSize: 14,
//           fontWeight: 'bold',
//           backgroundColor: 'lightblue',
//           padding: '14px',
//           width: '150px',
//           height: '50px',
//           textAlign: 'center',
//         }}>
//           Venturi Flume
//         </div>
//       ) : (
//         isOver ? 'Release to place' : 'Drag Venturi Flume here'
//       )}
//     </div>
//   );
// };

// const FM27BControlPanel: React.FC<Props> = ({
//   tubeHeater,
//   setTubeHeater,
//   onAirBlower,
//   setOnAirBlower,
//   onHeater,
//   setOnHeater,
//   avDisplayValue,
//   surfaceTempValue,
//   introWater,
//   setintroWater,
// }) => {
//   const [powerStatus, setPowerStatus] = useState(false);
//   const [cpStatus, setcpStatus] = useState(false);
//   const [flumeLevel, setFlumeLevel] = useState<number>(0);
//   const [venturiDropped, setVenturiDropped] = useState(false);
//   const [gaugePosition, setGaugePosition] = useState<number>(0);
//   const [showStartUp, setshowStartUp] = useState(false);
//   const [showVenturiFlume, setVenturiFlume] = useState(false);

//   const [showSharpCrestedWeir, setSharpCrestedWeir] = useState(false);

//   const [ventilationStatus, setventilationStatus] = useState(false);


//   const [showCrumpWeir, setCrumpWeir] = useState(false);
//   const [showBroadCrestedWeir, setBroadCrestedWeir] = useState(false);
//   const [showRadialGate, setRadialGate] = useState(false);
//   const [showSluiceGate, setSluiceGate] = useState(false);
//   const [showSiphonSpillway, setSiphonSpillway] = useState(false);
//   const [showRoughenedBed, setRoughenedBed] = useState(false);
//   const [showCulvertFitting, setCulvertFitting] = useState(false);
//   const [showFlowSplitter, setFlowSplitter] = useState(false);
//   const [showWaterDepth, setWaterDepth] = useState(false);
//   const [showDamSpillway, setDamSpillway] = useState(false);
//   const [showTrapezoidalWeir, setTrapezoidalWeir] = useState(false);

//   // Water introduction and draining
//   const [waterLevel, setWaterLevel] = useState<number>(0);
//   const [introductionTimer, setIntroductionTimer] = useState<NodeJS.Timeout | null>(null);
//   const [drainTimer, setDrainTimer] = useState<NodeJS.Timeout | null>(null);

//   // Tank filling and draining
//   const [tankWaterLevel, setTankWaterLevel] = useState<number>(0);
//   const [fillUpTank, setFillUpTank] = useState(false);
//   const [drainTank, setDrainTank] = useState(false);
//   const [fillTimer, setFillTimer] = useState<NodeJS.Timeout | null>(null);
//   const [tankDrainTimer, setTankDrainTimer] = useState<NodeJS.Timeout | null>(null);

//   const handleFlumeLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFlumeLevel(Number(event.target.value));
//   };

//   const handleGaugePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setGaugePosition(Number(event.target.value));
//   };

//   const handleVenturiPosition = (didDropInZone: boolean) => {
//     setVenturiDropped(didDropInZone);
//   };

//   const handleIntroduceWaterClick = () => {
//     if (drainTimer) {
//       clearInterval(drainTimer);
//       setDrainTimer(null);
//     }
//     if (introductionTimer) {
//       clearInterval(introductionTimer);
//       setIntroductionTimer(null);
//       setintroWater(false);
//     } else {
//       const timer = setInterval(() => {
//         setWaterLevel(prevLevel => {
//           const newLevel = Math.min(prevLevel + 1, 100);
//           if (newLevel === 100) {
//             clearInterval(timer);
//             setIntroductionTimer(null);
//             setintroWater(false);
//           }
//           return newLevel;
//         });
//       }, 100);
//       setIntroductionTimer(timer);
//       setintroWater(true);
//     }
//   };

//   const handleDrainWaterClick = () => {
//     if (introductionTimer) {
//       clearInterval(introductionTimer);
//       setIntroductionTimer(null);
//       setintroWater(false);
//     }
//     if (drainTimer) {
//       clearInterval(drainTimer);
//       setDrainTimer(null);
//     } else {
//       const timer = setInterval(() => {
//         setWaterLevel(prevLevel => {
//           const newLevel = Math.max(prevLevel - 1, 0);
//           if (newLevel === 0) {
//             clearInterval(timer);
//             setDrainTimer(null);
//           }
//           return newLevel;
//         });
//       }, 100);
//       setDrainTimer(timer);
//     }
//   };

//   const handleFillUpTankClick = () => {
//     if (tankDrainTimer) {
//       clearInterval(tankDrainTimer);
//       setTankDrainTimer(null);
//       setDrainTank(false);
//     }
//     if (fillTimer) {
//       clearInterval(fillTimer);
//       setFillTimer(null);
//       setFillUpTank(false);
//     } else {
//       const timer = setInterval(() => {
//         setTankWaterLevel(prevLevel => {
//           const newLevel = Math.min(prevLevel + 1, 100);
//           if (newLevel === 100) {
//             clearInterval(timer);
//             setFillTimer(null);
//             setFillUpTank(false);
//           }
//           return newLevel;
//         });
//       }, 100);
//       setFillTimer(timer);
//       setFillUpTank(true);
//     }
//   };

//   const handleDrainTankClick = () => {
//     if (fillTimer) {
//       clearInterval(fillTimer);
//       setFillTimer(null);
//       setFillUpTank(false);
//     }
//     if (tankDrainTimer) {
//       clearInterval(tankDrainTimer);
//       setTankDrainTimer(null);
//       setDrainTank(false);
//     } else {
//       const timer = setInterval(() => {
//         setTankWaterLevel(prevLevel => {
//           const newLevel = Math.max(prevLevel - 1, 0);
//           if (newLevel === 0) {
//             clearInterval(timer);
//             setTankDrainTimer(null);
//             setDrainTank(false);
//           }
//           return newLevel;
//         });
//       }, 100);
//       setTankDrainTimer(timer);
//       setDrainTank(true);
//     }
//   };

//   const toggleStartUp = () => {
//     setshowStartUp(!showStartUp);
//   };

//   const toggleVenturiFlume = () => {
//     setVenturiFlume(!showVenturiFlume);
//   };

//   const toggleSharpCrestedWeir = () => {
//     setSharpCrestedWeir(!showSharpCrestedWeir);
//   };

//   const toggleCrumpWeir = () => {
//     setCrumpWeir(!showCrumpWeir);
//   };

//   const toggleBroadCrestedWeir = () => {
//     setBroadCrestedWeir(!showBroadCrestedWeir);
//   };
  
//   const toggleRadialGate = () => {
//     setRadialGate(!showRadialGate);
//   };
  
//   const toggleSluiceGate = () => {
//     setSluiceGate(!showSluiceGate);
//   };
  
//   const toggleSiphonSpillway = () => {
//     setSiphonSpillway(!showSiphonSpillway);
//   };
  
//   const toggleRoughenedBed = () => {
//     setRoughenedBed(!showRoughenedBed);
//   };
  
//   const toggleCulvertFitting = () => {
//     setCulvertFitting(!showCulvertFitting);
//   };
  
//   const toggleFlowSplitter = () => {
//     setFlowSplitter(!showFlowSplitter);
//   };
  
//   const toggleWaterDepth = () => {
//     setWaterDepth(!showWaterDepth);
//   };
  
//   const toggleDamSpillway = () => {
//     setDamSpillway(!showDamSpillway);
//   };
  
//   const toggleTrapezoidalWeir = () => {
//     setTrapezoidalWeir(!showTrapezoidalWeir);
//   };
  

//   useEffect(() => {
//     return () => {
//       if (introductionTimer) clearInterval(introductionTimer);
//       if (drainTimer) clearInterval(drainTimer);
//       if (fillTimer) clearInterval(fillTimer);
//       if (tankDrainTimer) clearInterval(tankDrainTimer);
//     };
//   }, []);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <>
//         <div className="img-container">
//           <img id="he350-img" src={fm27bPID} width="548" height="455" />

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               position: "absolute",
//               top: "140px",
//               left: "60px",
//             }}
//           >
//             <p
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "12px",
//                 marginBottom: "0px",
//               }}
//             >
//               Flowrate: {avDisplayValue} m<sup>3</sup>/s
//             </p>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               position: "absolute",
//               top: "130px",
//               right: "25px",
//             }}
//           >
//             <p
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "12px",
//                 marginBottom: "0px",
//               }}
//             >
//               Flowrate: {surfaceTempValue} LPM
//             </p>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               position: "absolute",
//               top: "40px",
//               right: "20px",
//             }}
//           >
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 backgroundColor: powerStatus ? "green" : "grey",
//                 borderRadius: "50%",
//                 boxShadow: powerStatus
//                   ? 0px 0px 10px 5px ${powerStatus ? "rgba(144, 238, 144, 1)" : "transparent"
//                   }
//                   : "none",
//               }}
//             />
//             &ensp;
//             <p
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "12px",
//                 marginBottom: "0px",
//               }}
//             >
//               Main Switch
//             </p>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               position: "absolute",
//               bottom: "90px",
//               right: "190px",
//             }}
//           >
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 backgroundColor: onAirBlower ? "green" : "grey",
//                 borderRadius: "50%",
//                 boxShadow: onAirBlower
//                   ? 0px 0px 10px 5px ${onAirBlower ? "rgba(144, 238, 144, 1)" : "transparent"
//                   }
//                   : "none",
//               }}
//             />
//             &ensp;
//             <p
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "12px",
//                 marginBottom: "0px",
//               }}
//             >
//               Pump
//             </p>
//             &ensp;
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 marginLeft: "100px",
//                 backgroundColor: onHeater ? "green" : "grey",
//                 borderRadius: "50%",
//                 boxShadow: onHeater
//                   ? 0px 0px 10px 5px ${onHeater ? "rgba(144, 238, 144, 1)" : "transparent"
//                   }
//                   : "none",
//               }}
//             />
//             &ensp;
//             <p
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "12px",
//                 marginBottom: "0px",
//               }}
//             >
//               Discharge Valve
//             </p>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               position: "absolute",
//               bottom: "150px",
//               right: "10px",
//             }}
//           >
//             <div
//               style={{
//                 width: "12px",
//                 height: "12px",
//                 backgroundColor: cpStatus ? "green" : "grey",
//                 borderRadius: "50%",
//                 boxShadow: cpStatus
//                   ? 0px 0px 10px 5px ${cpStatus ? "rgba(144, 238, 144, 1)" : "transparent"
//                   }
//                   : "none",
//               }}
//             />
//             &ensp;
//             <p
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 height: "12px",
//                 marginBottom: "0px",
//               }}
//             >
//               Control Valve
//             </p>
//           </div>
//         </div>

//         <div id="he350-control-panel" className="card-fluid">
//           <h3>CONTROL PANEL</h3>

//           <button onClick={toggleStartUp} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showStartUp ? "#2759b5" : "#455A64", }}>
//             Start Up
//           </button>

//           <button onClick={toggleVenturiFlume} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showVenturiFlume ? "#9227b5" : "#455A64" }}>
//   Venturi Flume
// </button>

// <button onClick={toggleSharpCrestedWeir} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showSharpCrestedWeir ? "#228B22" : "#455A64" }}>
//   Sharp Crested Weir
// </button>

// <button onClick={toggleCrumpWeir} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showCrumpWeir ? "#FFD700" : "#455A64" }}>
//   Crump Weir
// </button>

// <button onClick={toggleBroadCrestedWeir} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showBroadCrestedWeir ? "#FF6347" : "#455A64" }}>
//   Broad Crested Weir
// </button>

// <button onClick={toggleRadialGate} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showRadialGate ? "#1E90FF" : "#455A64" }}>
//   Radial Gate
// </button>

// <button onClick={toggleSluiceGate} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showSluiceGate ? "#FF4500" : "#455A64" }}>
//   Sluice Gate
// </button>

// <button onClick={toggleSiphonSpillway} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showSiphonSpillway ? "#8A2BE2" : "#455A64" }}>
//   Siphon Spillway
// </button>

// <button onClick={toggleRoughenedBed} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showRoughenedBed ? "#20B2AA" : "#455A64" }}>
//   Roughened Bed
// </button>

// <button onClick={toggleCulvertFitting} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showCulvertFitting ? "#A52A2A" : "#455A64" }}>
//   Culvert Fitting
// </button>

// <button onClick={toggleFlowSplitter} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showFlowSplitter ? "#DC143C" : "#455A64" }}>
//   Flow Splitter
// </button>

// <button onClick={toggleWaterDepth} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showWaterDepth ? "#00BFFF" : "#455A64" }}>
//   Water Depth
// </button>

// <button onClick={toggleDamSpillway} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showDamSpillway ? "#32CD32" : "#455A64" }}>
//   Dam Spillway
// </button>

// <button onClick={toggleTrapezoidalWeir} className="toggle-button" style={{ marginBottom: '20px', backgroundColor: showTrapezoidalWeir ? "#FF69B4" : "#455A64" }}>
//   Trapezoidal Weir
// </button>



//           <br />

//           {showStartUp && (
//             <>
//               <button
//                 id="he350-power-btn"
//                 className="toggle-button"
//                 style={{
//                   backgroundColor: powerStatus ? "teal" : "#455A64",
//                   zIndex: "10002px",
//                 }}
//                 onClick={() => setPowerStatus(!powerStatus)}
//               >
//                 Main Switch
//               </button>


//               <button
//                 id="he350-fillup-tank-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: fillUpTank ? "teal" : "#455A64" }}
//                 onClick={handleFillUpTankClick}
//                 disabled={tankWaterLevel === 100}
//               >
//                 Fill Up Tank
//               </button>
//               <button
//                 id="he350-drain-tank-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: drainTank ? "teal" : "#455A64" }}
//                 onClick={handleDrainTankClick}
//                 disabled={tankWaterLevel === 0}
//               >
//                 Drain Tank
//               </button>

//               <p>Drain Tank Status: {drainTank ? "ON" : "OFF"}</p>
//               <p>Tank Water Level: {tankWaterLevel.toFixed(1)}%</p>

//               <div style={{ display: 'flex', marginTop: '20px' }}>
//                 <WaterTank waterLevel={tankWaterLevel} />
//               </div>

//               <button
//                 id="he350-cp-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: cpStatus ? "teal" : "#455A64" }}
//                 onClick={() => setcpStatus(!cpStatus)}
//               >
//                 Control Valve
//               </button>

//               <button
//                 id="he350-heater-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: onHeater ? "teal" : "#455A64" }}
//                 onClick={() => setOnHeater(!onHeater)}
//               >
//                 Discharge Valve
//               </button>
//               <FlexRow>
//                 <ControlValve />
//                 <DischargeValve />
//               </FlexRow>

//               <button
//                 id="he350-blower-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: onAirBlower ? "teal" : "#455A64" }}
//                 onClick={() => setOnAirBlower(!onAirBlower)}
//               >
//                 Pump
//               </button>


//             </>
//           )}

//           {showVenturiFlume && (
//             <>

//               <div style={{ marginTop: '20px' }}>
//                 <label>
//                   Flume Level:
//                   <input type="range" min="0" max="100" value={flumeLevel} onChange={handleFlumeLevelChange} />
//                 </label>
//                 <p>Current Flume Level: {flumeLevel}%</p>
//               </div>

//               <div style={{ marginTop: '20px' }}>
//                 <VenturiFlume onDrop={handleVenturiPosition} isDropped={venturiDropped} />
//                 <DropZone onDrop={() => handleVenturiPosition(true)} isDropped={venturiDropped} />
//                 {venturiDropped && (
//                   <p>Venturi flume positioned.</p>
//                 )}
//               </div>



//               <button
//                 id="he350-intro-water-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: introWater ? "teal" : "#455A64" }}
//                 onClick={handleIntroduceWaterClick}
//                 disabled={waterLevel === 100}
//               >
//                 Introduce Water
//               </button>
//               <button
//                 id="he350-drain-water-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: drainTimer ? "teal" : "#455A64" }}
//                 onClick={handleDrainWaterClick}
//                 disabled={waterLevel === 0}
//               >
//                 Drain Water
//               </button>

//               <p>Drain Water Status: {drainTimer ? "ON" : "OFF"}</p>
//               <p>Water Level: {waterLevel.toFixed(1)}%</p>

//               <div style={{ display: 'flex', marginTop: '20px' }}>
//                 <WaterTank waterLevel={waterLevel} />
//               </div>





//               <div style={{ marginTop: '20px' }}>
//                 <label>
//                   Level Gauge Position:
//                   <input type="range" min="0" max="100" value={gaugePosition} onChange={handleGaugePositionChange} />
//                 </label>
//                 <p>Current Level Gauge Position: {gaugePosition}%</p>
//               </div>

//               <br />
//               <div style={{ padding: '20px' }}>
//                 <h5>Venturi Flume</h5>
//                 <MeasureTape />
//               </div>
//               <br />


//             </>
//           )}

// {showSharpCrestedWeir && (
//             <>

// <div style={{ marginTop: '20px' }}>
//                 <label>
//                   Flume Level:
//                   <input type="range" min="0" max="100" value={flumeLevel} onChange={handleFlumeLevelChange} />
//                 </label>
//                 <p>Current Flume Level: {flumeLevel}%</p>
//               </div>

//               <div style={{ marginTop: '20px' }}>
//                 <VenturiFlume onDrop={handleVenturiPosition} isDropped={venturiDropped} />
//                 <DropZone onDrop={() => handleVenturiPosition(true)} isDropped={venturiDropped} />
//                 {venturiDropped && (
//                   <p>Sharp Crested Weir positioned.</p>
//                 )}
//               </div>



//               <button
//                 id="he350-intro-water-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: introWater ? "teal" : "#455A64" }}
//                 onClick={handleIntroduceWaterClick}
//                 disabled={waterLevel === 100}
//               >
//                 Introduce Water
//               </button>
//               <button
//                 id="he350-drain-water-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: drainTimer ? "teal" : "#455A64" }}
//                 onClick={handleDrainWaterClick}
//                 disabled={waterLevel === 0}
//               >
//                 Drain Water
//               </button>

//               <p>Drain Water Status: {drainTimer ? "ON" : "OFF"}</p>
//               <p>Water Level: {waterLevel.toFixed(1)}%</p>

//               <div style={{ display: 'flex', marginTop: '20px' }}>
//                 <WaterTank waterLevel={waterLevel} />
//               </div>

//               <div style={{ marginTop: '20px' }}>
//                 <label>
//                   Level Gauge Position:
//                   <input type="range" min="0" max="100" value={gaugePosition} onChange={handleGaugePositionChange} />
//                 </label>
//                 <p>Current Level Gauge Position: {gaugePosition}%</p>
//               </div>

//               <button
//                 id="he350-cp-btn"
//                 className="toggle-button"
//                 style={{ backgroundColor: ventilationStatus ? "teal" : "#455A64" }}
//                 onClick={() => setventilationStatus(!ventilationStatus)}
//               >
//                 Ventilation
//               </button>


// </>
//           )}


// {showCrumpWeir && (
//   <>

// {/* <VenturiView/> */}

// <Sharpcrestedweir/>
//   </>
// )}

// {showBroadCrestedWeir && (
//   <>


// <VenturiFlowAnimation/>
// <VenturiFlowAnimation2/>
// <VenturiFlowAnimation3/>
// <VenturiFlowAnimation4/>

// </>


// )}

// {showRadialGate && (
//   <>
//     {/* Content for Radial Gate */}
//   </>
// )}

// {showSluiceGate && (
//   <>
//     {/* Content for Sluice Gate */}
//   </>
// )}

// {showSiphonSpillway && (
//   <>
//     {/* Content for Siphon Spillway */}
//   </>
// )}

// {showRoughenedBed && (
//   <>
//     {/* Content for Roughened Bed */}
//   </>
// )}

// {showCulvertFitting && (
//   <>
//     {/* Content for Culvert Fitting */}
//   </>
// )}

// {showFlowSplitter && (
//   <>
//     {/* Content for Flow Splitter */}
//   </>
// )}

// {showWaterDepth && (
//   <>
//     {/* Content for Water Depth */}
//   </>
// )}

// {showDamSpillway && (
//   <>
//     {/* Content for Dam Spillway */}
//   </>
// )}

// {showTrapezoidalWeir && (
//   <>
//     {/* Content for Trapezoidal Weir */}
//   </>
// )}



//         </div>
//       </>
//     </DndProvider>
//   );
// };

// export default FM27BControlPanel;