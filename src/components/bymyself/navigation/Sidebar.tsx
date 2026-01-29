import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

import { FaGear } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaToolbox, FaWrench } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { MdViewTimeline } from "react-icons/md";



export default function CoolSidebar({ collapsed, onCollapseChange }: { collapsed: boolean; onCollapseChange: () => void }) {

    const [showingCollapsibleOperations, setShowingCollapsibleOperations] = useState(false)
    const [showingCollapsibleData, setShowingCollapsibleData] = useState(false)

    const pathname = usePathname();
    const hidePrefixes = [
        "/admin/quotations/print/",
        "/admin/purchase-order/print/",
        "/admin/work-assignment/print/",
        "/admin/document-transmittal/print/",
        "/admin/equipment-project/print/",
        "/admin/surat-jalan/print/",
        "/admin/material-receiving/print/",
        "/admin/purchase-requisition/print/",
    ];

    const hideNavbarRoute = hidePrefixes.some(prefix =>
        pathname.startsWith(prefix)
    );

    return (
        <>
            {/* Mobile Overlay backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${!collapsed ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                onClick={onCollapseChange}
            />

            <div className={`${hideNavbarRoute ? "hidden" : ""} bg-black text-white ${collapsed ? "w-0 p-0 md:w-[100px]" : "w-[280px] md:w-[330px]"} py-3 h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-lg fixed left-0 top-0 bottom-0 md:relative z-50`}>
                {/* header */}
                <Link href={"/admin/dashboard"} className={`w-full flex flex-row justify-center items-center space-x-2 ${collapsed ? "mx-auto" : ""}`}>
                    <Image src={"/icon.png"} alt="icon" width={54} height={44} className={`${collapsed ? 'mx-auto' : ''}`} />
                    <h1 className={`text-xl font-light ${collapsed ? 'hidden px-0' : ''} whitespace-nowrap`}>
                        Adiwarna Pratama
                    </h1>
                </Link>
                <hr className="mt-3.5 bg-[#AAAAAA]" />
                {/* sections bagian Operations */}
                <div className="flex flex-col mt-6 px-5 overflow-y-auto custom-scrollbar flex-1">
                    {/* operations */}
                    <div className="flex flex-row items-center cursor-pointer" onClick={() => setShowingCollapsibleOperations(!showingCollapsibleOperations)}>
                        <FaGear className={`w-5 h-5 text-white ${collapsed ? 'mx-auto' : ''} min-w-[20px]`} />
                        <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4 whitespace-nowrap`}>Operations</h1>
                        <IoIosArrowDown className={`ml-auto w-5 h-5 ${showingCollapsibleOperations ? "" : "rotate-90"} ${collapsed ? 'hidden' : ''}`} />
                    </div>
                    {/* list route collapsible */}
                    <div className={`${showingCollapsibleOperations ? "" : "hidden"} flex flex-col space-y-2 transition mt-3 ${collapsed ? "items-center" : "ml-10"}`}>
                        {/* quotations */}
                        <Link href={"/admin/quotations"} className={`flex flex-row items-center h-10 space-x-3 ${collapsed ? "justify-center" : ""}`}>
                            <Image src={"/icons/icon-quotation.svg"} className="" alt="icon quotations" width={23} height={23} />
                            <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Quotations</p>
                        </Link>
                        <Link href={"/admin/purchase-order"} className={`flex flex-row items-center h-10 space-x-3 hover:grayscale-25 ${collapsed ? "justify-center" : ""}`}>
                            <Image src={"/icons/icon-purchase-order.svg"} className="" alt="icon purchase" width={23} height={23} />
                            <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Purchase Order</p>
                        </Link>
                        <Link href={"/admin/work-assignment"} className={`flex flex-row items-center h-10 space-x-3 hover:contrast-90 ${collapsed ? "justify-center" : ""}`}>
                            <Image src={"/icons/icon-work-assignment.svg"} className="" alt="icon work assignment" width={23} height={23} />
                            <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Work Assignment</p>
                        </Link>
                        <Link href={"/admin/document-transmittal"} className={`flex flex-row items-center h-10 space-x-3 hover:contrast-90 ${collapsed ? "justify-center" : ""}`}>
                            <Image src={"/icons/icon-document-transmittal.svg"} className="" alt="icon work assignment" width={23} height={23} />
                            <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Document Transmittal</p>
                        </Link>
                        <Link href={"/admin/work-order"} className={`flex flex-row items-center h-10 space-x-3 hover:contrast-90 ${collapsed ? "justify-center" : ""}`}>
                            <Image src={"/icons/icon-work-order.svg"} className="" alt="icon work order" width={23} height={23} />
                            <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Work Order</p>
                        </Link>
                        {/* daily activity report wont be used (for now) */}
                        {/* <Link href={"/admin/daily-activity-report"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <Image src={"/icons/icon-daily-activity.svg"} className="" alt="icon daily activity" width={23} height={23} />
                        <p className="text-base">Daily Activity Report</p>
                    </Link> */}
                        <Link href={"/admin/equipment-project"} className={`flex flex-row items-center h-10 space-x-3 hover:contrast-90 ${collapsed ? "justify-center" : ""}`}>
                            {/* <FaCircle className="w-[23px] h-[23px]" /> */}
                            <FaWrench className="w-[23px] h-[23px]" />

                            <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Equipment Project</p>
                        </Link>
                        <Link href={"/admin/surat-jalan"} className={`h-10 flex flex-row items-center cursor-pointer ${collapsed ? "justify-center" : ""}`}>
                            {/* <SlEnvolopeLetter className={`text-white w-[23px] h-[23px] ${collapsed ? 'mx-auto' : ''}`} /> */}
                            <Image src={"/icons/icon-surat-jalan.svg"} className="" alt="icon work order" width={23} height={23} />
                            <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4 whitespace-nowrap`}>Surat Jalan</h1>
                        </Link>
                        <Link href={"/admin/purchase-requisition"} className={`h-10 flex flex-row items-center cursor-pointer ${collapsed ? "justify-center" : ""}`}>
                            {/* <BiSolidPurchaseTag className={`text-white w-[23px] h-[23px] ${collapsed ? 'mx-auto' : ''}`} /> */}
                            <Image src={"/icons/icon-pr.svg"} className="" alt="icon work order" width={23} height={23} />
                            <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4 whitespace-nowrap`}>Purchase Requisition</h1>
                        </Link>
                        <Link href={"/admin/material-receiving"} className={`h-10 flex flex-row items-center cursor-pointer ${collapsed ? "justify-center" : ""}`}>
                            {/* <RiFolderReceivedFill className={`text-white w-[23px] h-[23px] ${collapsed ? 'mx-auto' : ''}`} /> */}
                            <Image src={"/icons/icon-mr.svg"} className="" alt="icon work order" width={23} height={23} />
                            <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4 whitespace-nowrap`}>Material Receiving</h1>
                        </Link>
                    </div>

                    <div className={`${collapsed ? 'mt-4' : 'mt-6'}`}>
                        {/* operations */}
                        <div className="flex flex-row items-center cursor-pointer" onClick={() => setShowingCollapsibleData(!showingCollapsibleData)}>
                            <Image src={"/icons/icon-data.svg"} className={`${collapsed ? 'mx-auto' : ''}`} alt="icon accounts" width={23} height={23} />
                            <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4 whitespace-nowrap`}>Data</h1>
                            <IoIosArrowDown className={`ml-auto w-5 h-5 ${showingCollapsibleData ? "" : "rotate-90"} ${collapsed ? 'hidden' : ''}`} />
                        </div>
                        {/* list route collapsible */}
                        <div className={`${showingCollapsibleData ? "" : "hidden"} flex flex-col space-y-2 transition mt-3 ${collapsed ? "items-center" : "ml-10"}`}>
                            {/* quotations */}
                            <Link href={"/admin/customer"} className={`flex flex-row items-center h-10 space-x-3 ${collapsed ? "justify-center" : ""}`}>
                                <Image src={"/icons/icon-customer.svg"} className="" alt="icon quotations" width={23} height={23} />
                                <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Customer</p>
                            </Link>
                            <Link href={"/admin/employee"} className={`flex flex-row items-center h-10 space-x-3 hover:grayscale-25 ${collapsed ? "justify-center" : ""}`}>
                                <Image src={"/icons/icon-employee.svg"} className="" alt="icon purchase" width={23} height={23} />
                                <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Employee</p>
                            </Link>
                            <Link href={"/admin/track-record"} className={`flex flex-row items-center h-10 space-x-3 hover:contrast-90 ${collapsed ? "justify-center" : ""}`}>
                                {/* <FaCircle className="w-[23px] h-[23px]" /> */}
                                <MdViewTimeline className="w-[23px] h-[23px]" />
                                <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Track Record</p>
                            </Link>
                            <Link href={"/admin/equipment-general"} className={`flex flex-row items-center h-10 space-x-3 hover:contrast-90 ${collapsed ? "justify-center" : ""}`}>
                                {/* <FaCircle className="w-[23px] h-[23px]" /> */}
                                <FaToolbox className="w-[23px] h-[23px]" />

                                <p className={`text-base whitespace-nowrap ${collapsed ? "hidden" : ""}`}>Equipment General</p>
                            </Link>
                        </div>
                    </div>


                    <div className={`${collapsed ? 'mt-4' : 'mt-6'}`}>
                        <Link href={"/admin/accounts"} className="flex flex-row items-center cursor-pointer">
                            <Image src={"/icons/icon-accounts.svg"} className={`${collapsed ? 'mx-auto' : ''}`} alt="icon accounts" width={23} height={23} />
                            {/* <FaGear className={`w-5 h-5 text-white ${collapsed ? 'mx-auto' : ''}`} /> */}
                            <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4 whitespace-nowrap`}>Accounts</h1>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}