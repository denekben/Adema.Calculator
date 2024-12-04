import { useEffect, useState } from "react";
import { DataForThreePhaseHorizontalCalculation } from "../Input/ThreePhaseHorizontalInputPlate";
import { DataForThreePhaseVerticalCalculation, ThreePhaseVerticalInputs } from "../Input/ThreePhaseVerticalInputPlate";
import { DataForTwoPhaseCalculation, TwoPhaseInputs } from "../Input/TwoPhaseVerticalInputPlate";
import ThreePhaseHorizontalSolution, { ThreePhaseHorizontalTableRow } from "./ThreePhaseHorizontalSolution";
import ThreePhaseVerticalSolution, { ThreePhaseVerticalTableRow } from "./ThreePhaseVerticalSolution";
import TwoPhaseHorizontalSolution, { TwoPhaseTableRow } from "./TwoPhaseHorizontalSolution";
import TwoPhaseVerticalSolution from "./TwoPhaseVerticalSolution";

interface Props {
    inputData: DataForTwoPhaseCalculation | DataForThreePhaseVerticalCalculation | DataForThreePhaseHorizontalCalculation | null;
    onHighlightChange: (highlightedRows: any) => void;
}

const SolutionPlate: React.FC<Props> = ({ inputData, onHighlightChange }) => {
    return (
        <div className="mb-4 p-6 bg-green-50 border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto overflow-auto max-h-[930px]">
            <h2 className="text-2xl font-semibold mb-4 flex justify-center">Solution</h2>
            {inputData?.selectedSeparator === "Two-phase vertical separator" && <TwoPhaseVerticalSolution inputData={inputData as DataForTwoPhaseCalculation} onHighlightChange={onHighlightChange}/>}
            {inputData?.selectedSeparator === "Two-phase horizontal separator" && <TwoPhaseHorizontalSolution inputData={inputData as DataForTwoPhaseCalculation} onHighlightChange={onHighlightChange}/>}
            {inputData?.selectedSeparator === "Three-phase vertical separator" && <ThreePhaseVerticalSolution inputData={inputData as DataForThreePhaseVerticalCalculation} onHighlightChange={onHighlightChange}/>}
            {inputData?.selectedSeparator === "Three-phase horizontal separator" && <ThreePhaseHorizontalSolution inputData={inputData as DataForThreePhaseHorizontalCalculation} onHighlightChange={onHighlightChange}/>}
        </div>
    );
};

export default SolutionPlate;