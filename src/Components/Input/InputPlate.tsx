import React, { useState } from "react";
import TwoPhaseVerticalInputPlate, { DataForTwoPhaseCalculation} from "./TwoPhaseVerticalInputPlate";
import { DataForThreePhaseVerticalCalculation} from "./ThreePhaseVerticalInputPlate";
import ThreePhaseHorizontalInputPlate, { DataForThreePhaseHorizontalCalculation } from "./ThreePhaseHorizontalInputPlate";
import ThreePhaseVerticalInputPlate from "./ThreePhaseVerticalInputPlate";
import TwoPhaseHorizontalInputPlate from "./TwoPhaseHorizontalInputPlate";

enum SeparatorType {
    TwoPhaseVertical = "Two-phase vertical separator",
    TwoPhaseHorizontal = "Two-phase horizontal separator",
    ThreePhaseVertical = "Three-phase vertical separator",
    ThreePhaseHorizontal = "Three-phase horizontal separator"
}

interface Props {
    onSeparatorChange: (separator: SeparatorType | null) => void;
    onInputSubmit: (input: DataForTwoPhaseCalculation | DataForThreePhaseVerticalCalculation | DataForThreePhaseHorizontalCalculation) => void;
};

const InputPlate: React.FC<Props> = ({ onSeparatorChange, onInputSubmit}) => {
    const [selectedSeparator, setSelectedSeparator] = useState<string | null>(null);
    
    const handleSeparatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as SeparatorType;
        setSelectedSeparator(value.toString());
        onSeparatorChange(value);
    };

    return (
        <div className="mb-4 p-6 bg-green-50 border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 flex justify-center">Input</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Separator type</label>
                <select 
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    value={selectedSeparator || ""}
                    onChange={handleSeparatorChange}
                >
                    <option value="" disabled>Select separator type</option>
                    {Object.values(SeparatorType).map((separator) => (
                        <option key={separator} value={separator}>{separator}</option>
                    ))}
                </select>
            </div>
            {selectedSeparator != null ? (
                <>
                    {(selectedSeparator == "Two-phase vertical separator" || selectedSeparator == "Two-phase horizontal separator") ? (
                        <>{selectedSeparator == "Two-phase vertical separator" ? (
                            <TwoPhaseVerticalInputPlate onInputSubmit={onInputSubmit} selectedSeparator={selectedSeparator}/>
                        ) : (
                            <TwoPhaseHorizontalInputPlate onInputSubmit={onInputSubmit} selectedSeparator={selectedSeparator}/>
                        )}</>
                    ) : (
                        selectedSeparator === "Three-phase vertical separator" ? (
                            <ThreePhaseVerticalInputPlate onInputSubmit={onInputSubmit} selectedSeparator={selectedSeparator}/>
                        ) : (
                            <ThreePhaseHorizontalInputPlate onInputSubmit={onInputSubmit} selectedSeparator={selectedSeparator}/>)
                        )
                    }
                </>
            ) : (
                null
            )}
        </div> 
    ); 
}; 

export default InputPlate; 