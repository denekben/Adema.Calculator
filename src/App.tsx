import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import InputPlate from './Components/Input/InputPlate';
import { DataForThreePhaseHorizontalCalculation } from './Components/Input/ThreePhaseHorizontalInputPlate';
import { DataForThreePhaseVerticalCalculation } from './Components/Input/ThreePhaseVerticalInputPlate';
import { DataForTwoPhaseCalculation } from './Components/Input/TwoPhaseVerticalInputPlate';
import SolutionPlate from './Components/Solution/SolutionPlate';
import OutputPlate from './Components/Output/OutputPlate';
import { ThreePhaseHorizontalTableRow } from './Components/Solution/ThreePhaseHorizontalSolution';
import { ThreePhaseVerticalTableRow } from './Components/Solution/ThreePhaseVerticalSolution';
import { TwoPhaseTableRow } from './Components/Solution/TwoPhaseHorizontalSolution';

function App() {
  const [highlightedRows, setHighlightedRows] = useState<any[]>([]); // Замените any на ваш тип данных
  const [selectedSeparator, setSelectedSeparator] = useState<string | null>(null);
  const [inputData, setInputData] = useState<DataForTwoPhaseCalculation | DataForThreePhaseVerticalCalculation | DataForThreePhaseHorizontalCalculation>();

  useEffect(() => {
    document.body.style.overflow = 'hidden'; 
    return () => {
      document.body.style.overflow = ''; // Восстанавливает прокрутку при размонтировании
    };
  }, []);

  const handleSeparatorChange = (separator: string | null) => {
    setSelectedSeparator(separator);
    setInputData(undefined);
  };

  const handleInputSubmit = (input : DataForTwoPhaseCalculation | DataForThreePhaseVerticalCalculation | DataForThreePhaseHorizontalCalculation) => {
    setInputData(input);
  }

  const handleHighlightedRowsChange = (rows: any) => {
    setHighlightedRows(rows);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-5xl font-bold text-left mb-2 mt-2 p-2">
        Separator calculator <span className="text-base">by Kabakova Adema, Zeinullova Assem, Kabdulla Kamilla</span>
      </h1>
      <div className="flex flex-grow justify-center">
        <div className="w-1/2 p-2 overflow-auto h-[90vh]">
          <InputPlate onSeparatorChange={handleSeparatorChange} onInputSubmit={handleInputSubmit}/>
          <>{(inputData?.selectedSeparator != null && inputData?.formInputs != null) ? (
            <OutputPlate highlightedRows={highlightedRows} selectedSeparator={selectedSeparator}/>
          ): null}</>
        </div>
        <div className="w-1/2 p-2 overflow-auto h-[90vh]">
          {(inputData?.selectedSeparator != null && inputData?.formInputs != null) ? (
            <SolutionPlate inputData={inputData} onHighlightChange={handleHighlightedRowsChange}/>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
