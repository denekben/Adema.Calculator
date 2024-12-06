import Latex from "react-latex";
import { Calculation, ZFactorCalculator } from "../../Services/CalculationService";
import { DataForThreePhaseVerticalCalculation } from "../Input/ThreePhaseVerticalInputPlate";
import { useEffect, useState } from "react";
import image1 from './Z/0.55.png';
import image2 from './Z/0.6.png';
import image3 from './Z/0.65.png';
import image4 from './Z/0.7.png';
import image5 from './Z/0.8.png';
import image6 from './Z/0.9.png';

interface Props {
    inputData: DataForThreePhaseVerticalCalculation;
    onHighlightChange: (highlightedRows: ThreePhaseVerticalTableRow) => void;
}

export interface ThreePhaseVerticalTableRow {
    d: number;      
    hohw: number;  
    Lss: number;   
    SR: number;   
}

const tableData= [84,90,96,102, 108, 114, 120, 126, 132, 138, 144, 150, 156];

const abcTableData = {
    "C1": [8.976,1780.5,230],
    "C2": [8.785,1569.5,234.2],
    "C3": [8.726,1317.2,224],
    "H2S": [7.948,1470.6,211],
    "CO2": [7.92,1376,239],
    "H2O": [8.14,1810.94,244.15],
    "Oil": [8.5,1250,230]
};

const ThreePhaseVerticalSolution:React.FC<Props>  = ({inputData,onHighlightChange}) => {
    const [zFactor, setZFactor] = useState<number>(0);
    const SG = Calculation.SG(inputData.formInputs.Sgo) as number;
    const deltaSG = Calculation.deltaSG(inputData.formInputs.Sgw, SG as number) as number;

    const pl = Calculation.pl(SG as number) as number;
    const pg = Calculation.pg(inputData.formInputs.Sg, inputData.formInputs.Po, inputData.formInputs.To, zFactor as number) as number;
    const Vt0 = Calculation.Vt(pl as number, pg as number, inputData.formInputs.dropletLiquid) as number;

    const Re0 = Calculation.Re(pg as number, inputData.formInputs.dropletLiquid, Vt0 as number, inputData.formInputs.mu) as number;
    const CD0 = Calculation.Cd(Re0 as number) as number;

    const VtWithCd1 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dropletLiquid, CD0 as number) as number;
    const Re1 = Calculation.Re(pg as number, inputData.formInputs.dropletLiquid, VtWithCd1 as number, inputData.formInputs.mu) as number;
    const CD1 = Calculation.Cd(Re1 as number) as number;

    const VtWithCd2 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dropletLiquid, CD1 as number) as number;
    const Re2 = Calculation.Re(pg as number, inputData.formInputs.dropletLiquid, VtWithCd2 as number, inputData.formInputs.mu) as number;
    const CD2 = Calculation.Cd(Re2 as number) as number;

    const VtWithCd3 = Calculation.VtWithCd(pl as number, pg as number, inputData.formInputs.dropletLiquid, CD2 as number) as number;
    const Re3 = Calculation.Re(pg as number, inputData.formInputs.dropletLiquid, VtWithCd3 as number, inputData.formInputs.mu) as number;
    const CD3 = Calculation.Cd(Re3 as number) as number;

    const d21 = Calculation.d2(inputData.formInputs.To, zFactor, inputData.formInputs.Qg, inputData.formInputs.Po, pg as number, pl as number, CD3 as number, inputData.formInputs.dropletLiquid) as number;
    const dmin1 = (d21 as number)**0.5 as number;

    const d2w = Calculation.d2Water(inputData.formInputs.Qo, inputData.formInputs.muo, deltaSG as number, inputData.formInputs.dropletWater) as number;
    const dminw = (d2w as number)**0.5 as number;

    const d2o = Calculation.d2Water(inputData.formInputs.Qw, inputData.formInputs.muw, deltaSG as number, inputData.formInputs.dropletOil) as number;
    const dmino = (d2o as number)**0.5 as number;

    const dmin = Math.max(dmin1,dminw,dmino) as number;

    const hohwd2 = Calculation.hohw(inputData.formInputs.tro, inputData.formInputs.Qo, inputData.formInputs.trw, inputData.formInputs.Qw) as number;

    const C = Calculation.RtoC(inputData.formInputs.To) as number;

    const rows = tableData.map(d => {
        const hohw = Number(((hohwd2 as number) / d**2 as number).toFixed(6)) as number;
        const Lss = Calculation.LssWithHohw(hohw, d) as number;
        const SR = Calculation.SR(Lss, d) as number;

        return { d, hohw, Lss, SR };
    });

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

        const highlightedRows = rows.filter(({ d, SR }) => SR >= 1.5 && SR <= 3 && d >= dmin);
        onHighlightChange(highlightedRows[0]);
    }, [inputData]);

    const latex0_1 = `$$Z \\approx ${zFactor}$$`;

    const latex1_1 = `$$SG=\\frac{141.5}{131.5+API}$$`;
    const latex1_2 = `$$SG=\\frac{141.5}{131.5+${inputData.formInputs.Sgo}}$$`;
    const latex1_3 = `$$SG=${SG}$$`;

    const latex1_4 = `$$\\Delta SG=SG_w-SG$$`;
    const latex1_5 = `$$\\Delta SG=${inputData.formInputs.Sgw}-${SG}$$`;
    const latex1_6 = `$$\\Delta SG=${deltaSG}$$`;

    const latex1_7 = `$$ρ_l=62.4*SG$$`;
    const latex1_8 = `$$ρ_l=62.4*${SG}$$`;
    const latex1_9 = `$$ρ_l=${pl}\\ lb/ft^3$$`;

    const latex1_10 = `$$ρ_g=2.7*\\frac{SG*P_o}{T_o*Z}$$`;
    const latex1_11 = `$$ρ_g=2.7*\\frac{${inputData.formInputs.Sg}*${inputData.formInputs.Po}}{${inputData.formInputs.To}*${zFactor}}$$`;
    const latex1_12 = `$$ρ_g=${pg}\\ lb/ft^3$$`;

    const latex1_13 = `$$V_t=0.0204*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g}]^{1/2}$$`;
    const latex1_14 = `$$V_t=0.0204*[\\frac{(${pl}-${pg})*${inputData.formInputs.dropletLiquid}}{p_g}]^{1/2}$$`;
    const latex1_15 = `$$V_t=${Vt0}\\ ft/s$$`;

    const latex1_16 = `$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`;
    const latex1_17 = `$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dropletLiquid}*${Vt0}}{${inputData.formInputs.mu}}$$`;
    const latex1_18 = `$$Re=${Re0}$$`;

    const latex1_19 = `$$C_D = \\frac{24}{Re}+\\frac{3}{Re^{1/2}}+0.34$$`;
    const latex1_20 = `$$C_D = \\frac{24}{${Re0}}+\\frac{3}{${Re0}^{1/2}}+0.34$$`;
    const latex1_21 = `$$C_D = ${CD0}$$`;

    const latex1_22 = `$$d^{2}=5040*[\\frac{T*Z*Q_g}{P}]*[(\\frac{p_g}{p_l-p_g})*\\frac{C_D}{d_m}]^{1/2}$$`;
    const latex1_23 = `$$d^{2}=5040*[\\frac{${inputData.formInputs.To}*${zFactor}*${inputData.formInputs.Qg}}{${inputData.formInputs.Po}}]*[(\\frac{${pg}}{${pl}-${pg}})*\\frac{${CD3}}{${inputData.formInputs.dropletLiquid}}]^{1/2}$$`;
    const latex1_24 = `$$d^{2}=${d21}$$`;
    const latex1_25 = `$$d=${dmin1}\\ in$$`;

    const latex1_26 = `$$d^{2}=6690*[\\frac{Q_o*μ}{(\\Delta SG)*d_m^{2}}]$$`;
    const latex1_27 = `$$d^{2}=6690*[\\frac{${inputData.formInputs.Qo}*${inputData.formInputs.muo}}{${deltaSG}*${inputData.formInputs.dropletWater}^{2}}]$$`;
    const latex1_28 = `$$d^{2}=${d2w}$$`;
    const latex1_29 = `$$d=${dminw}\\ in$$`;

    const latex1_30 = `$$d^{2}=6690*[\\frac{Q_o*μ}{(\\Delta SG)*d_m^{2}}]$$`;
    const latex1_31 = `$$d^{2}=6690*[\\frac{${inputData.formInputs.Qw}*${inputData.formInputs.muw}}{${deltaSG}*${inputData.formInputs.dropletOil}^{2}}]$$`;
    const latex1_32 = `$$d^{2}=${d2o}$$`;
    const latex1_33 = `$$d=${dmino}\\ in$$`;

    const latex1_34 = `$$d_{min}=${dmin}\\ in$$`;

    const latex3_1 = `$$(h_o+h_w)*d^{2}=\\frac{(t_r)_o*(Q_o)+(t_r)_w*Q_w}{0.12}$$`;
    const latex3_2 = `$$(h_o+h_w)*d^{2}=\\frac{${inputData.formInputs.tro}*${inputData.formInputs.Qo}+${inputData.formInputs.trw}*${inputData.formInputs.Qw}}{0.12}$$`;
    const latex3_3 = `$$(h_o+h_w)*d^{2}=${hohwd2}$$`;

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
            <h3 className="text-xl font-semibold mb-4 text-center">Step 1. Z-factor approximation</h3>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md max-w-full mx-auto bg-green-100">
                <div className="flex flex-col justify-center items-center">
                    <img src = {selectedImage} className="shadow-md rounded-lg"/>
                    <div className='mt-4'>
                            <Latex>{latex0_1}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 2. &Delta;SG calculation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
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
            <h3 className="text-xl font-semibold mb-4 text-center">Step 3. d<sub>min</sub> caluclation</h3>
            <div className="mb-8 p-6 bg-green-100 rounded-lg shadow-md w-full mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">Liquid droplet removal</h3>
                <div className=" mb-8 p-6 flex flex-col justify-center items-center bg-green-200 bg-gray-50 rounded-lg shadow-md w-full">
                    <div className="flex flex-col justify-center items-center w-full">
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

                        <div className='mb-4'>
                            <Latex>{latex1_19}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{latex1_20}</Latex>
                        </div>
                        <div className='mb-8'>
                            <Latex>{latex1_21}</Latex>
                        </div>

                        <h3 className="text-xl font-semibold mb-4 text-left">C<sub>D</sub> approximation, 1<sub>st</sub> iteration</h3>
                        <div className=" mb-8 flex flex-col justify-center items-center bg-green-300 rounded-lg shadow-md w-full">
                            <div className='mb-4 mt-4'>
                                <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dropletLiquid}}{${CD0}}]^{1/2}$$`}</Latex>
                            </div>
                            <div className='mb-8'>
                                <Latex>{`$$V_t=${VtWithCd1}\\ ft/s$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dropletLiquid}*${VtWithCd1}}{${inputData.formInputs.mu}}$$`}</Latex>
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
                        <div className=" mb-8 flex flex-col justify-center items-center bg-green-300 rounded-lg shadow-md w-full">
                            <div className='mb-4 mt-4'>
                                <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dropletLiquid}}{${CD1}}]^{1/2}$$`}</Latex>
                            </div>
                            <div className='mb-8'>
                                <Latex>{`$$V_t=${VtWithCd2}\\ ft/s$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dropletLiquid}*${VtWithCd2}}{${inputData.formInputs.mu}}$$`}</Latex>
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
                        <div className="flex flex-col mb-8 justify-center items-center bg-green-300 rounded-lg shadow-md w-full">
                            <div className='mb-4 mt-4'>
                                <Latex>{`$$V_t=0.0119*[\\frac{(ρ_l-ρ_g)*d_m}{ρ_g * C_D}]^{1/2}$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$V_t=0.0119*[(\\frac{${pl}-${pg}}{${pg}})*\\frac{${inputData.formInputs.dropletLiquid}}{${CD2}}]^{1/2}$$`}</Latex>
                            </div>
                            <div className='mb-8'>
                                <Latex>{`$$V_t=${VtWithCd3}\\ ft/s$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$Re=0.0049*\\frac{ρ_g*d_m*V_t}{μ}$$`}</Latex>
                            </div>
                            <div className='mb-4'>
                                <Latex>{`$$Re=0.0049*\\frac{${pg}*${inputData.formInputs.dropletLiquid}*${VtWithCd3}}{${inputData.formInputs.mu}}$$`}</Latex>
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
                        <div className='mb-4'>
                            <Latex>{latex1_22}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{latex1_23}</Latex>
                        </div>
                        <div className='mb-4'>
                            <Latex>{latex1_24}</Latex>
                        </div>
                        <div>
                            <Latex>{latex1_25}</Latex>
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Water droplet removal</h3>
                <div className="p-6 mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
                    <div className='mb-4'>
                        <Latex>{latex1_26}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_27}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_28}</Latex>
                    </div>
                    <div>
                        <Latex>{latex1_29}</Latex>
                    </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Oil droplet removal</h3>
                <div className="p-6 mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
                    <div className='mb-4'>
                        <Latex>{latex1_30}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_31}</Latex>
                    </div>
                    <div className='mb-4'>
                        <Latex>{latex1_32}</Latex>
                    </div>
                    <div>
                        <Latex>{latex1_33}</Latex>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div>
                        <Latex>{latex1_34}</Latex>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Step 4. h<sub>o</sub>+h<sub>w</sub> calculation</h3>
            <div className="p-6 mb-8 flex flex-col justify-center items-center bg-green-100 rounded-lg shadow-md w-full">
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
            <h3 className="text-xl font-semibold mb-4 text-center">Step 5. Table sizing constraintion</h3>
            <table className="min-w-full mb-8 bg-green-100 text-center border border-gray-300 rounded-lg overflow-hidden border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$d\\ (in)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$h_o+h_w\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$Lss\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$SR\\ (12Lss/d)$$`}</Latex></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ d, hohw, Lss, SR }, index) => {
                        const isHighlighted = (SR as number  >=1.5 && SR as number <= 3 && d >= dmin);

                        return (
                            <tr key={index} className={isHighlighted ? 'bg-orange-300' : ''}>
                                <td className="border border-gray-300 px-4 py-2">{d}</td>
                                <td className="border border-gray-300 px-4 py-2">{hohw}</td>
                                <td className="border border-gray-300 px-4 py-2">{Lss}</td>
                                <td className="border border-gray-300 px-4 py-2">{SR}</td>
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
            <h3 className="text-xl font-semibold mb-4 text-center">Step 7. K<sub>i</sub> calculation</h3>
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
            <h3 className="text-xl font-semibold mb-4 text-center">Step 8. Gas, Water, Oil calculation</h3>
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

export default ThreePhaseVerticalSolution;