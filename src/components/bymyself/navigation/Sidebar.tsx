import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

import { FaGear } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaCircle } from "react-icons/fa";
import { TbReceiptFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { MdSupervisorAccount } from "react-icons/md";


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
    ];

    const hideNavbarRoute = hidePrefixes.some(prefix =>
        pathname.startsWith(prefix)
    );

    return (
        <div className={`${hideNavbarRoute ? "hidden" : ""} bg-black text-white ${collapsed ? "w-[100px]" : "w-[330px]"} py-3 h-full flex flex-col transition-width duration-300 ease-in-out overflow-hidden shadow-lg`}>
            {/* header */}
            <Link href={"/admin/dashboard"} className={`w-full flex flex-row justify-center items-center space-x-2 ${collapsed ? "mx-auto" : ""}`}>
                <Image src={"/icon.png"} alt="icon" width={54} height={44} className={`${collapsed ? 'mx-auto' : ''}`} />
                <h1 className={`text-xl font-light ${collapsed ? 'hidden' : ''}`}>
                    Adiwarna Pratama
                </h1>
            </Link>
            <hr className="mt-3.5 bg-[#AAAAAA]" />
            {/* sections bagian Operations */}
            <div className="flex flex-col mt-6 px-5">
                {/* operations */}
                <div className="flex flex-row items-center cursor-pointer" onClick={() => setShowingCollapsibleOperations(!showingCollapsibleOperations)}>
                    <FaGear className={`w-5 h-5 text-white ${collapsed ? 'mx-auto' : ''}`} />
                    <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4`}>Operations</h1>
                    <IoIosArrowDown className={`ml-auto w-5 h-5 ${showingCollapsibleOperations ? "rotate-180" : ""} ${collapsed ? 'hidden' : ''}`} />
                </div>
                {/* list route collapsible */}
                <div className={`${showingCollapsibleOperations ? "" : "hidden"} ${collapsed ? "hidden" : ""} flex flex-col space-y-2 transition mt-3 ml-10`}>
                    {/* quotations */}
                    <Link href={"/admin/quotations"} className="flex flex-row items-center h-10 space-x-3">
                        <Image src={"/icons/icon-quotation.svg"} className="" alt="icon quotations" width={23} height={23} />
                        <p className="text-base">Quotations</p>
                    </Link>
                    <Link href={"/admin/purchase-order"} className="flex flex-row items-center h-10 space-x-3 hover:grayscale-25">
                        <Image src={"/icons/icon-purchase-order.svg"} className="" alt="icon purchase" width={23} height={23} />
                        <p className="text-base">Purchase Order</p>
                    </Link>
                    <Link href={"/admin/work-assignment"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <Image src={"/icons/icon-work-assignment.svg"} className="" alt="icon work assignment" width={23} height={23} />
                        <p className="text-base">Work Assignment</p>
                    </Link>
                    <Link href={"/admin/document-transmittal"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <Image src={"/icons/icon-document-transmittal.svg"} className="" alt="icon work assignment" width={23} height={23} />
                        <p className="text-base">Document Transmittal</p>
                    </Link>
                    <Link href={"/admin/work-order"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <Image src={"/icons/icon-work-order.svg"} className="" alt="icon work order" width={23} height={23} />
                        <p className="text-base">Work Order</p>
                    </Link>
                    {/* daily activity report wont be used (for now) */}
                    {/* <Link href={"/admin/daily-activity-report"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <Image src={"/icons/icon-daily-activity.svg"} className="" alt="icon daily activity" width={23} height={23} />
                        <p className="text-base">Daily Activity Report</p>
                    </Link> */}
                    <Link href={"/admin/equipment-project"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <FaCircle className="w-[23px] h-[23px]" />
                        <p className="text-base">Equipment Project</p>
                    </Link>
                </div>
            </div>

            {/* sections bagian data */}
            <div className="flex flex-col mt-6 px-5">
                {/* operations */}
                <div className="flex flex-row items-center cursor-pointer" onClick={() => setShowingCollapsibleData(!showingCollapsibleData)}>
                    <Image src={"/icons/icon-data.svg"} className={`${collapsed ? 'mx-auto' : ''}`} alt="icon accounts" width={23} height={23} />
                    <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4`}>Data</h1>
                    <IoIosArrowDown className={`ml-auto w-5 h-5 ${showingCollapsibleData ? "rotate-180" : ""} ${collapsed ? 'hidden' : ''}`} />
                </div>
                {/* list route collapsible */}
                <div className={`${showingCollapsibleData ? "" : "hidden"} ${collapsed ? "hidden" : ""} flex flex-col space-y-2 transition mt-3 ml-10`}>
                    {/* quotations */}
                    <Link href={"/admin/customer"} className="flex flex-row items-center h-10 space-x-3">
                        <Image src={"/icons/icon-customer.svg"} className="" alt="icon quotations" width={23} height={23} />
                        <p className="text-base">Customer</p>
                    </Link>
                    <Link href={"/admin/employee"} className="flex flex-row items-center h-10 space-x-3 hover:grayscale-25">
                        <Image src={"/icons/icon-employee.svg"} className="" alt="icon purchase" width={23} height={23} />
                        <p className="text-base">Employee</p>
                    </Link>
                    <Link href={"/admin/track-record"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <FaCircle className="w-[23px] h-[23px]" />
                        <p className="text-base">Track Record</p>
                    </Link>
                    <Link href={"/admin/equipment-general"} className="flex flex-row items-center h-10 space-x-3 hover:contrast-90">
                        <FaCircle className="w-[23px] h-[23px]" />
                        <p className="text-base">equipment general</p>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col mt-6 px-5 space-y-5">
                <Link href={"/admin/payroll-managements"} className="flex flex-row items-center cursor-pointer">
                    <TbReceiptFilled className={`w-5 h-5 text-white ${collapsed ? 'mx-auto' : ''}`} />

                    <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4`}>Payroll Managements</h1>
                </Link>
                <Link href={"/admin/surat-jalan"} className="flex flex-row items-center cursor-pointer">
                    <MdSupervisorAccount className={`text-white w-[23px] h-[23px] ${collapsed ? 'mx-auto' : ''}`} />
                    <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4`}>Surat Jalan</h1>
                </Link>
                <Link href={"/admin/accounts"} className="flex flex-row items-center cursor-pointer">
                    <Image src={"/icons/icon-accounts.svg"} className={`${collapsed ? 'mx-auto' : ''}`} alt="icon accounts" width={23} height={23} />
                    {/* <FaGear className={`w-5 h-5 text-white ${collapsed ? 'mx-auto' : ''}`} /> */}
                    <h1 className={`${collapsed ? "hidden" : ""} text-base ml-4`}>Accounts</h1>
                </Link>
            </div>
        </div>
    )
}