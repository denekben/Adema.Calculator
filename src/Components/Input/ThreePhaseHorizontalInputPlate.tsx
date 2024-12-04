import { yupResolver } from "@hookform/resolvers/yup";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { DataForTwoPhaseCalculation, TwoPhaseInputs } from "./TwoPhaseVerticalInputPlate";

const validationThreePhase = Yup.object().shape({
    Qg: Yup.number().required("Дебит газа обязателен"),
    Qo: Yup.number().required("Дебит нефти обязателен"),
    Qw: Yup.number().required("Дебит воды обязателен"),
    Sgo: Yup.number().required("Удельный вес нефти обязателен"),
    Sgw: Yup.number().required("Удельный вес воды обязателен"),
    muo: Yup.number().required("Вязкость нефти обязательна"), // вязкость нефти
    muw: Yup.number().required("Вязкость воды обязательна"), // вязкость воды
    dropletLiquid: Yup.number().required("Удаление капель для жидкости обязательно"), // удаление капель для жидкости
    dropletWater: Yup.number().required("Удаление капель для воды обязательно"), // удаление капель для воды
    dropletOil: Yup.number().required("Удаление капель для нефти обязательно"), // удаление капель для нефти
    tro: Yup.number().required("Время удержания нефти обязательно"), // время удержания нефти
    trw: Yup.number().required("Время удержания воды обязательно"), // время удержания воды
    mu: Yup.number().required("Вязкость газа обязательна") // вязкость газа
});

export type ThreePhaseInputs = {
    Qg: number
    Qo: number
    Qw: number
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
}

export type DataForThreePhaseHorizontalCalculation = {
    selectedSeparator: string
    formInputs: ThreePhaseInputs
};

interface Props {
    onInputSubmit: (input: DataForThreePhaseHorizontalCalculation) => void;
    selectedSeparator: string;
};

const ThreePhaseHorizontalInputPlate:React.FC<Props> = ({onInputSubmit, selectedSeparator}) => {
    const {register, handleSubmit ,formState : {errors}}=useForm<ThreePhaseInputs>({resolver: yupResolver(validationThreePhase)});

    const handleInput = (form: ThreePhaseInputs) => {
        if(Object.keys(errors).length == 0) {
            onInputSubmit({formInputs: form, selectedSeparator: selectedSeparator});
        }
    };

    return (
        <form onSubmit={handleSubmit(handleInput)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                    <label className="block text-sm font-medium">Q<sub>g</sub> (gas flow rate) [MMscfd]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Qg")}/>
                    {errors.Qg ? <p className="text-red-500 text-xs">{errors.Qg.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">Q<sub>o</sub> (oil flow rate) [BOPD]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Qo")}/>
                    {errors.Qo ? <p className="text-red-500 text-xs">{errors.Qo.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">Q<sub>w</sub> (water flow rate) [BWPD]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("Qw")}/>
                    {errors.Qw ? <p className="text-red-500 text-xs">{errors.Qw.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">S<sub>go</sub> (oil specific gravity) [°API]</label>
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
                    <label className="block text-sm font-medium">µ<sub>o</sub> (oil visconsity) [cp]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("muo")}/>
                    {errors.muo ? <p className="text-red-500 text-xs">{errors.muo.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">µ<sub>w</sub> (water visconsity) [cp]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("muw")}/>
                    {errors.muw ? <p className="text-red-500 text-xs">{errors.muw.message}</p> : ""}
                </div>
                {/* Удаление капель */}
                <div>
                    <label className="block text-sm font-medium">d<sub>ml</sub> (droplet removal for liquid) [micron]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("dropletLiquid")}/>
                    {errors.dropletLiquid ? <p className="text-red-500 text-xs">{errors.dropletLiquid.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">d<sub>mw</sub> (droplet removal for water) [micron]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("dropletWater")}/>
                    {errors.dropletWater ? <p className="text-red-500 text-xs">{errors.dropletWater.message}</p> : ""}
                </div>
                <div>
                    <label className="block text-sm font-medium">d<sub>mo</sub> (droplet removal for oil) [micron]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("dropletOil")}/>
                    {errors.dropletOil ? <p className="text-red-500 text-xs">{errors.dropletOil.message}</p> : ""}
                </div>

                {/* Время удержания */}
                <div>
                    <label className="block text-sm font-medium">t<sub>ro</sub> (oil retention time) [min]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("tro")}/>
                    {errors.tro ? <p className="text-red-500 text-xs">{errors.tro.message}</p> : ""}
                </div>

                <div>
                    <label className="block text-sm font-medium">t<sub>rw</sub> (water retention time) [min]</label>
                    <input type="number" step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("trw")}/>
                    {errors.trw ? <p className="text-red-500 text-xs">{errors.trw.message}</p> : ""}
                </div>
                <>
                    {true ? (
                        <div>
                            <label className="block text-sm font-medium">µ<sub>g</sub> (gas viscosity) [cp]</label>
                            <input type="number"  step="0.001" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            {...register("mu")}/>
                            {errors.mu ? <p className="text-red-500 text-xs">{errors.mu.message}</p> : ""}
                        </div> 
                    ) : (
                        null
                    )}
                </>
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

export default ThreePhaseHorizontalInputPlate;

function useState<T>(arg0: boolean): [any, any] {
    throw new Error("Function not implemented.");
}
