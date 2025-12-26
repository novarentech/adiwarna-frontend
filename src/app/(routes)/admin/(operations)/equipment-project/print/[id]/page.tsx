"use client";

import { GetAllEquipmentItem, getEquipmentGeneralById } from "@/lib/equipment-general";
import { GetEquipmentProjectById, getEquipmentprojectById } from "@/lib/equipment-project";
import { use, useEffect, useState } from "react";
// Import API helper sesuai projectmu
// import { getEquipmentProjectById, getEquipmentGeneralById } from "@/lib/equipment";

export default function EquipmentProjectPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [projectData, setProjectData] = useState<GetEquipmentProjectById>();
    const [equipmentDetails, setEquipmentDetails] = useState<GetAllEquipmentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil data utama project
                const resProject = await getEquipmentprojectById(Number(id));
                const project = resProject.data;
                setProjectData(project);

                // 2. Ambil detail untuk setiap equipment secara paralel
                const details = await Promise.all(
                    project.equipments.map(async (eq: any) => {
                        try {
                            const resDetail = await getEquipmentGeneralById(eq.id);
                            return resDetail.data;
                        } catch (err) {
                            return { ...eq, description: eq.description + " (Detail Load Failed)" };
                        }
                    })
                );

                setEquipmentDetails(details);
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !projectData) return <div className="p-10 text-center">Loading Detailed Equipment List...</div>;

    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr === "-") return "-";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white print:min-h-0 font-sans">
            <style>
                {`
                @page { size: landscape; margin: 10mm; }
                ::-webkit-scrollbar {
                display: none;
                }
                @media print {
                    html, body { background: white !important; overflow: hidden !important; }
                    .no-print { display: none !important; }
                    .print-wrapper {
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        overflow: hidden !important;
                    }
                }
                .all-cell-borders table { border-collapse: collapse; width: 100%; }
                .all-cell-borders th, .all-cell-borders td {
                    border: 0.5px solid black !important;
                    padding: 4px 6px;
                }
                `}
            </style>

            {/* Modal Menu */}
            <div id="printModal" className="fixed top-5 right-5 w-72 z-50 no-print">
                <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                    <h5 className="font-bold mb-2 text-blue-600">Equipment Project print</h5>
                    <p className="mb-4 text-gray-500 text-xs">Back to the top first before printing!</p>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-gray-200 py-1.5 rounded">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold">Print</button>
                    </div>
                </div>
            </div>

            <div className="print-wrapper overflow-hidden no-scrollbar mx-auto bg-white shadow-lg w-[297mm] h-[210mm] p-[10mm] flex flex-col print:w-full print:p-0 relative">
                <div className="grow">
                    {/* Header */}
                    <header className="mb-4">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[10%] text-center py-2 border border-black" rowSpan={2}>
                                        <img src="/icon.png" alt="Logo" className="w-12 mx-auto" />
                                    </td>
                                    <td className="text-center w-[60%] border border-black" rowSpan={2}>
                                        <h1 className="text-lg font-bold">PT. ADIWARNA PRATAMA</h1>
                                        <h2 className="text-sm font-bold uppercase">List of Calibrated Equipment and Measuring Devices</h2>
                                    </td>
                                    <td className="w-[15%] text-[8pt] p-1 border border-black">Doc. No.</td>
                                    <td className="w-[15%] text-[8pt] p-1 border border-black font-bold">: FM-QSE-18-01</td>
                                </tr>
                                <tr>
                                    <td className="text-[8pt] p-1 border border-black">Revision No./Date</td>
                                    <td className="text-[8pt] p-1 font-bold border border-black">: 0/02-05-2017</td>
                                </tr>
                            </tbody>
                        </table>
                    </header>

                    {/* Meta Info */}
                    <div className="flex justify-between mb-4 text-[9pt] font-bold px-1 text-gray-700">
                        <span>Customer: <span className="ml-1">{projectData.customer}</span></span>
                        <span>Location: <span className="ml-1">{projectData.location}</span></span>
                        <span>Date: <span className="ml-1">{formatDate(projectData.project_date)}</span></span>
                    </div>

                    {/* Main Table */}
                    <div className="mb-8">
                        <table className="w-full text-[8.5pt]">
                            <thead className="bg-gray-100 font-bold text-center tracking-tighter">
                                <tr>
                                    <th className="w-8 border border-black p-1">No.</th>
                                    <th className="w-1/4 border border-black p-1">Description</th>
                                    <th className="border border-black p-1">Merk / Type</th>
                                    <th className="border border-black p-1">Serial Number</th>
                                    <th className="w-24 border border-black p-1">Duration</th>
                                    <th className="w-32 border border-black p-1">Calibration Date</th>
                                    <th className="w-32 border border-black p-1">Expiration Date</th>
                                    <th className="border border-black p-1">Calibrated By</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {equipmentDetails.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="border border-black p-1">{idx + 1}</td>
                                        <td className="text-left font-medium border border-black p-1">{item.description}</td>
                                        <td className="border border-black p-1">{item.merk_type}</td>
                                        <td className="border border-black p-1">{item.serial_number}</td>
                                        <td className="border border-black p-1">{item.duration || "-"}</td>
                                        <td className="border border-black p-1">{formatDate(item.calibration_date)}</td>
                                        <td className="border border-black p-1">{formatDate(item.expired_date)}</td>
                                        <td className="border border-black p-1 capitalize">{item.calibration_agency || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Signatures */}
                <div className="mb-[13%] grid grid-cols-3 gap-12 text-center text-[9pt] mt-10 px-4 avoid-break">
                    <div>
                        <p className="mb-[30%]">Prepared / Checked By:</p>
                        <div className="capitalize relative mb-2">{projectData.prepared_by || "_________________"}
                            <div className="absolute h-[1px] border-black border-b w-full"></div>
                        </div>
                        <div className="text-left mt-2 italic text-[8pt]">Date:</div>
                    </div>
                    <div>
                        <p className="mb-[30%]">Verified By:</p>
                        <div className="capitalize relative">{projectData.verified_by || "_________________"}
                            <div className="absolute h-[1px] border-black border-b w-full"></div>
                        </div>
                        <div className="text-left mt-2 italic text-[8pt]">Date:</div>
                    </div>
                    <div>
                        <p className="mb-[30%] italic">Acknowledged By {projectData.customer}</p>
                        <div className="capitalize relative text-transparent">.
                            <div className="absolute h-[1px] border-black border-b w-full"></div>
                        </div>
                        <div className="text-left mt-2 italic text-[8pt]">Date:</div>
                    </div>
                </div>


                <footer className="w-full pt-2 border-t-2 border-black text-center text-[7.5pt] leading-tight absolute bottom-[10%] right-0">
                    <strong>Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</strong><br />
                    <small>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428, Email: ptawp@cbn.net.id</small>
                </footer>
            </div>
        </div>
    );
}