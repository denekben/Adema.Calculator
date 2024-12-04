import Latex from "react-latex";
import { DataForTwoPhaseCalculation } from "../Input/TwoPhaseVerticalInputPlate";
import { Calculation, ZFactorCalculator } from "../../Services/CalculationService";
import { useEffect, useState } from "react";
import image1 from './Z/0.55.png';
import image2 from './Z/0.6.png';
import image3 from './Z/0.65.png';
import image4 from './Z/0.7.png';
import image5 from './Z/0.8.png';
import image6 from './Z/0.9.png';

interface Props {
    inputData: DataForTwoPhaseCalculation;
    onHighlightChange: (highlightedRows: TwoPhaseTableRow) => void;
}

export interface TwoPhaseTableRow {
    d: number;      
    gasLeff: number;  
    liquidLeff: number; 
    Lss: number;  
    SR: number;   
}

const tableData = [10,16,18,20,24,30,36,42,48];

const TwoPhaseHorizontalSolution:React.FC<Props>  = ({inputData,onHighlightChange}) => {
    const [zFactor, setZFactor] = useState<number>(0);
    const SG = Calculation.SG(inputData.formInputs.Sgo) as number;
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

    const Ql = Calculation.Ql(inputData.formInputs.Qw, inputData.formInputs.Qo) as number;

    const dGasLeff = Calculation.dGasLeff(inputData.formInputs.To, zFactor, inputData.formInputs.Qg, 
        inputData.formInputs.Po, pg as number, pl as number, CD4 as number, inputData.formInputs.dm) as number;

    const d2LiquidLeff1 = Calculation.d2LiquidLeff1(inputData.formInputs.tr, Ql as number) as number;

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

    const latex2_1 = `$$d*L_{eff}=420*[\\frac{T*Z*Q_g}{P}]*[(\\frac{ρ_g}{ρ_l-ρ_g})*\\frac{C_D}{d_m}]^{1/2}$$`;
    const latex2_2 = `$$d*L_{eff}=420*[\\frac{${inputData.formInputs.To}*${zFactor}*${inputData.formInputs.Qg}}{${inputData.formInputs.Po}}]*[(\\frac{${pg}}{${pl}-${pg}})*\\frac{${CD4}}{${inputData.formInputs.dm}}]^{1/2}$$`;
    const latex2_3 = `$$d*L_{eff}=${dGasLeff}$$`;
    
    const latex3_1 = `$$Q_l=Q_w+Q_o$$`;
    const latex3_2 = `$$Q_l=${inputData.formInputs.Qw}+${inputData.formInputs.Qo}$$`;
    const latex3_3 = `$$Q_l=${Ql}$$`;
    const latex3_4 = `$$d^{2}*L_{eff}=\\frac{t_r*Q_l}{0.7}$$`;
    const latex3_5 = `$$d^{2}*L_{eff}=\\frac{${inputData.formInputs.tr}*${Ql}}{0.7}$$`;
    const latex3_6 = `$$d^{2}*L_{eff}=${d2LiquidLeff1}$$`;

    const rows = tableData.map(d => {
        const gasLeff = Calculation.GasLeff(dGasLeff as number, d) as number;
        const liquidLeff = Calculation.LiquidLeff(d2LiquidLeff1 as number, d) as number;
        const Lss = Calculation.LiquidLss(liquidLeff as number) as number;
        const SR = Calculation.SR(Lss, d) as number;

        return { d, gasLeff, liquidLeff, Lss, SR };
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

        const highlightedRows = rows.filter(({ SR }) => SR >= 3 && SR <= 4);
        onHighlightChange(highlightedRows[0]);
    }, [inputData]);

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
            <h3 className="text-xl font-semibold mb-4 text-center">Step 2. C<sub>D</sub> calculation</h3>
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
                    <div className='mb-8'>
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
                    <div className=" mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
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
                    <div className=" mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
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
                    <div className=" mb-8 flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
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
                    <div className=" flex flex-col justify-center items-center bg-green-200 rounded-lg shadow-md w-full">
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
            <div className="mb-8 p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
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

            <h3 className="text-xl font-semibold mb-4 text-center">Step 4. Liquid capacity constraint calculation</h3>
            <div className="mb-8 p-4 bg-green-100 rounded-lg shadow-md max-w-full mx-auto">
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
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$d\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$Gas Leff\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$Liquid Leff\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$Lss\\ (ft)$$`}</Latex></th>
                        <th className="border border-gray-300 px-4 py-2"><Latex>{`$$SR\\ (12Lss/d)$$`}</Latex></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ d, gasLeff, liquidLeff, Lss, SR }, index) => {
                        const isHighlighted = (SR as number  >=3 && SR as number <= 4);

                        return (
                            <tr key={index} className={isHighlighted ? 'bg-orange-300' : ''}>
                                <td className="border border-gray-300 px-4 py-2">{d}</td>
                                <td className="border border-gray-300 px-4 py-2">{gasLeff}</td>
                                <td className="border border-gray-300 px-4 py-2">{liquidLeff}</td>
                                <td className="border border-gray-300 px-4 py-2">{Lss}</td>
                                <td className="border border-gray-300 px-4 py-2">{SR}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
        </>
    );
}

export default TwoPhaseHorizontalSolution;