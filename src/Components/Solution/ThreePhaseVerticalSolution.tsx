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

    const rows = tableData.map(d => {
        const hohw = (hohwd2 as number) / d**2 as number;
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
        const highlightedRows = rows.filter(({ d, SR }) => SR >= 1.5 && SR <= 3 && d >= dmin);
        onHighlightChange(highlightedRows[0]);
        const loadData = async () => {
            await ZFactorCalculator.loadSPGRData('./spgrs.json'); 
            setZFactor(ZFactorCalculator.calculateZFactor(inputData.formInputs.To - 459.67, inputData.formInputs.Sg, inputData.formInputs.Po) as number);
            console.log(zFactor);
        };

        loadData();
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
            <table className="min-w-full bg-green-100 text-center border border-gray-300 rounded-lg overflow-hidden border-collapse">
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
        </>
    );
}

export default ThreePhaseVerticalSolution;