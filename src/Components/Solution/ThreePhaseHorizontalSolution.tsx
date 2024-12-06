import Latex from "react-latex";
import { Calculation } from "../../Services/CalculationService";
import { DataForThreePhaseHorizontalCalculation } from "../Input/ThreePhaseHorizontalInputPlate";
import { useEffect } from "react";
import image from "./Beta/image.png";

interface Props {
    inputData: DataForThreePhaseHorizontalCalculation,
    onHighlightChange: (highlightedRows: ThreePhaseHorizontalTableRow) => void;
}

export interface ThreePhaseHorizontalTableRow {
    d: number;      
    LeffL: number;  
    LssL: number;   
    SR: number;   
}

const tableData= [60,72,84,96,108, 120, 132,144,156,168,180,196,208,220,232,244,256,268,280,292,304,316,328,340];

const abcTableData = {
    "C1": [8.976,1780.5,230],
    "C2": [8.785,1569.5,234.2],
    "C3": [8.726,1317.2,224],
    "H2S": [7.948,1470.6,211],
    "CO2": [7.92,1376,239],
    "H2O": [8.14,1810.94,244.15],
    "Oil": [8.5,1250,230]
};

const ThreePhaseHorizontalSolution:React.FC<Props>  = ({inputData, onHighlightChange}) => {
    const SG = Calculation.SG(inputData.formInputs.Sgo) as number;
    const deltaSG = Calculation.deltaSG(inputData.formInputs.Sgw, SG as number) as number;
    const homax = Calculation.homax(inputData.formInputs.tro, deltaSG as number, inputData.formInputs.dropletWater,inputData.formInputs.muo) as number;
    const AwA = Calculation.AwA(inputData.formInputs.Qw, inputData.formInputs.trw, inputData.formInputs.tro, inputData.formInputs.Qo) as number;
    const beta  = Calculation.beta(AwA as number) as number;
    const dmax = Calculation.dmax(homax as number, beta as number) as number as number;

    const d2Leff = Calculation.d2LiquidLeff2(inputData.formInputs.Qw, inputData.formInputs.trw, inputData.formInputs.Qo, inputData.formInputs.tro);

    const C = Calculation.RtoC(inputData.formInputs.To) as number;

    const rows = tableData.map(d => {
        const LeffL = Number(((d2Leff as number) / d**2).toFixed(6)) as number;
        const LssL = Calculation.LiquidLss(LeffL as number) as number;
        const SR = Calculation.SR(LssL, d) as number;

        return { d, LeffL, LssL, SR };
    });

    useEffect(() => {
        const highlightedRows = rows.filter(({ d, SR }) => SR >= 3 && SR <= 5 && d <= dmax);
        onHighlightChange(highlightedRows[0]);
    }, [inputData]);

    const latex1_1 = `$$SG=\\frac{141.5}{131.5+API}$$`;
    const latex1_2 = `$$SG=\\frac{141.5}{131.5+${inputData.formInputs.Sgo}}$$`;
    const latex1_3 = `$$SG=${SG}$$`;

    const latex1_4 = `$$\\Delta SG=SG_w-SG$$`;
    const latex1_5 = `$$\\Delta SG=${inputData.formInputs.Sgw}-${SG}$$`;
    const latex1_6 = `$$\\Delta SG=${deltaSG}$$`;

    const latex2_1 = `$$(h_o)_{max}=(1.28*10^{-3})*\\frac{(t_r)_o*(\\Delta SG)*d_m^2}{μ_o}$$`;
    const latex2_2 = `$$(h_o)_{max}=(1.28*10^{-3})*\\frac{${inputData.formInputs.tro}*${deltaSG}*${inputData.formInputs.dropletWater}^2}{${inputData.formInputs.mu}}$$`;
    const latex2_3 = `$$(h_o)_{max}=${homax}$$`;
    
    const latex3_1 = `$$\\frac{A_w}{A}=0.5*\\frac{Q_w*(t_r)_w}{(t_r)*Q_o+(t_r)_w*Q_w}$$`;
    const latex3_2 = `$$\\frac{A_w}{A}=0.5*\\frac{${inputData.formInputs.Qw}*${inputData.formInputs.trw}}{${inputData.formInputs.tro}*${inputData.formInputs.Qo}+${inputData.formInputs.trw}*${inputData.formInputs.Qw}}$$`;
    const latex3_3 = `$$\\frac{A_w}{A}=${AwA}$$`;

    const latex4_1 = `$$\\beta  \\approx ${beta}$$`;

    const latex5_1 = `$$d_{max}=\\frac{(h_o)_{max}}{\\beta}$$`;
    const latex5_2 = `$$d_{max}=\\frac{${homax}}{${beta}}$$`;
    const latex5_3 = `$$d_{max}=${dmax}\\ in$$`;

    const latex6_1 = `$$d^2*L_{eff}=1.42*[Q_w*(t_r)_w+Q_o*(t_r)_o]$$`;
    const latex6_2 = `$$d^2*L_{eff}=1.42*[${inputData.formInputs.Qw}*${inputData.formInputs.trw}+${inputData.formInputs.Qo}*${inputData.formInputs.tro}]$$`;
    const latex6_3 = `$$d^2*L_{eff}=${d2Leff}$$`;

    const latex7_1 = `$$P_{sat}=10^{A-\\frac{B}{C+T}}$$`;
    const latex7_2 = `$$P_{sat}(C1)=10^{${abcTableData["C1"][0]}-\\frac{${abcTableData["C1"][1]}}{${abcTableData["C1"][2]}+${C}}}$$`;
    const latex7_3 = `$$P_{sat}(C1)=${Calculation.Psat(abcTableData["C1"], C)}$$`;
    const latex7_4 = `$$P_{sat}(C2)=10^{${abcTableData["C2"][0]}-\\frac{${abcTableData["C2"][1]}}{${abcTableData["C2"][2]}+${C}}}$$`;
    const latex7_5 = `$$P_{sat}(C2)=${Calculation.Psat(abcTableData["C2"], C)}$$`;
    const latex7_6 = `$$P_{sat}(C3)=10^{${abcTableData["C3"][0]}-\\frac{${abcTableData["C3"][1]}}{${abcTableData["C3"][2]}+${C}}}$$`;
    const latex7_7 = `$$P_{sat}(C3)=${Calculation.Psat(abcTableData["C3"], C)}$$`;
    const latex7_8 = `$$P_{sat}(H2S)=10^{${abcTableData["H2S"][0]}-\\frac{${abcTableData["H2S"][1]}}{${abcTableData["H2S"][2]}+${C}}}$$`;
    const latex7_9 = `$$P_{sat}(H2S)=${Calculation.Psat(abcTableData["H2S"], C)}$$`;
    const latex7_10 = `$$P_{sat}(CO2)=10^{${abcTableData["CO2"][0]}-\\frac{${abcTableData["CO2"][1]}}{${abcTableData["CO2"][2]}+${C}}}$$`;
    const latex7_11 = `$$P_{sat}(CO2)=${Calculation.Psat(abcTableData["CO2"], C)}$$`;
    const latex7_12 = `$$P_{sat}(H2O)=10^{${abcTableData["H2O"][0]}-\\frac{${abcTableData["H2O"][1]}}{${abcTableData["H2O"][2]}+${C}}}$$`;
    const latex7_13 = `$$P_{sat}(H2O)=${Calculation.Psat(abcTableData["H2O"], C)}$$`;
    const latex7_14 = `$$P_{sat}(Oil)=10^{${abcTableData["Oil"][0]}-\\frac{${abcTableData["Oil"][1]}}{${abcTableData["Oil"][2]}+${C}}}$$`;
    const latex7_15 = `$$P_{sat}(Oil)=${Calculation.Psat(abcTableData["Oil"], C)}$$`;

    const latex8_1 = `$$K_{i}=\\frac{P_{sat}}{P}$$`;
    const latex8_2 = `$$K_{i}(C1)=\\frac{${Calculation.Psat(abcTableData["C1"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_3 = `$$K_{i}(C1)=${Calculation.Ki(Calculation.Psat(abcTableData["C1"], C) as number, inputData.formInputs.Po)}$$`;
    const latex8_4 = `$$K_{i}(C2)=\\frac{${Calculation.Psat(abcTableData["C2"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_5 = `$$K_{i}(C2)=${Calculation.Ki(Calculation.Psat(abcTableData["C2"], C) as number, inputData.formInputs.Po)}$$`;
    const latex8_6 = `$$K_{i}(C3)=\\frac{${Calculation.Psat(abcTableData["C3"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_7 = `$$K_{i}(C3)=${Calculation.Ki(Calculation.Psat(abcTableData["C3"], C) as number, inputData.formInputs.Po)}$$`;
    const latex8_8 = `$$K_{i}(H2S)=\\frac{${Calculation.Psat(abcTableData["H2S"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_9 = `$$K_{i}(H2S)=${Calculation.Ki(Calculation.Psat(abcTableData["H2S"], C) as number, inputData.formInputs.Po)}$$`;
    const latex8_10 = `$$K_{i}(CO2)=\\frac{${Calculation.Psat(abcTableData["CO2"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_11 = `$$K_{i}(CO2)=${Calculation.Ki(Calculation.Psat(abcTableData["CO2"], C) as number, inputData.formInputs.Po)}$$`;
    const latex8_12 = `$$K_{i}(H2O)=\\frac{${Calculation.Psat(abcTableData["H2O"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_13 = `$$K_{i}(H2O)=${Calculation.Ki(Calculation.Psat(abcTableData["H2O"], C) as number, inputData.formInputs.Po)}$$`;
    const latex8_14 = `$$K_{i}(Oil)=\\frac{${Calculation.Psat(abcTableData["Oil"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex8_15 = `$$K_{i}(Oil)=${Calculation.Ki(Calculation.Psat(abcTableData["Oil"], C) as number, inputData.formInputs.Po)}$$`;

    const latex9_1 = `$$Gas=F_{total\\ feed}*\\frac{V}{F}$$`;
    const latex9_2 = `$$Gas=${1}*${0.121}$$`;
    const latex9_3 = `$$Gas=${0.121}$$`;
    const latex9_4 = `$$Water=\\frac{F_{total\\ feed}}{${2}}$$`;
    const latex9_5 = `$$Water=\\frac{${1}}{${2}}$$`;
    const latex9_6 = `$$Water=${0.5}$$`;
    const latex9_7 = `$$Oil=F_{total\\ feed}-Gas-Water$$`;
    const latex9_8 = `$$Oil=${1}-${0.121}-${0.5}$$`;
    const latex9_9 = `$$Oil=${0.379}$$`;

    return(
        <>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 1. &Delta;SG calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto ">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                        <Latex>{latex1_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex1_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_4}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_5}</Latex>
                    </div>
                    <div>
                        <Latex>{latex1_6}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 2. (h<sub>o</sub>)<sub>max</sub> calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                        <Latex>{latex2_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex2_2}</Latex>
                    </div>
                    <div>
                        <Latex>{latex2_3}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 3. A<sub>w</sub>/A calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                        <Latex>{latex3_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex3_2}</Latex>
                    </div>
                    <div>
                        <Latex>{latex3_3}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 4. &beta; approximation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <img src = {image} className="shadow-md rounded-lg"/>
                    <div className="mt-4">
                        <Latex>{latex4_1}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 5. d<sub>max</sub> calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>    
                        <Latex>{latex5_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_2}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_3}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 6. d<sup>2</sup>*L<sub>eff</sub> calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>    
                        <Latex>{latex6_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex6_2}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex6_3}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 7. Table sizing constraintion</h3>
            <table className="min-w-full mb-8 bg-green-100 text-center border border-gray-300 rounded-lg overflow-hidden border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$d \\ (in)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$LeffL \\ (ft) $$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$LssL \\ (ft) $$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$SR\\ (12Lss/d)$$`}</Latex></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ d, LeffL, LssL, SR }, index) => {
                        const isHighlighted = (SR as number  >=3 && SR as number <= 5 && d <= (dmax as number));

                        return (
                            <tr key={index} className={isHighlighted ? 'bg-orange-300' : ''}>
                                <td className="border border-gray-300 px-4 py-2">{d}</td>
                                <td className="border border-gray-300 px-4 py-2">{LeffL}</td>
                                <td className="border border-gray-300 px-4 py-2">{LssL}</td>
                                <td className="border border-gray-300 px-4 py-2">{SR}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 8. P<sub>sat</sub> calculation</h3>
            <div className="mb-8 p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">Antoine's data for each component</h3>
                <table className="min-w-full mb-4 bg-green-200 text-center border border-gray-300 rounded-lg overflow-hidden border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2"><Latex>{`$$Component$$`}</Latex></th>
                            <th className="border border-gray-300 px-4 py-2"><Latex>{`$$A$$`}</Latex></th>
                            <th className="border border-gray-300 px-4 py-2"><Latex>{`$$B$$`}</Latex></th>
                            <th className="border border-gray-300 px-4 py-2"><Latex>{`$$C$$`}</Latex></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(abcTableData).map(([key, values]) => (
                            <tr key={key}>
                                <td className="border border-gray-300 px-4 py-2">{key}</td>
                                {values.map((value, index) => (
                                    <td key={index} className="border border-gray-300 px-4 py-2">{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-8'>
                        <Latex>{latex7_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex7_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_4}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex7_5}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_6}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex7_7}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_8}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex7_9}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_10}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex7_11}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_12}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex7_13}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex7_14}</Latex>
                    </div>
                    <div className=''>
                        <Latex>{latex7_15}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 9. K<sub>i</sub> calculation</h3>
            <div className="mb-8 p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                <div className='mb-8'>
                        <Latex>{latex8_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex8_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_4}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex8_5}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_6}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex8_7}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_8}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex8_9}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_10}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex8_11}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_12}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex8_13}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex8_14}</Latex>
                    </div>
                    <div>
                        <Latex>{latex8_15}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 10. Gas, Water, Oil calculation</h3>
            <div className="p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                        <Latex>{latex9_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex9_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex9_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex9_4}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex9_5}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex9_6}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex9_7}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex9_8}</Latex>
                    </div>
                    <div>
                        <Latex>{latex9_9}</Latex>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ThreePhaseHorizontalSolution;