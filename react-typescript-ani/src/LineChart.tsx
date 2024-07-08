// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import WebSocketServices from "../../../../services/WebSocketServices";
// import { Line } from "react-chartjs-2";
// import { CrosshairPlugin } from "../../../../components/Chart/CrossHairPlugin";
// import { generateChartOptions } from "../../../../components/Chart/ChartOptions";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { AppState } from "../../../../redux/store";
// import * as XLSX from "xlsx";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Dropdown } from "react-bootstrap";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
// import Row from "../../../../components/Row";
// import { DataPoint } from "../types";
// import FlexRow from "../../../../components/FlexRow";

// import { parseDataPoint } from "../utils";

// // Register the chart components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   CrosshairPlugin
// );

// interface Props {
//   dataPoints: DataPoint[];
//   setDataPoints: React.Dispatch<React.SetStateAction<DataPoint[]>>;
//   maxX: number;
//   setMaxX: React.Dispatch<React.SetStateAction<number>>;
//   setHTCDisplayValue: React.Dispatch<React.SetStateAction<string>>;
// }

// const RealTimeChart: React.FC<Props> = ({
//   dataPoints,
//   setDataPoints,
//   maxX,
//   setMaxX,
//   setHTCDisplayValue,
// }) => {
//   const userID = useSelector((state: AppState) => state.auth.userID);
//   const webSocketService = useRef<WebSocketServices | null>(null);
//   const throttledData = useRef(dataPoints);

//   const [windowStartIndex, setWindowStartIndex] = useState(0);
//   const windowSize = 100; // Default window size of 100 data points

//   const currentDataPoints = dataPoints.slice(
//     windowStartIndex,
//     windowStartIndex + windowSize
//   );

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(dataPoints);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DataPoints");
//     XLSX.writeFile(wb, "HE350-ChartData.xlsx");
//   };

//   const throttledSetDataPoints = useCallback(
//     throttle((newData: DataPoint) => {
//       setDataPoints((prevData) => [...prevData, newData]);
//       setMaxX((prevMaxX) =>
//         newData.time > prevMaxX ? prevMaxX + 10 : prevMaxX
//       );

//       setHTCDisplayValue(newData.power.toFixed(2).toString());
//     }, 200),
//     [setDataPoints, setMaxX]
//   ); //Add throttled to enhance performance, so can prevent the flickering of the real time chart.

//   useEffect(() => {
//     webSocketService.current = new WebSocketServices(
//       "ws://localhost:3003",
//       handleMessage
//     );

//     function handleMessage(message: any) {
//       const jsonData = JSON.parse(message);
//       if (jsonData.userID.toString() === userID) {
//         const newData = parseDataPoint(jsonData);
//         throttledSetDataPoints(newData);
//       }
//     }

//     return () => {
//       webSocketService.current?.disconnect();
//     };
//   }, [userID, throttledSetDataPoints]);

//   const handleSliderChange = (value: number | number[]) => {
//     const index = Array.isArray(value) ? value[0] : value;
//     setWindowStartIndex(index);
//   };

//   return (
//     <div
//       id="he350-line-chart"
//       className="canva-chart"
//       style={{ zIndex: "10002px" }}
//     >
//       <Row style={{ justifyContent: "flex-end" }}>
//         &ensp; &ensp;
//         <Dropdown>
//           <Dropdown.Toggle variant="success" id="dropdown-basic">
//             Export
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//             <Dropdown.Item>PNG</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Row>
//       <Line
//         style={{ zIndex: "10002px" }}
//         key={throttledData.current.length}
//         data={{
//           labels: throttledData.current.map(
//             (dp) => "Seconds: " + dp.time.toString()
//           ),
//           datasets: [
//             {
//               label: "Power",
//               data: dataPoints.map((dp) => ({ x: dp.time, y: dp.power })),
//               borderColor: "rgba(255, 99, 132, 1)",
//               tension: 0.1,
//               pointStyle: "line",
//             },
//           ],
//         }}
//         options={generateChartOptions({
//           chartTitle: "Power",
//           minX: currentDataPoints[0]?.time,
//           maxY: 100,
//           maxX: maxX,
//           xTitle: "Time(s)",
//           yTitle: "Value",
//         })}
//       />
//       <Slider
//         min={0}
//         max={Math.max(0, dataPoints.length - windowSize)}
//         value={windowStartIndex}
//         onChange={handleSliderChange}
//         style={{ width: "90%", margin: "20px auto" }}
//       />
//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <Dropdown>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               Export
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//               <Dropdown.Item>PNG</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>

//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "ReynoldsNumber",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.ReynoldsNumber,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Reynold's Number",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Nusselt Number",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.NusseltNumber,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Nusselt Number",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>

//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <Dropdown>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               Export
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//               <Dropdown.Item>PNG</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Air Velocity",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.airVelocity,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Air Velocity",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <Dropdown>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               Export
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//               <Dropdown.Item>PNG</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Surface Temperature",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.surfaceTemp,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Surface Temperature",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>

//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <Dropdown>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               Export
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//               <Dropdown.Item>PNG</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Heat Transfer Coefficient",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.HeatTransferCoefficient,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Heat Transfer Coefficient",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <Dropdown>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               Export
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//               <Dropdown.Item>PNG</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Air Temperature",
//                   data: dataPoints.map((dp) => ({ x: dp.time, y: dp.airTemp })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Air Temperature",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>
//     </div>
//   );
// };

// function throttle<T extends any[]>(
//   fn: (...args: T) => void,
//   wait: number
// ): (...args: T) => void {
//   let lastTime = 0;
//   return function (...args: T) {
//     const now = new Date().getTime();
//     if (now - lastTime >= wait) {
//       fn(...args);
//       lastTime = now;
//     }
//   };
// }

// export default RealTimeChart;
// ChatGPT
// You can create a reusable ExportDropdown component and then use it wherever needed in your charts. Here's how you can do it:

// Create the ExportDropdown component:
// jsx
// Copy code
// import React from "react";
// import { Dropdown } from "react-bootstrap";
// import * as XLSX from "xlsx";

// const ExportDropdown = ({ dataPoints, filename }) => {
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(dataPoints);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DataPoints");
//     XLSX.writeFile(wb, `${filename}.xlsx`);
//   };

//   return (
//     <Dropdown>
//       <Dropdown.Toggle variant="success" id="dropdown-basic">
//         Export
//       </Dropdown.Toggle>
//       <Dropdown.Menu>
//         <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//         <Dropdown.Item>PNG</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };

// export default ExportDropdown;
// Use the ExportDropdown component in your RealTimeChart component:
// Replace the repeated dropdown code with the ExportDropdown component. Here's how you can integrate it:

// jsx
// Copy code
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import WebSocketServices from "../../../../services/WebSocketServices";
// import { Line } from "react-chartjs-2";
// import { CrosshairPlugin } from "../../../../components/Chart/CrossHairPlugin";
// import { generateChartOptions } from "../../../../components/Chart/ChartOptions";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { AppState } from "../../../../redux/store";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
// import Row from "../../../../components/Row";
// import FlexRow from "../../../../components/FlexRow";
// import { DataPoint } from "../types";
// import { parseDataPoint } from "../utils";
// import ExportDropdown from "./ExportDropdown"; // Adjust the path as necessary

// // Register the chart components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   CrosshairPlugin
// );

// interface Props {
//   dataPoints: DataPoint[];
//   setDataPoints: React.Dispatch<React.SetStateAction<DataPoint[]>>;
//   maxX: number;
//   setMaxX: React.Dispatch<React.SetStateAction<number>>;
//   setHTCDisplayValue: React.Dispatch<React.SetStateAction<string>>;
// }

// const RealTimeChart: React.FC<Props> = ({
//   dataPoints,
//   setDataPoints,
//   maxX,
//   setMaxX,
//   setHTCDisplayValue,
// }) => {
//   const userID = useSelector((state: AppState) => state.auth.userID);
//   const webSocketService = useRef<WebSocketServices | null>(null);
//   const throttledData = useRef(dataPoints);

//   const [windowStartIndex, setWindowStartIndex] = useState(0);
//   const windowSize = 100; // Default window size of 100 data points

//   const currentDataPoints = dataPoints.slice(
//     windowStartIndex,
//     windowStartIndex + windowSize
//   );

//   const throttledSetDataPoints = useCallback(
//     throttle((newData: DataPoint) => {
//       setDataPoints((prevData) => [...prevData, newData]);
//       setMaxX((prevMaxX) =>
//         newData.time > prevMaxX ? prevMaxX + 10 : prevMaxX
//       );

//       setHTCDisplayValue(newData.power.toFixed(2).toString());
//     }, 200),
//     [setDataPoints, setMaxX]
//   ); // Add throttled to enhance performance, so can prevent the flickering of the real time chart.

//   useEffect(() => {
//     webSocketService.current = new WebSocketServices(
//       "ws://localhost:3003",
//       handleMessage
//     );

//     function handleMessage(message: any) {
//       const jsonData = JSON.parse(message);
//       if (jsonData.userID.toString() === userID) {
//         const newData = parseDataPoint(jsonData);
//         throttledSetDataPoints(newData);
//       }
//     }

//     return () => {
//       webSocketService.current?.disconnect();
//     };
//   }, [userID, throttledSetDataPoints]);

//   const handleSliderChange = (value: number | number[]) => {
//     const index = Array.isArray(value) ? value[0] : value;
//     setWindowStartIndex(index);
//   };

//   return (
//     <div
//       id="he350-line-chart"
//       className="canva-chart"
//       style={{ zIndex: "10002px" }}
//     >
//       <Row style={{ justifyContent: "flex-end" }}>
//         &ensp; &ensp;
//         <ExportDropdown dataPoints={dataPoints} filename="HE350-ChartData" />
//       </Row>
//       <Line
//         style={{ zIndex: "10002px" }}
//         key={throttledData.current.length}
//         data={{
//           labels: throttledData.current.map(
//             (dp) => "Seconds: " + dp.time.toString()
//           ),
//           datasets: [
//             {
//               label: "Power",
//               data: dataPoints.map((dp) => ({ x: dp.time, y: dp.power })),
//               borderColor: "rgba(255, 99, 132, 1)",
//               tension: 0.1,
//               pointStyle: "line",
//             },
//           ],
//         }}
//         options={generateChartOptions({
//           chartTitle: "Power",
//           minX: currentDataPoints[0]?.time,
//           maxY: 100,
//           maxX: maxX,
//           xTitle: "Time(s)",
//           yTitle: "Value",
//         })}
//       />
//       <Slider
//         min={0}
//         max={Math.max(0, dataPoints.length - windowSize)}
//         value={windowStartIndex}
//         onChange={handleSliderChange}
//         style={{ width: "90%", margin: "20px auto" }}
//       />
//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-ReynoldsNumber" />
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "ReynoldsNumber",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.ReynoldsNumber,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Reynold's Number",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Nusselt Number",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.NusseltNumber,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Nusselt Number",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>

//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-AirVelocity" />
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Air Velocity",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.airVelocity,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Air Velocity",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-SurfaceTemperature" />
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Surface Temperature",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.surfaceTemp,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Surface Temperature",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>

//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-HeatTransferCoefficient" />
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Heat Transfer Coefficient",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.HeatTransferCoefficient,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Heat Transfer Coefficient",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-AirTemperature" />
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Air Temperature",
//                   data: dataPoints.map((dp) => ({ x: dp.time, y: dp.airTemp })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Air Temperature",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>
//     </div>
//   );
// };

// function throttle<T extends any[]>(
//   fn: (...args: T) => void,
//   wait: number
// ): (...args: T) => void {
//   let lastTime = 0;
//   return function (...args: T) {
//     const now = new Date().getTime();
//     if (now - lastTime >= wait) {
//       fn(...args);
//       lastTime = now;
//     }
//   };
// }

// export default RealTimeChart;
// By doing this, you define the export functionality once and reuse it across your charts without having to rewrite the same dropdown code repeatedly. Adjust the import path of ExportDropdown based on your project structure.

// [{
// 	"resource": "/c:/Users/AcerNitro2User/Downloads/soltwin-react/src/components/ExportDropdown.tsx",
// 	"owner": "typescript",
// 	"code": "7031",
// 	"severity": 8,
// 	"message": "Binding element 'dataPoints' implicitly has an 'any' type.",
// 	"source": "ts",
// 	"startLineNumber": 5,
// 	"startColumn": 27,
// 	"endLineNumber": 5,
// 	"endColumn": 37
// }][{
// 	"resource": "/c:/Users/AcerNitro2User/Downloads/soltwin-react/src/components/ExportDropdown.tsx",
// 	"owner": "typescript",
// 	"code": "7031",
// 	"severity": 8,
// 	"message": "Binding element 'filename' implicitly has an 'any' type.",
// 	"source": "ts",
// 	"startLineNumber": 5,
// 	"startColumn": 39,
// 	"endLineNumber": 5,
// 	"endColumn": 47
// }]--import React from "react";
// import { Dropdown } from "react-bootstrap";
// import * as XLSX from "xlsx";

// const ExportDropdown = ({ dataPoints, filename }) => {
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(dataPoints);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DataPoints");
//     XLSX.writeFile(wb, ${filename}.xlsx);
//   };

//   return (
//     <Dropdown>
//       <Dropdown.Toggle variant="success" id="dropdown-basic">
//         Export
//       </Dropdown.Toggle>
//       <Dropdown.Menu>
//         <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//         <Dropdown.Item>PNG</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };

// export default ExportDropdown;
// ChatGPT
// To address the TypeScript errors, you need to explicitly define the types for the dataPoints and filename props. Here's how you can update your ExportDropdown component to include proper type annotations:

// Define the type for DataPoint:

// If you have already defined the DataPoint type in your project, you can import and use it directly. Otherwise, define it in the same file or import it from where it is defined.

// typescript
// Copy code
// import React from "react";
// import { Dropdown } from "react-bootstrap";
// import * as XLSX from "xlsx";
// import { DataPoint } from "../types"; // Adjust the import path as necessary

// interface ExportDropdownProps {
//   dataPoints: DataPoint[];
//   filename: string;
// }

// const ExportDropdown: React.FC<ExportDropdownProps> = ({ dataPoints, filename }) => {
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(dataPoints);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "DataPoints");
//     XLSX.writeFile(wb, `${filename}.xlsx`);
//   };

//   return (
//     <Dropdown>
//       <Dropdown.Toggle variant="success" id="dropdown-basic">
//         Export
//       </Dropdown.Toggle>
//       <Dropdown.Menu>
//         <Dropdown.Item onClick={exportToExcel}>CSV</Dropdown.Item>
//         <Dropdown.Item>PNG</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };

// export default ExportDropdown;
// Update the RealTimeChart component to use the typed ExportDropdown:
// Make sure to pass the correct props to the ExportDropdown component.

// typescript
// Copy code
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import { useSelector } from "react-redux";
// import WebSocketServices from "../../../../services/WebSocketServices";
// import { Line } from "react-chartjs-2";
// import { CrosshairPlugin } from "../../../../components/Chart/CrossHairPlugin";
// import { generateChartOptions } from "../../../../components/Chart/ChartOptions";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { AppState } from "../../../../redux/store";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
// import Row from "../../../../components/Row";
// import FlexRow from "../../../../components/FlexRow";
// import { DataPoint } from "../types";
// import { parseDataPoint } from "../utils";
// import ExportDropdown from "../../../../components/ExportDropdown"; // Adjust the path as necessary

// // Register the chart components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   CrosshairPlugin
// );

// interface Props {
//   dataPoints: DataPoint[];
//   setDataPoints: React.Dispatch<React.SetStateAction<DataPoint[]>>;
//   maxX: number;
//   setMaxX: React.Dispatch<React.SetStateAction<number>>;
//   setHTCDisplayValue: React.Dispatch<React.SetStateAction<string>>;
// }

// const RealTimeChart: React.FC<Props> = ({
//   dataPoints,
//   setDataPoints,
//   maxX,
//   setMaxX,
//   setHTCDisplayValue,
// }) => {
//   const userID = useSelector((state: AppState) => state.auth.userID);
//   const webSocketService = useRef<WebSocketServices | null>(null);
//   const throttledData = useRef(dataPoints);

//   const [windowStartIndex, setWindowStartIndex] = useState(0);
//   const windowSize = 100; // Default window size of 100 data points

//   const currentDataPoints = dataPoints.slice(
//     windowStartIndex,
//     windowStartIndex + windowSize
//   );

//   const throttledSetDataPoints = useCallback(
//     throttle((newData: DataPoint) => {
//       setDataPoints((prevData) => [...prevData, newData]);
//       setMaxX((prevMaxX) =>
//         newData.time > prevMaxX ? prevMaxX + 10 : prevMaxX
//       );

//       setHTCDisplayValue(newData.power.toFixed(2).toString());
//     }, 200),
//     [setDataPoints, setMaxX]
//   ); // Add throttled to enhance performance, so can prevent the flickering of the real time chart.

//   useEffect(() => {
//     webSocketService.current = new WebSocketServices(
//       "ws://localhost:3003",
//       handleMessage
//     );

//     function handleMessage(message: any) {
//       const jsonData = JSON.parse(message);
//       if (jsonData.userID.toString() === userID) {
//         const newData = parseDataPoint(jsonData);
//         throttledSetDataPoints(newData);
//       }
//     }

//     return () => {
//       webSocketService.current?.disconnect();
//     };
//   }, [userID, throttledSetDataPoints]);

//   const handleSliderChange = (value: number | number[]) => {
//     const index = Array.isArray(value) ? value[0] : value;
//     setWindowStartIndex(index);
//   };

//   return (
//     <div
//       id="he350-line-chart"
//       className="canva-chart"
//       style={{ zIndex: "10002px" }}
//     >
//       <Row style={{ justifyContent: "flex-end" }}>
//         &ensp; &ensp;
//         <ExportDropdown dataPoints={dataPoints} filename="HE350-ChartData" />
//       </Row>
//       <Line
//         style={{ zIndex: "10002px" }}
//         key={throttledData.current.length}
//         data={{
//           labels: throttledData.current.map(
//             (dp) => "Seconds: " + dp.time.toString()
//           ),
//           datasets: [
//             {
//               label: "Power",
//               data: dataPoints.map((dp) => ({ x: dp.time, y: dp.power })),
//               borderColor: "rgba(255, 99, 132, 1)",
//               tension: 0.1,
//               pointStyle: "line",
//             },
//           ],
//         }}
//         options={generateChartOptions({
//           chartTitle: "Power",
//           minX: currentDataPoints[0]?.time,
//           maxY: 100,
//           maxX: maxX,
//           xTitle: "Time(s)",
//           yTitle: "Value",
//         })}
//       />
//       <Slider
//         min={0}
//         max={Math.max(0, dataPoints.length - windowSize)}
//         value={windowStartIndex}
//         onChange={handleSliderChange}
//         style={{ width: "90%", margin: "20px auto" }}
//       />
//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-ReynoldsNumber" />
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "ReynoldsNumber",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.ReynoldsNumber,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Reynold's Number",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//         <div className="canva-multiple-chart">
//           <Line
//             style={{ zIndex: "10002px" }}
//             key={throttledData.current.length}
//             data={{
//               labels: throttledData.current.map(
//                 (dp) => "Seconds: " + dp.time.toString()
//               ),
//               datasets: [
//                 {
//                   label: "Nusselt Number",
//                   data: dataPoints.map((dp) => ({
//                     x: dp.time,
//                     y: dp.NusseltNumber,
//                   })),
//                   borderColor: "rgba(255, 99, 132, 1)",
//                   tension: 0.1,
//                   pointStyle: "line",
//                 },
//               ],
//             }}
//             options={generateChartOptions({
//               chartTitle: "Nusselt Number",
//               minX: currentDataPoints[0]?.time,
//               maxY: 100,
//               maxX: maxX,
//               xTitle: "Time(s)",
//               yTitle: "Value",
//             })}
//           />
//           <Slider
//             min={0}
//             max={Math.max(0, dataPoints.length - windowSize)}
//             value={windowStartIndex}
//             onChange={handleSliderChange}
//             style={{ width: "90%", margin: "20px auto" }}
//           />
//         </div>
//       </FlexRow>

//       <FlexRow>
//         <div className="canva-multiple-chart">
//           <ExportDropdown dataPoints={dataPoints} filename="HE350-AirVelocity" />
//           <Line
//             style={{ zIndex: "10002px"







