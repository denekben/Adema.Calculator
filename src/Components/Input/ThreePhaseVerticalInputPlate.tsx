import { yupResolver } from "@hookform/resolvers/yup";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { DataForTwoPhaseCalculation, TwoPhaseInputs } from "./TwoPhaseVerticalInputPlate";

const validationThreePhase = Yup.object().shape({
    Qg: Yup.number().required("Дебит газа обязателен"),
    Qo: Yup.number().required("Дебит нефти обязателен"),
    Qw: Yup.number().required("Дебит воды обязателен"),
    Po: Yup.number().required("Рабочее давление обязательно").min(0).max(5000),
    To: Yup.number().required("Рабочая температура обязательна"),
    Sg: Yup.number().required("Удельный вес газа обязателен").oneOf([0.55,0.6,0.65,0.7,0.8,0.9]),
    Sgo: Yup.number().required("Удельный вес нефти обязателен"),
    Sgw: Yup.number().required("Удельный вес воды обязателен"),
    muo: Yup.number().required("Вязкость нефти обязательна"), // вязкость нефти
    muw: Yup.number().required("Вязкость воды обязательна"), // вязкость воды
    dropletLiquid: Yup.number().required("Удаление капель для жидкости обязательно"), // удаление капель для жидкости
    dropletWater: Yup.number().required("Удаление капель для воды обязательно"), // удаление капель для воды
    dropletOil: Yup.number().required("Удаление капель для нефти обязательно"), // удаление капель для нефти
    tro: Yup.number().required("Время удержания нефти обязательно"), // время удержания нефти
    trw: Yup.number().required("Время удержания воды обязательно"), // время удержания воды
    mu: Yup.number().required("Вязкость газа обязательна"), // вязкость газа
    C1: Yup.number().required(),
    C2: Yup.number().required(),
    C3: Yup.number().required(),
    H2S: Yup.number().required(),
    CO2: Yup.number().required(),
    Oil: Yup.number().required(),
    H2O: Yup.number().required(),
});

export type ThreePhaseVerticalInputs = {
    Qg: number
    Qo: number
    Qw: number
    Po: number
    To: number
    Sg: number
    Sgo: number
    Sgw: number
    muo: number
    muw: number
    dropletLiquid: number
    dropletWater: number
    dropletOil: number
    tro: number
    trw: number
    mu: number 
    C1: number
    C2: number
    C3: number
    H2S: number
    CO2: number
    Oil: number
    H2O: number
}

export type DataForThreePhaseVerticalCalculation = {
    selectedSeparator: string
    formInputs: ThreePhaseVerticalInputs
};

interface Props {
    onInputSubmit: (input: DataForThreePhaseVerticalCalculation) => void;
    selectedSeparator: string;
};

const ThreePhaseVerticalInputPlate:React.FC<Props> = ({onInputSubmit, selectedSeparator}) => {
    const {register, handleSubmit ,formState : {errors}}=useForm<ThreePhaseVerticalInputs>({resolver: yupResolver(validationThreePhase)});

    const handleInput = (form: ThreePhaseVerticalInputs) => {
        if(Object.keys(errors).length == 0) {
            onInputSubmit({formInputs: form, selectedSeparator: selectedSeparator});
        }
    };

    return (
        <form onSubmit={handleSubmit(handleInput)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                    <label className="block text-sm font-medium">Q<sub>g</sub> (gas flow rate, <span className="text-amber-800">MMscfd</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Qg")}/>
                    {errors.Qg ? <p className="text-red-500 text-xs">{errors.Qg.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">Q<sub>o</sub> (oil flow rate, <span className="text-amber-800">BOPD</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Qo")}/>
                    {errors.Qo ? <p className="text-red-500 text-xs">{errors.Qo.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">Q<sub>w</sub> (water flow rate, <span className="text-amber-800">BWPD</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Qw")}/>
                    {errors.Qw ? <p className="text-red-500 text-xs">{errors.Qw.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">P<sub>o</sub> (operating pressure, <span className="text-amber-800">psia</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Po")}/>
                    {errors.Po ? <p className="text-red-500 text-xs">{errors.Po.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">T<sub>o</sub> (operating temperature, <span className="text-amber-800">°R</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("To")}/>
                    {errors.To ? <p className="text-red-500 text-xs">{errors.To.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">S<sub>gg</sub> (gas specific gravity)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Sg")}/>
                    {errors.Sg ? <p className="text-red-500 text-xs">{errors.Sg.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">S<sub>go</sub> (oil specific gravity, <span className="text-amber-800">°API</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Sgo")}/>
                    {errors.Sgo ? <p className="text-red-500 text-xs">{errors.Sgo.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">S<sub>gw</sub> (water specific gravity)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Sgw")}/>
                    {errors.Sgw ? <p className="text-red-500 text-xs">{errors.Sgw.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">µ<sub>o</sub> (oil visconsity, <span className="text-amber-800">cp</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("muo")}/>
                    {errors.muo ? <p className="text-red-500 text-xs">{errors.muo.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">µ<sub>w</sub> (water visconsity, <span className="text-amber-800">cp</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("muw")}/>
                    {errors.muw ? <p className="text-red-500 text-xs">{errors.muw.message}</p> : ""}
                </div>
                {/* Удаление капель */}
                <div>
                    <label className="block text-sm font-medium">d<sub>ml</sub> (droplet removal for liquid, <span className="text-amber-800">micron</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("dropletLiquid")}/>
                    {errors.dropletLiquid ? <p className="text-red-500 text-xs">{errors.dropletLiquid.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">d<sub>mw</sub> (droplet removal for water, <span className="text-amber-800">micron</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("dropletWater")}/>
                    {errors.dropletWater ? <p className="text-red-500 text-xs">{errors.dropletWater.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">d<sub>mo</sub> (droplet removal for oil, <span className="text-amber-800">micron</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("dropletOil")}/>
                    {errors.dropletOil ? <p className="text-red-500 text-xs">{errors.dropletOil.message}</p> : ""}
                </div>

                {/* Время удержания */}
                <div>
                    <label className="block text-sm font-medium">t<sub>ro</sub> (oil retention time, <span className="text-amber-800">min</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("tro")}/>
                    {errors.tro ? <p className="text-red-500 text-xs">{errors.tro.message}</p> : ""}
                </div>

                <div>
                    <label className="block text-sm font-medium">t<sub>rw</sub> (water retention time, <span className="text-amber-800">min</span>)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("trw")}/>
                    {errors.trw ? <p className="text-red-500 text-xs">{errors.trw.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">µ<sub>g</sub> (gas viscosity, <span className="text-amber-800">cp</span>)</label>
                    <input type="number"  step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("mu")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
            </div>
            <hr className="mb-6 mt-6 h-0.5 rounded-xl bg-gray-300"/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                    <label className="block text-sm font-medium">C1 (methane)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("C1")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
                <div>
                    <label className="block text-sm font-medium">C2 (ethane)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("C2")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
                <div>
                    <label className="block text-sm font-medium">C3 (propane)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("C3")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
                <div>
                    <label className="block text-sm font-medium">H2S (hydrogen Sulfide)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("H2S")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
                <div>
                    <label className="block text-sm font-medium">CO2 (carbon dioxide)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("CO2")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
                <div>
                    <label className="block text-sm font-medium">Oil</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Oil")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
                <div>
                    <label className="block text-sm font-medium">H2O (water)</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("H2O")}/>
                    {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                </div> 
            </div>
            <button 
                type="submit"
                className={`flex justify-center w-full mt-4 p-2 bg-amber-200 text-black rounded-md ${Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-400'}`}
                >
                Calculate
            </button>           
        </form>
    );
};

export default ThreePhaseVerticalInputPlate;

function useState<T>(arg0: boolean): [any, any] {
    throw new Error("Function not implemented.");
}
