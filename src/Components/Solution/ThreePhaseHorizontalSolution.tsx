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

const ThreePhaseHorizontalSolution:React.FC<Props>  = ({inputData, onHighlightChange}) => {
    const SG = Calculation.SG(inputData.formInputs.Sgo) as number;
    const deltaSG = Calculation.deltaSG(inputData.formInputs.Sgw, SG as number) as number;
    const homax = Calculation.homax(inputData.formInputs.tro, deltaSG as number, inputData.formInputs.dropletWater,inputData.formInputs.muo) as number;
    const AwA = Calculation.AwA(inputData.formInputs.Qw, inputData.formInputs.trw, inputData.formInputs.tro, inputData.formInputs.Qo) as number;
    const beta  = Calculation.beta(AwA as number) as number;
    const dmax = Calculation.dmax(homax as number, beta as number) as number as number;

    const d2Leff = Calculation.d2LiquidLeff2(inputData.formInputs.Qw, inputData.formInputs.trw, inputData.formInputs.Qo, inputData.formInputs.tro);

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
            <table className="min-w-full bg-green-100 text-center border border-gray-300 rounded-lg overflow-hidden border-collapse">
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
        </>
    );
}

export default ThreePhaseHorizontalSolution;