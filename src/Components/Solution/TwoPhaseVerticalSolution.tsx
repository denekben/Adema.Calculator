import React, { useEffect, useState } from 'react';
import Latex from 'react-latex';
import { Calculation, ZFactorCalculator } from '../../Services/CalculationService';
import { DataForTwoPhaseCalculation } from '../Input/TwoPhaseVerticalInputPlate';

import image1 from './Z/0.55.png';
import image2 from './Z/0.6.png';
import image3 from './Z/0.65.png';
import image4 from './Z/0.7.png';
import image5 from './Z/0.8.png';
import image6 from './Z/0.9.png';


interface Props {
    inputData: DataForTwoPhaseCalculation;
}

const tableData = {
    1: [10,16,18,20,24,30,36,42,48],
    2: [10,16,18,20,24,30,36,42,48],
    3: [10,16,18,20,24,30,36,42,48]
}

const abcTableData = {
    "C1": [8.976,1780.5,230],
    "C2": [8.785,1569.5,234.2],
    "C3": [8.726,1317.2,224],
    "C4+": [8.45,1100,220],
    "H2S": [7.948,1470.6,211],
    "CO2": [7.92,1376,239]
};

interface Props {
    inputData: DataForTwoPhaseCalculation;
    onHighlightChange: (highlightedRows: TwoPhaseTableRow) => void;
}

export interface TwoPhaseTableRow {
    tr: number;
    d: number;      
    hValue: number;  
    LssValue: number; 
    SRValue: number;  
}

const TwoPhaseVerticalSolution:React.FC<Props> = ({inputData,onHighlightChange}) => {
    const [zFactor, setZFactor] = useState<number>(1);
    const SG = (Calculation.SG(inputData.formInputs.Sgo) as number);
    const pl = Calculation.pl(SG as number) as number;
    const pg = Calculation.pg(inputData.formInputs.Sg, inputData.formInputs.Po, inputData.formInputs.To, zFactor as number) as number;
    const Vt0 = Calculation.Vt(pl as number, pg as number, inputData.formInputs.dm) as number;

    const Re0 = Calculation.Re(pg as number, inputData.formInputs.dm, Vt0 as number, inputData.formInputs.mu) as number;
    const CD0 = Calculation.Cd(Re0 as number) as number;

    const VtWithCd1 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dm, CD0 as number) as number;
    const Re1 = Calculation.Re(pg as number, inputData.formInputs.dm, VtWithCd1 as number, inputData.formInputs.mu) as number;
    const CD1 = Calculation.Cd(Re1 as number) as number;

    const VtWithCd2 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dm, CD1 as number) as number;
    const Re2 = Calculation.Re(pg as number, inputData.formInputs.dm, VtWithCd2 as number, inputData.formInputs.mu) as number;
    const CD2 = Calculation.Cd(Re2 as number) as number;

    const VtWithCd3 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dm, CD2 as number) as number;
    const Re3 = Calculation.Re(pg as number, inputData.formInputs.dm, VtWithCd3 as number, inputData.formInputs.mu) as number;
    const CD3 = Calculation.Cd(Re3 as number) as number;

    const VtWithCd4 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dm, CD3 as number) as number;
    const Re4 = Calculation.Re(pg as number, inputData.formInputs.dm, VtWithCd4 as number, inputData.formInputs.mu) as number;
    const CD4 = Calculation.Cd(Re4 as number) as number;

    const d2 = Calculation.d2(inputData.formInputs.To, zFactor, inputData.formInputs.Qg, inputData.formInputs.Po, pg as number, pl as number, CD4 as number, inputData.formInputs.dm) as number;
    const dmin = Number(((d2 as number)**0.5).toFixed(6));

    const Ql = Calculation.Ql(inputData.formInputs.Qw, inputData.formInputs.Qo) as number;
    const d2h = Calculation.d2h(inputData.formInputs.tr, Ql as number) as number;

    const tr = inputData.formInputs.tr as number;
    const rows = tableData[inputData.formInputs.tr as 1 | 2 | 3].map(d => {
        const hValue = Calculation.h(d2h as number, d**2) as number;
        const LssValue = Calculation.Lss(hValue as number, d) as number;
        const SRValue = Calculation.SR(LssValue as number, d) as number;
        return {tr, d, hValue, LssValue, SRValue };
    });

    const C = Calculation.RtoC(inputData.formInputs.To) as number;

    const getImage = (input: string): string => {
        switch (input) {
            case '0.55':
                return image1;
            case '0.6':
                return image2;
            case '0.65':
                return image3;
            case '0.7':
                return image4;
            case '0.8':
                return image5;
            case '0.9':
                return image6;
            default:
                return '';
        }
    };

    const selectedImage = getImage(inputData.formInputs.Sg.toString());
    useEffect(() => {
        const loadData = async () => {
            await ZFactorCalculator.loadSPGRData('./spgrs.json'); 
            setZFactor(ZFactorCalculator.calculateZFactor(inputData.formInputs.To - 459.67, inputData.formInputs.Sg, inputData.formInputs.Po) as number);
            console.log(zFactor);
        };
        loadData();
        console.log("dmin",dmin);
        const highlightedRows = rows.filter(({ d, SRValue }) => d > dmin && SRValue >= 3 && SRValue <= 4);
        onHighlightChange(highlightedRows[0]);

    }, [inputData]);

    const latex0_1 = `$$Z \\approx ${zFactor}$$`;

    const latex1_1 = `$$SG=\\frac{141.5}{131.5+API}$$`;
    const latex1_2 = `$$SG=\\frac{141.5}{131.5+${inputData.formInputs.Sgo}}$$`;
    const latex1_3 = `$$SG=${SG}$$`;

    const latex1_4 = `$$ρ_l=62.4*SG$$`;
    const latex1_5 = `$$ρ_l=62.4*${SG}$$`;
    const latex1_6 = `$$ρ_l=${pl}\\ lb/ft^3$$`;

    const latex1_7 = `$$ρ_g=2.7*\\frac{SG*P_o}{T_o*Z}$$`;
    const latex1_8 = `$$ρ_g=2.7*\\frac{${inputData.formInputs.Sg}*${inputData.formInputs.Po}}{${inputData.formInputs.To}*${zFactor}}$$`;
    const latex1_9 = `$$ρ_g=${pg}\\ lb/ft^3$$`;

    const latex1_10 = `$$V_t=0.0204*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g}]^{1/2}$$`;
    const latex1_11 = `$$V_t=0.0204*[\\frac{(${pl}-${pg})*${inputData.formInputs.dm}}{p_g}]^{1/2}$$`;
    const latex1_12 = `$$V_t=${Vt0}\\ ft/s$$`;

    const latex1_13 = `$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`;
    const latex1_14 = `$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dm}*${Vt0}}{${inputData.formInputs.mu}}$$`;
    const latex1_15 = `$$Re=${Re0}$$`;

    const latex1_16 = `$$C_D = \\frac{24}{Re}+\\frac{3}{Re^{1/2}}+0.34$$`;
    const latex1_17 = `$$C_D = \\frac{24}{${Re0}}+\\frac{3}{${Re0}^{1/2}}+0.34$$`;
    const latex1_18 = `$$C_D = ${CD0}$$`;

    const latex2_1 = `$$d^{2}=5040*[\\frac{T*Z*Q_g}{P}]*[(\\frac{p_g}{p_l-p_g})*\\frac{C_D}{d_m}]^{1/2}$$`;
    const latex2_2 = `$$d^{2}=5040*[\\frac{${inputData.formInputs.To}*${zFactor}*${inputData.formInputs.Qg}}{${inputData.formInputs.Po}}]*[(\\frac{${pg}}{${pl}-${pg}})*\\frac{${CD4}}{${inputData.formInputs.dm}}]^{1/2}$$`;
    const latex2_3 = `$$d^{2}=${d2}$$`;
    const latex2_4 = `$$d=${dmin}\\ in$$`;

    const latex3_1 = `$$Q_l=Q_w+Q_o$$`;
    const latex3_2 = `$$Q_l=${inputData.formInputs.Qw}+${inputData.formInputs.Qo}$$`;
    const latex3_3 = `$$Q_l=${Ql}$$`;

    const latex3_4 = `$$d^{2}*h=\\frac{t_r*Q_l}{0.12}$$`;
    const latex3_5 = `$$d^{2}*h=\\frac{${inputData.formInputs.tr}*${Ql}}{0.12}$$`;
    const latex3_6 = `$$d^{2}*h=${d2h}$$`;

    const latex4_1 = `$$P_{sat}=10^{A-\\frac{B}{C+T}}$$`;
    const latex4_2 = `$$P_{sat}(C1)=10^{${abcTableData["C1"][0]}-\\frac{${abcTableData["C1"][1]}}{${abcTableData["C1"][2]}+${C}}}$$`;
    const latex4_3 = `$$P_{sat}(C1)=${Calculation.Psat(abcTableData["C1"], C)}$$`;
    const latex4_4 = `$$P_{sat}(C2)=10^{${abcTableData["C2"][0]}-\\frac{${abcTableData["C2"][1]}}{${abcTableData["C2"][2]}+${C}}}$$`;
    const latex4_5 = `$$P_{sat}(C2)=${Calculation.Psat(abcTableData["C2"], C)}$$`;
    const latex4_6 = `$$P_{sat}(C3)=10^{${abcTableData["C3"][0]}-\\frac{${abcTableData["C3"][1]}}{${abcTableData["C3"][2]}+${C}}}$$`;
    const latex4_7 = `$$P_{sat}(C3)=${Calculation.Psat(abcTableData["C3"], C)}$$`;
    const latex4_8 = `$$P_{sat}(C4+)=10^{${abcTableData["C4+"][0]}-\\frac{${abcTableData["C4+"][1]}}{${abcTableData["C4+"][2]}+${C}}}$$`;
    const latex4_9 = `$$P_{sat}(C4+)=${Calculation.Psat(abcTableData["C4+"], C)}$$`;
    const latex4_10 = `$$P_{sat}(H2S)=10^{${abcTableData["H2S"][0]}-\\frac{${abcTableData["H2S"][1]}}{${abcTableData["H2S"][2]}+${C}}}$$`;
    const latex4_11 = `$$P_{sat}(H2S)=${Calculation.Psat(abcTableData["H2S"], C)}$$`;
    const latex4_12 = `$$P_{sat}(CO2)=10^{${abcTableData["CO2"][0]}-\\frac{${abcTableData["CO2"][1]}}{${abcTableData["CO2"][2]}+${C}}}$$`;
    const latex4_13 = `$$P_{sat}(CO2)=${Calculation.Psat(abcTableData["CO2"], C)}$$`;

    const latex5_1 = `$$K_{i}=\\frac{P_{sat}}{P}$$`;
    const latex5_2 = `$$K_{i}(C1)=\\frac{${Calculation.Psat(abcTableData["C1"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex5_3 = `$$K_{i}(C1)=${Calculation.Ki(Calculation.Psat(abcTableData["C1"], C) as number, inputData.formInputs.Po)}$$`;
    const latex5_4 = `$$K_{i}(C2)=\\frac{${Calculation.Psat(abcTableData["C2"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex5_5 = `$$K_{i}(C2)=${Calculation.Ki(Calculation.Psat(abcTableData["C2"], C) as number, inputData.formInputs.Po)}$$`;
    const latex5_6 = `$$K_{i}(C3)=\\frac{${Calculation.Psat(abcTableData["C3"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex5_7 = `$$K_{i}(C3)=${Calculation.Ki(Calculation.Psat(abcTableData["C3"], C) as number, inputData.formInputs.Po)}$$`;
    const latex5_8 = `$$K_{i}(C4+)=\\frac{${Calculation.Psat(abcTableData["C4+"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex5_9 = `$$K_{i}(C4+)=${Calculation.Ki(Calculation.Psat(abcTableData["C4+"], C) as number, inputData.formInputs.Po)}$$`;
    const latex5_10 = `$$K_{i}(H2S)=\\frac{${Calculation.Psat(abcTableData["H2S"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex5_11 = `$$K_{i}(H2S)=${Calculation.Ki(Calculation.Psat(abcTableData["H2S"], C) as number, inputData.formInputs.Po)}$$`;
    const latex5_12 = `$$K_{i}(CO2)=\\frac{${Calculation.Psat(abcTableData["CO2"], C)}}{${inputData.formInputs.Po}}$$`;
    const latex5_13 = `$$K_{i}(CO2)=${Calculation.Ki(Calculation.Psat(abcTableData["CO2"], C) as number, inputData.formInputs.Po)}$$`;

    const latex6_1 = `$$Gas=F_{total \\ feed}*\\frac{V}{F}$$`;
    const latex6_2 = `$$Gas=${1}*${0.121}$$`;
    const latex6_3 = `$$Gas=${0.121}$$`;
    const latex6_4 = `$$Oil=F_{total \\ feed}-Gas$$`;
    const latex6_5 = `$$Oil=${1}-${0.121}$$`;
    const latex6_6 = `$$Oil=${0.879}$$`;

    return (
        <>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 1. Z-factor approximation</h3>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md max-w-full mx-auto bg-green-100">
                <div className="flex flex-col justify-center items-center">
                    <img src = {selectedImage} className="shadow-md rounded-lg"/>
                    <div className='mt-4'>
                            <Latex>{latex0_1}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 2. C<sub>D</sub> calculation</h3>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md max-w-full mx-auto bg-green-100">
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
                    <div className='mb-4'>
                        <Latex>{latex1_6}</Latex>
                    </div>

                    <div className='mb-4'>
                        <Latex>{latex1_7}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_8}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex1_9}</Latex>
                    </div>

                    <div className='mb-4'>
                        <Latex>{latex1_10}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_11}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex1_12}</Latex>
                    </div>

                    <div className='mb-4'>
                        <Latex>{latex1_13}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_14}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex1_15}</Latex>
                    </div>

                    <div className='mb-4'>
                        <Latex>{latex1_16}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_17}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex1_18}</Latex>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-left">C<sub>D</sub> approximation, 1<sub>st</sub> iteration</h3>
                    <div className=" mb-8 flex flex-col justify-center items-center  bg-green-200 rounded-lg shadow-md w-full">
                        <div className='mb-4 mt-4'>
                            <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dm}}{${CD0}}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$V_t=${VtWithCd1}\\ ft/s$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dm}*${VtWithCd1}}{${inputData.formInputs.mu}}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$Re=${Re1}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{Re}+\\frac{3}{Re^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{${Re1}}+\\frac{3}{${Re1}^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = ${CD1}$$`}</Latex>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-left">C<sub>D</sub> approximation, 2<sub>nd</sub> iteration</h3>
                    <div className="mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
                        <div className='mb-4 mt-4'>
                            <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dm}}{${CD1}}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$V_t=${VtWithCd2}\\ ft/s$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dm}*${VtWithCd2}}{${inputData.formInputs.mu}}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$Re=${Re2}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{Re}+\\frac{3}{Re^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{${Re2}}+\\frac{3}{${Re2}^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = ${CD2}$$`}</Latex>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-left">C<sub>D</sub> approximation, 3<sub>rd</sub> iteration</h3>
                    <div className="mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
                        <div className='mb-4 mt-4'>
                            <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dm}}{${CD2}}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$V_t=${VtWithCd3}\\ ft/s$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dm}*${VtWithCd3}}{${inputData.formInputs.mu}}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$Re=${Re3}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{Re}+\\frac{3}{Re^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{${Re3}}+\\frac{3}{${Re3}^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = ${CD3}$$`}</Latex>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-left">C<sub>D</sub> approximation, 4<sub>th</sub> iteration</h3>
                    <div className="flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
                        <div className='mb-4 mt-4'>
                            <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dm}}{${CD3}}]^{1/2}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$V_t=${VtWithCd4}\\ ft/s$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dm}*${VtWithCd4}}{${inputData.formInputs.mu}}$$`}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{`$$Re=${Re4}$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{Re}+\\frac{3}{Re^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = \\frac{24}{${Re4}}+\\frac{3}{${Re4}^{1/2}}+0.34$$`}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{`$$C_D = ${CD4}$$`}</Latex>
                        </div>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 3. Gas capacity constraint calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                            <Latex>{latex2_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex2_2}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex2_3}</Latex>
                    </div>
                    <div>
                        <Latex>{latex2_4}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 4. Liquid capacity constraint calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                        <Latex>{latex3_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex3_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex3_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex3_4}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex3_5}</Latex>
                    </div>
                    <div>
                        <Latex>{latex3_6}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 5. Table sizing constraintion</h3>
            <table className="min-w-full bg-green-100 text-center border border-gray-300 rounded-lg overflow-hidden border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$t_r\\ (min)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$d\\ (in)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$h\\ (in)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$Lss\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$SR\\ (12Lss/d)$$`}</Latex></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ d, hValue, LssValue, SRValue }, index) => {
                        const isHighlighted = d > dmin && SRValue >= 3 && SRValue <= 4;

                        return (
                            <tr key={index} className={isHighlighted ? 'bg-orange-300' : ''}>
                                <td className="border border-gray-300 px-4 py-2">{inputData.formInputs.tr}</td>
                                <td className="border border-gray-300 px-4 py-2">{d}</td>
                                <td className="border border-gray-300 px-4 py-2">{hValue}</td>
                                <td className="border border-gray-300 px-4 py-2">{LssValue}</td>
                                <td className="border border-gray-300 px-4 py-2">{SRValue}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 6. P<sub>sat</sub> calculation</h3>
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
                        <Latex>{latex4_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex4_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex4_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex4_4}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex4_5}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex4_6}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex4_7}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex4_8}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex4_9}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex4_10}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex4_11}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex4_12}</Latex>
                    </div>
                    <div>
                        <Latex>{latex4_13}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 7. K<sub>i</sub> calculation</h3>
            <div className="mb-8 p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                <div className='mb-8'>
                        <Latex>{latex5_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex5_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_4}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex5_5}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_6}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex5_7}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_8}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex5_9}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_10}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex5_11}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex5_12}</Latex>
                    </div>
                    <div>
                        <Latex>{latex5_13}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 8. Gas, Oil calculation</h3>
            <div className="p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
                <div className="flex flex-col justify-center items-center">
                    <div className='mb-4'>
                        <Latex>{latex6_1}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex6_2}</Latex>
                    </div>
                    <div className='mb-8'>
                        <Latex>{latex6_3}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex6_4}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex6_5}</Latex>
                    </div>
                    <div>
                        <Latex>{latex6_6}</Latex>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TwoPhaseVerticalSolution;