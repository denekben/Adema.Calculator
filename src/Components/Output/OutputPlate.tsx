import Latex from "react-latex";
import { ThreePhaseHorizontalTableRow } from "../Solution/ThreePhaseHorizontalSolution";
import { ThreePhaseVerticalTableRow } from "../Solution/ThreePhaseVerticalSolution";
import { TwoPhaseTableRow } from "../Solution/TwoPhaseHorizontalSolution";

interface Props{
    highlightedRows: any;
    selectedSeparator: string | null;
}

const OutputPlate: React.FC<Props> = ({highlightedRows, selectedSeparator}) => {
    return (
        <div className="mb-4 p-6 bg-green-50 border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto overflow-auto max-h-[200px]">
            <h2 className="text-2xl font-semibold mb-4 flex justify-center">Output</h2>
            {highlightedRows ? (
                <>
                    <>
                    {selectedSeparator == "Two-phase vertical separator" &&
                        <>
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
                                    <tr className="bg-orange-300">
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.tr}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.d}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.hValue}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.LssValue}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.SRValue}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>}
                    </>
                    <>
                    {selectedSeparator == "Two-phase horizontal separator" &&
                        <>
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
                                    <tr className="bg-orange-300">
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.d}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.gasLeff}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.liquidLeff}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.Lss}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.SR}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>}
                    </>
                    <>
                    {selectedSeparator == "Three-phase vertical separator" &&
                        <>
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
                                    <tr className="bg-orange-300">
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.d}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.hohw}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.Lss}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.SR}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>}
                    </>
                    <>
                    {selectedSeparator == "Three-phase horizontal separator" &&
                        <>
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
                                    <tr className="bg-orange-300">
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.d}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.LeffL}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.LssL}</td>
                                        <td className="border border-gray-300 px-4 py-2">{highlightedRows.SR}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>}
                    </>
                </>
            ) : (
                <p className="text-center text-red-500">No valid answers.</p>
            )}
        </div>
    );
}

export default OutputPlate;