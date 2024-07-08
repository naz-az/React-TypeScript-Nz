// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "../../../redux/hooks";
// import CustomNavbar from "../../../components/Navbar";
// import Row from "../../../components/Row";
// import CustomFooter from "../../../components/CustomFooter";
// import ErrorMessage from "../../../components/ErrorMessage";
// import PDFViewer from "../../../components/PDFViewer";
// import HE350ControlPanel from "./components/ControlPanel";
// import HE350Modelling from "./components/Modelling";
// import Experiment from "./components/Experiment";
// import Joyride, { Step, CallBackProps, ACTIONS, EVENTS } from "react-joyride";
// import HE350LineChart from "./components/LineChart";

// import {
//   he350Exp1Steps,
//   he350Exp2Steps,
//   he350Exp3Steps,
// } from "../../../experimentSteps/he350Steps";
// import { useRestAPI } from "../../../redux/useRestAPI";
// import { changeExperiment } from "../../../redux/modelSlice";
// import { DataPoint } from "./types";

// const FM27: React.FC = () => {
//   // API instance
//   const { executeMatlabCommand, runModel } = useRestAPI();

//   const handleCommandExecution = async (
//     command: string,
//     targetToChange?: string,
//     value?: number
//   ): Promise<{ success: boolean }> => {
//     // Define the expected return type
//     try {
//       const response = await executeMatlabCommand(
//         "he350",
//         command,
//         undefined,
//         targetToChange ?? undefined,
//         value ?? undefined
//       );
//       console.log("Response:", response);
//       return { success: response.success }; // Ensure to return an object with 'success'
//     } catch (e) {
//       console.log(e);
//       return { success: false }; // Handle exceptions by returning success as false
//     }
//   };

//   // State management with hooks
//   const dispatch = useDispatch();
//   const [showModelling, setShowModelling] = useState(true);
//   const [showError, setShowError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("An error has occurred!");
//   const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
//   const [maxX, setMaxX] = useState(50);
//   const [runTour, setRunTour] = useState(false);
//   const [stepIndex, setStepIndex] = useState(0);
//   const [steps, setSteps] = useState<Step[]>();
//   const [joyrideKey, setJoyrideKey] = useState(0); // Key state to force re-render



//   const [singleTube, setSingleTube] = useState<boolean>(true);
//   const [tubeBundle, setTubeBundle] = useState<boolean>(false);
//   const [finnedTube, setFinnedTube] = useState<boolean>(false);

//   const [tubeHeater, setTubeHeater] = useState<boolean>(false);
//   const [finnedtubeHeater, setfinnedTubeHeater] = useState<boolean>(false);

//   const [onAirBlower, setOnAirBlower] = useState<boolean>(false);
//   const [onHeater, setOnHeater] = useState<boolean>(false);

//   const [irisValue, setIrisValue] = useState<string>("1");
//   const [surfaceTempValue, setSurfaceTempValue] = useState<string>("0");
//   const [heaterPowerValue, setHeaterPowerValue] = useState<string>("0");
//   const [airTempValue, setAirTempValue] = useState<string>("0");
//   const [rowValue, setRowValue] = useState<string>("1");

//   const [startModelling, setStartModelling] = useState<boolean>(false);
//   const [pauseModelling, setPauseModelling] = useState<boolean>(false);

//   const [HTCDisplayValue, setHTCDisplayValue] = useState<string>("0");

//   // Selectors
//   const experimentState = useSelector((state) => state.model.experimentState);
//   const pdfVisibility = useSelector((state) => state.model.pdfVisible);
//   const currentPDF = useSelector((state) => state.model.currentPDF);
//   const currentExperiment = useSelector(
//     (state) => state.model.currentExperiment
//   );

//   // Error handling
//   const handleErrorClose = () => setShowError(false);
//   useEffect(() => {
//     const timer = setTimeout(() => setShowError(false), 2000); // Auto-hide error message after 2 seconds
//     return () => clearTimeout(timer);
//   }, [showError]);

//   // Tour guide logic
//   useEffect(() => {
//     setSteps(
//       currentExperiment === 1
//         ? he350Exp1Steps
//         : currentExperiment === 2
//           ? he350Exp2Steps
//           : currentExperiment === 3
//             ? he350Exp3Steps
//             : []
//     );
//   }, [currentExperiment]);

//   const handleJoyrideCallback = async (data: CallBackProps) => {
//     const { action, type, index } = data;

//     if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
//       let conditionMet = true;
//       setErrorMessage("Condition not met to proceed!"); // Customize this message per step
//       // Check current running experiment
//       if (currentExperiment === 1) {
//         // Check conditions based on the current step index
//         switch (index) {
//           case 0:
//             conditionMet = singleTube;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Single tube plate is not installed onto the vertical air duct"
//               );
//             break;
//           case 1:
//             conditionMet = tubeHeater;
//             console.log("tubeHeater:", tubeHeater); // Added console log for tubeHeater

//             if (!conditionMet)
//               setErrorMessage("Please insert the tube heater into the slot.");
//             break;
//           case 2:
//             conditionMet = onAirBlower;
//             console.log("onAirBlower:", onAirBlower); // Added console log for tubeHeater

//             if (!conditionMet)
//               setErrorMessage("Please switch on the air blower.");
//             break;
//           case 3:
//             conditionMet = onHeater;
//             console.log("onHeater:", onHeater); // Added console log for tubeHeater

//             if (!conditionMet) setErrorMessage("Please switch on the heater.");
//             break;
//           case 4:
//             conditionMet =
//               parseFloat(irisValue) === 1;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Please set the iris control to no. 1 to proceed."
//               );
//             break;
//           case 5:
//             conditionMet = parseFloat(surfaceTempValue) === 100;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Please adjust the set point of surface temperature to 100 °C."
//               );
//             break;
//           case 6:
//             conditionMet = parseFloat(heaterPowerValue) === 12;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Please adjust the heater power to 12 W in order to proceed to the next step!"
//               );
//             break;
//           case 7:
//             conditionMet = true;
//             break;
//           case 8:
//             conditionMet =
//               parseFloat(irisValue) === 2 ||
//               parseFloat(irisValue) === 3 ||
//               parseFloat(irisValue) === 4 ||
//               parseFloat(irisValue) === 5 ||
//               parseFloat(irisValue) === 6;
//             if (!conditionMet)
//               setErrorMessage(
//                 "The input iris value is not same with the requirement!"
//               );
//             break;
//           case 9:
//             conditionMet = !onHeater; // Heater turned off
//             if (!conditionMet)
//               setErrorMessage("Please ensure the heater is turned off.");
//             break;
//           case 10:
//             conditionMet = !onAirBlower; // fan turned off
//             if (!conditionMet)
//               setErrorMessage("Please ensure the air blower is turned off.");
//             break;
//           default:
//             conditionMet = true;

//         }
//       } else if (currentExperiment === 2) {
//         // Check conditions based on the current step index
//         switch (index) {
//           case 0:
//             conditionMet = tubeBundle;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Tube bundle plate is not installed onto the vertical air duct"
//               );
//             break;
//           case 1:
//             conditionMet = onAirBlower;
//             if (!conditionMet)
//               setErrorMessage("Please switch on the air blower.");
//             break;
//           case 2:
//             conditionMet = parseFloat(surfaceTempValue) === 100;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Please adjust the set point of surface temperature to 100 °C."
//               );
//             break;

//           case 3:
//             conditionMet = onHeater;
//             if (!conditionMet) setErrorMessage("Please switch on the heater.");
//             break;

//           case 4:
//           conditionMet =
//             tubeHeater && parseFloat(rowValue) === 1;
//           if (!conditionMet)
//             setErrorMessage(
//               "Please insert the tube heater into the slot in the correct row."
//             );
//           break;

//           case 5:
//             conditionMet =
//               parseFloat(irisValue) === 1;
//             if (!conditionMet)
//               setErrorMessage(
//                 "The input iris value is not same with the requirement!"
//               );
//             break;

//           case 6:
//               conditionMet = true;
//               break;
//           case 7: {
//             const deltaT = parseFloat(surfaceTempValue) - parseFloat(airTempValue);
//             conditionMet = deltaT >= 29.5 && deltaT <= 30.5;
//             if (!conditionMet) {
//               setErrorMessage(
//                 "Keep on adjusting the heater power until temperature difference (ΔT) is approximately 30°C."
//               );
//             }
//             break;
//           }
//           case 8:
//             conditionMet = true; // Placeholder for recording sT and inletT
//             break;
//           case 9:
//             conditionMet = true; // Placeholder for recording heater power Q
//             break;
//           case 10:
//             conditionMet =
//               parseFloat(irisValue) === 2 ||
//               parseFloat(irisValue) === 3 ||
//               parseFloat(irisValue) === 4 ||
//               parseFloat(irisValue) === 5 ||
//               parseFloat(irisValue) === 6;
//             if (!conditionMet)
//               setErrorMessage(
//                 "The input iris value is not same with the requirement!"
//               );
//             break;
//           case 11:
//             conditionMet =
//             ["2", "3", "4"].includes(rowValue);
//           if (!conditionMet)
//             setErrorMessage(
//               "Please insert the tube heater into the slot in the correct row."
//             );
//           break;
//           case 12:
//             conditionMet = !onHeater; // Heater turned off
//             if (!conditionMet)
//               setErrorMessage("Please ensure the heater is turned off.");
//             break;
//           case 13:
//             conditionMet = !onAirBlower; // Fan turned off
//             if (!conditionMet)
//               setErrorMessage("Please ensure the air blower is turned off.");
//             break;
//           default:
//             conditionMet = true;

//           // Add more cases as per your step validation needs
//         }
//       } else if (currentExperiment === 3) {
//         switch (index) {
//           case 0:
//             conditionMet = finnedTube;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Finned tube bundle plate is not installed onto the vertical air duct"
//               );
//             break;
//           case 1:
//             conditionMet = onAirBlower;
//             if (!conditionMet)
//               setErrorMessage("Please switch on the air blower.");
//             break;
//           case 2:
//             conditionMet = parseFloat(surfaceTempValue) === 100;
//             if (!conditionMet)
//               setErrorMessage(
//                 "Please adjust the set point of surface temperature to 100 °C."
//               );
//             break;

//           case 3:
//             conditionMet = onHeater;
//             if (!conditionMet) setErrorMessage("Please switch on the heater.");
//             break;

//           case 4:
//             conditionMet =
//             finnedtubeHeater && parseFloat(rowValue) === 1;
//           if (!conditionMet)
//             setErrorMessage(
//               "Please insert the finned tube heater into the slot in the correct row."
//             );
//           break;
//           case 5:
//             conditionMet =
//               parseFloat(irisValue) === 1;
//             if (!conditionMet)
//               setErrorMessage(
//                 "The input iris value is not same with the requirement!"
//               );
//             break;

//             case 6:
//               conditionMet = true;
//               break;


//           case 7: {
//             const deltaT = parseFloat(surfaceTempValue) - parseFloat(airTempValue);
//             conditionMet = deltaT >= 29.5 && deltaT <= 30.5;
//             if (!conditionMet) {
//               setErrorMessage(
//                 "Keep on adjusting the heater power until temperature difference (ΔT) is approximately 30°C."
//               );
//             }
//             break;
//           }
//           case 8:
//             conditionMet = true; // Placeholder for recording sT and inletT
//             break;
//           case 9:
//             conditionMet = true; // Placeholder for recording heater power Q
//             break;
//             case 10:
//               conditionMet =
//                 parseFloat(irisValue) === 2 ||
//                 parseFloat(irisValue) === 3 ||
//                 parseFloat(irisValue) === 4 ||
//                 parseFloat(irisValue) === 5 ||
//                 parseFloat(irisValue) === 6;
//               if (!conditionMet)
//                 setErrorMessage(
//                   "The input iris value is not same with the requirement!"
//                 );
//               break;
//             case 11:
//               conditionMet =
//               ["2", "3", "4"].includes(rowValue);
//             if (!conditionMet)
//               setErrorMessage(
//                 "Please insert the tube heater into the slot in the correct row."
//               );
//             break;
//             case 12:
//               conditionMet = !onHeater; // Heater turned off
//               if (!conditionMet)
//                 setErrorMessage("Please ensure the heater is turned off.");
//               break;
//             case 13:
//               conditionMet = !onAirBlower; // Fan turned off
//               if (!conditionMet)
//                 setErrorMessage("Please ensure the air blower is turned off.");
//               break;
//           default:
//             conditionMet = true;
//         }
//       }


//         if (!conditionMet) {
//           setShowError(true);
//           setJoyrideKey((prevKey) => prevKey + 1);
//           console.log(joyrideKey);
//           return; // Early return to stop from moving to the next step
//         } else {
//           if (currentExperiment === 1) {
//             switch (index) {
//               case 0:
//                 try {
//                   handleCommandExecution(
//                     "single_tube",
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//               case 4:
//                 try {
//                   handleCommandExecution(
//                     "changeIris",
//                     "iris",
//                     parseFloat(irisValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//               case 5:
//                 try {
//                   handleCommandExecution(
//                     "changeSurfaceTemp",
//                     "surfaceTemp",
//                     parseFloat(surfaceTempValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//               case 6:
//                 try {
//                   handleCommandExecution(
//                     "changePower",
//                     "power",
//                     parseFloat(heaterPowerValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;

//                 case 8:
//                   try {
//                     handleCommandExecution(
//                       "changeIris",
//                       "iris",
//                       parseFloat(irisValue)
//                     );
//                   } catch (e) {
//                     console.log(e);
//                   }
//                   break;


//               default:
//                 break;
//             }
//           } else if (currentExperiment === 2) {
//             switch (index) {

//               case 0:
//                 try {
//                   handleCommandExecution(
//                     "tube_bundle",
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;


//               case 2:
//                 try {
//                   handleCommandExecution(
//                     "changeSurfaceTemp",
//                     "surfaceTemp",
//                     parseFloat(surfaceTempValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//               case 4:
//                 try {
//                   handleCommandExecution(
//                     "changeRow",
//                     "row",
//                     parseFloat(rowValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//               case 5:
//                 try {
//                   handleCommandExecution(
//                     "changeIris",
//                     "iris",
//                     parseFloat(irisValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//               case 7:
//                 try {
//                   handleCommandExecution(
//                     "changePower",
//                     "power",
//                     parseFloat(heaterPowerValue)
//                   );
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;

//                 case 10:
//                   try {
//                     handleCommandExecution(
//                       "changeIris",
//                       "iris",
//                       parseFloat(irisValue)
//                     );
//                   } catch (e) {
//                     console.log(e);
//                   }
//                   break;
//                   case 11:
//                     try {
//                       handleCommandExecution(
//                         "changeRow",
//                         "row",
//                         parseFloat(rowValue)
//                       );
//                     } catch (e) {
//                       console.log(e);
//                     }
//                     break;

//               default:
//                 break;
//             }
//           } else if (currentExperiment === 3) {
//             switch (index) {
//               case 0:
//                 try {
//                   handleCommandExecution("finned_tube");
//                 } catch (e) {
//                   console.log(e);
//                 }
//                 break;
//                 case 2:
//                   try {
//                     handleCommandExecution(
//                       "changeSurfaceTemp",
//                       "surfaceTemp",
//                       parseFloat(surfaceTempValue)
//                     );
//                   } catch (e) {
//                     console.log(e);
//                   }
//                   break;
//                 case 4:
//                   try {
//                     handleCommandExecution(
//                       "changeRow",
//                       "row",
//                       parseFloat(rowValue)
//                     );
//                   } catch (e) {
//                     console.log(e);
//                   }
//                   break;
//                 case 5:
//                   try {
//                     handleCommandExecution(
//                       "changeIris",
//                       "iris",
//                       parseFloat(irisValue)
//                     );
//                   } catch (e) {
//                     console.log(e);
//                   }
//                   break;
//                 case 7:
//                   try {
//                     handleCommandExecution(
//                       "changePower",
//                       "power",
//                       parseFloat(heaterPowerValue)
//                     );
//                   } catch (e) {
//                     console.log(e);
//                   }
//                   break;
  
//                   case 10:
//                     try {
//                       handleCommandExecution(
//                         "changeIris",
//                         "iris",
//                         parseFloat(irisValue)
//                       );
//                     } catch (e) {
//                       console.log(e);
//                     }
//                     break;
//                     case 11:
//                       try {
//                         handleCommandExecution(
//                           "changeRow",
//                           "row",
//                           parseFloat(rowValue)
//                         );
//                       } catch (e) {
//                         console.log(e);
//                       }
//                       break;
  
//                 default:
//                   break;
//               }
//           }
//           setStepIndex(index + 1); // Proceed to the next step if condition is met
//           console.log("Move to next step");
//         }
// }

// if (type === EVENTS.STEP_AFTER && action === ACTIONS.PREV) {
//   setStepIndex(index - 1);
//   console.log("Back to the previous step!");
// }

// if (type === EVENTS.TOUR_END) {
//   setRunTour(false);
//   dispatch(changeExperiment(0));
//   setStepIndex(0); // Reset step index or prepare for restart
//   setJoyrideKey(0); //Reset Joyride Key after tour end
// }
// };



//   return (
//     <>
//       <CustomNavbar />
//       {showError && (
//         <ErrorMessage message={errorMessage} onClose={handleErrorClose} />
//       )}
//       <div>
//         <Row>
//         <HE350ControlPanel
//         setShowModelling={setShowModelling}
//         HTCDisplayValue={HTCDisplayValue}
//         tubeHeater={tubeHeater}
//         setTubeHeater={setTubeHeater}
//         onAirBlower={onAirBlower}
//         setOnAirBlower={setOnAirBlower}
//         onHeater={onHeater}
//         setOnHeater={setOnHeater}
//         finnedtubeHeater={finnedtubeHeater}
//         setfinnedTubeHeater={setfinnedTubeHeater}
//       />



//           {showModelling && (
//             <HE350Modelling
//               startModelling={startModelling}
//               pauseModelling={pauseModelling}
//               setDataPoints={setDataPoints}
//               setMaxX={setMaxX}
//               setStartModelling={setStartModelling}
//               setPauseModelling={setPauseModelling}
//               singleTube={singleTube}
//               tubeBundle={tubeBundle}
//               finnedTube={finnedTube}
//               tubeHeater={tubeHeater}
//               onAirBlower={onAirBlower}
//               onHeater={onHeater}
//               irisValue={irisValue}
//               surfaceTempValue={surfaceTempValue}
//               heaterPowerValue={heaterPowerValue}
//               airTempValue={airTempValue}
//               rowValue={rowValue}
//               setSingleTube={setSingleTube}
//               setTubeBundle={setTubeBundle}
//               setFinnedTube={setFinnedTube}
//               setTubeHeater={setTubeHeater}
//               setfinnedTubeHeater={setfinnedTubeHeater}
//               setOnAirBlower={setOnAirBlower}
//               setOnHeater={setOnHeater}
//               setIrisValue={setIrisValue}
//               setSurfaceTempValue={setSurfaceTempValue}
//               setHeaterPowerValue={setHeaterPowerValue}
//               setAirTempValue={setAirTempValue}
//               setRowValue={setRowValue}
//             />
//           )}
//         </Row>
//         {experimentState && (
//           <Experiment
//             startModelling={startModelling}
//             setStartModelling={setStartModelling}
//             setDataPoints={setDataPoints}
//             setMaxX={setMaxX}
//             setRunTour={setRunTour}
//             setSingleTube={setSingleTube}
//             setTubeBundle={setTubeBundle}
//             setFinnedTube={setFinnedTube}
//           />
//         )}
//         <Joyride
//           continuous
//           key={joyrideKey}
//           run={runTour}
//           steps={steps}
//           stepIndex={stepIndex}
//           callback={handleJoyrideCallback}
//           scrollToFirstStep
//           showProgress
//           showSkipButton={true}
//           disableScrolling={stepIndex < 9 ? true : false}
//           styles={{ options: { zIndex: 100 } }}
//         />
//       </div>
//       <br />
//       <div style={{ zIndex: "100px" }}>
//         <HE350LineChart
//           dataPoints={dataPoints}
//           setDataPoints={setDataPoints}
//           maxX={maxX}
//           setMaxX={setMaxX}
//           setHTCDisplayValue={setHTCDisplayValue}
//         />
//       </div>
//       {pdfVisibility && <PDFViewer fileUrl={currentPDF} />}
//       <br />
//       <CustomFooter />
//     </>
//   );
// };

// export default FM27;
