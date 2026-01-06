"use client";

import { FiPlus } from "react-icons/fi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import {
    getMaterialReceivinById,
    updateMaterialReceiving,
    ReceivingItemUpdateRequest,
    MaterialReceivingUpdateRequestBody,
    GetMaterialReceivingReportResponseById,
} from "@/lib/material-receiving"; // Sesuaikan path lib Anda
import { useRouter } from "next/navigation";
import { use, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function EditMaterialReceivingPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);

    const router = useRouter();
    const [selectedOrder, setSelectedOrder] = useState("")

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. State untuk data utama
    const [formData, setFormData] = useState({
        po_no: "",
        supplier: "",
        receiving_date: "",
        order_by: "offline" as "online" | "offline",
        received_by: "",
        acknowledge_by: "",
        status: "complete" as "partial" | "complete",
        notes: "",
        received_position: "",
        acknowledge_position: "",
    });

    // 2. State untuk list item material (menggunakan interface update)
    const [items, setItems] = useState<ReceivingItemUpdateRequest[]>([]);

    // 3. Fetch Data awal berdasarkan ID
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res: GetMaterialReceivingReportResponseById = await getMaterialReceivinById(id);
                if (res.success && res.data) {
                    const d = res.data;
                    setFormData({
                        po_no: d.po_no,
                        supplier: d.supplier || "",
                        receiving_date: d.receiving_date,
                        order_by: d.order_by,
                        received_by: d.received_by,
                        acknowledge_by: d.acknowledge_by,
                        status: d.status,
                        notes: d.notes || "",
                        received_position: d.received_position,
                        acknowledge_position: d.acknowledge_position,
                    });

                    // Map data items dari API ke state local
                    // Pastikan qty diconvert ke number jika API mengembalikan string
                    const mappedItems = d.items.map(item => ({
                        id: item.id,
                        description: item.description,
                        order_qty: Number(item.order_qty),
                        received_qty: Number(item.received_qty),
                        remarks: item.remarks || ""
                    }));
                    setItems(mappedItems);
                } else {
                    alert("Data not found");
                    router.push("/admin/material-receiving");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchInitialData();
    }, [id, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleItemChange = (index: number, field: keyof ReceivingItemUpdateRequest, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const displayDate = useMemo(() => {
        if (!formData.receiving_date) return { month: "", year: "" };
        const [year, month] = formData.receiving_date.split("-");
        return { month, year };
    }, [formData.receiving_date]);

    const toRoman = (num: number): string => {
        const romanNumerals = [
            "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"
        ];
        return romanNumerals[num - 1];
    };

    const addItem = () => {
        setItems([...items, { description: "", order_qty: 0, received_qty: 0, remarks: "" }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: MaterialReceivingUpdateRequestBody = {
            ...formData,
            items: items
        };

        const res = await updateMaterialReceiving(id, payload);

        if (res.success) {
            toast.success("Material Receiving updated successfully!");
            router.push("/admin/material-receiving");
        } else {
            toast.error("Update failed: " + res.message);
        }
        setLoading(false);
    };

    if (fetching) return <div className="p-16 text-center">Loading Data...</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            <h1 className="text-4xl mt-8">Edit Material Receiving : {id}</h1>
            {/* form container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-xl">PT. ADIWARNA PRATAMA</p>
                        <div className="flex flex-col text-[#4A5565]">
                            <p>Material Receiving Record</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm text-[#4A5565]">Doc. No:</p>
                        <p className="text-sm">FM-PC1-06</p>

                        <p className="text-sm text-[#4A5565] mt-2">Rev. No:</p>
                        <p className="text-sm">01/02.01.2018</p>

                    </div>
                </div>


                <hr className="border-b border-[#e6e6e6] my-6" />

                <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
                    <div className="w-full grid grid-cols-3 gap-x-8">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="po_no" className="text-sm">P.O. / INV. / PR No.</label>
                            <div className="w-full flex flex-row items-center">
                                {/* po_no */}
                                <input id="po_no" required value={formData.po_no} onChange={handleInputChange} type="text" className="w-2/6 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="e.g., 037" />
                                <p className="w-2/6 text-center mx-2">/MR/AWP - </p>
                                {/* Input Bulan - Mengambil dari displayDate.month */}
                                <input
                                    id="display_month"
                                    value={toRoman(Number(displayDate.month))}
                                    type="text"
                                    className="w-1/6 h-10 text-center border px-2 rounded-sm border-[#D1D5DC] bg-[#e9ecef]"
                                    readOnly
                                    disabled
                                />

                                <p className="w-1/6 text-center mx-1">/</p>

                                {/* Input Tahun - Mengambil dari displayDate.year */}
                                <input
                                    id="display_year"
                                    value={displayDate.year}
                                    type="text"
                                    className="w-2/6 h-10 border text-center px-2 rounded-sm border-[#D1D5DC] bg-[#e9ecef]"
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="supplier" className="text-sm">Supplier</label>
                            <input id="supplier" value={formData.supplier} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Supplier name" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="receiving_date" className="text-sm">Receiving Date</label>
                            <input id="receiving_date" required value={formData.receiving_date} onChange={handleInputChange} type="date" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="">Order By</label>
                        <div className="flex flex-row space-x-4 mt-4">
                            <p onClick={() => setFormData(p => ({ ...p, order_by: "offline" }))} className={`${formData.order_by === "offline" ? "outline" : ""} px-4 py-2 rounded-md cursor-pointer hover:contrast-50`}>Offline</p>
                            <p onClick={() => setFormData(p => ({ ...p, order_by: "online" }))} className={`${formData.order_by === "online" ? "outline" : ""} px-4 py-2 rounded-md cursor-pointer hover:contrast-50`}>Online</p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3 mt-4">
                        <label htmlFor="status">Status</label>
                        <select id="status" value={formData.status} onChange={handleInputChange} className="w-1/4 h-10 border px-3 rounded-sm border-[#D1D5DC] mt-2">
                            <option value="complete">Complete</option>
                            <option value="partial">Partial</option>
                        </select>
                    </div>


                    {/* material item list (nanti bisa add item) */}
                    <div className="flex flex-col mt-6">
                        <div className="w-full flex flex-row justify-between">
                            <h1>Material Items</h1>
                            {/* button nambah item */}
                            <div onClick={addItem} className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                                <FiPlus className="w-5 h-5 mr-1" /> Add Item
                            </div>
                        </div>
                        {/* list input mengisi item */}
                        <div className="mt-4 border overflow-hidden rounded-xl">
                            <Table>
                                <TableHeader className="bg-[#F9FAFB]">
                                    <TableRow>
                                        <TableHead className="w-1/12 pl-10 py-4">No</TableHead>
                                        <TableHead className="w-2/6 font-bold">Description</TableHead>
                                        <TableHead className="w-1/12 font-bold text-center">Qty <br /> <span className="text-sm text-[#4A5565]">Ordered</span></TableHead>
                                        <TableHead className="w-1/12 font-bold text-center">Qty <br /> <span className="text-sm text-[#4A5565]">Received</span></TableHead>
                                        <TableHead className="w-2/6 font-bold">Remarks <br /> <span className="text-sm text-[#4A5565]">(Good Condition / Reject)</span></TableHead>
                                        <TableHead className="font-bold text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="py-6 pl-10">{index + 1}</TableCell>
                                            <TableCell className=""><input required value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} type="text" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Item description" /></TableCell>
                                            <TableCell className="text-center"><input type="number" required value={item.order_qty} onChange={(e) => handleItemChange(index, "order_qty", parseInt(e.target.value) || 0)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="0" /></TableCell>
                                            <TableCell className="text-center"><input type="number" required value={item.received_qty} onChange={(e) => handleItemChange(index, "received_qty", parseInt(e.target.value) || 0)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="0" /></TableCell>
                                            {/* <TableCell className="space-x-2"><input type="text" value={item.remarks} onChange={(e) => handleItemChange(index, "remarks", e.target.value)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell> */}
                                            <TableCell className="space-x-2">
                                                {/* <input type="text" value={item.remarks} onChange={(e) => handleItemChange(index, "remarks", e.target.value)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /> */}
                                                <select name="order_by" id="order_by" value={item.remarks} onChange={(e) => handleItemChange(index, "remarks", e.target.value)} className="w-10/12 h-10 border px-3 rounded-sm border-[#D1D5DC]">
                                                    <option value="" className="font-light" hidden>--- Choose remark option ---</option>
                                                    <option value="good">Good Condition</option>
                                                    <option value="reject">Reject</option>
                                                </select>
                                            </TableCell>
                                            <TableCell className="text-center"><div onClick={() => removeItem(index)} className="cursor-pointer hover:contrast-75"><RiDeleteBinLine className="w-6 h-6 text-[#E7000B]" /></div></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                        <textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full border p-3 rounded-sm min-h-[100px]" placeholder="Add extra notes here..." />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="received_by" className="text-sm">Received By</label>
                            <input id="received_by" type="text" required value={formData.received_by} onChange={handleInputChange} className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name/Position" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="acknowledge_by" className="text-sm">Acknowledge by</label>
                            <input id="acknowledge_by" type="text" required value={formData.acknowledge_by} onChange={handleInputChange} className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name/Position" />
                        </div>
                        {/* receivedbyposition */}
                        <div className="flex flex-col space-y-4">
                            <input id="received_position" required value={formData.received_position} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="position" />
                        </div>
                        {/* acknowledgebyposition */}
                        <div className="flex flex-col space-y-4">
                            <input id="acknowledge_position" required value={formData.acknowledge_position} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="position" />
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-row ml-auto gap-x-4">
                        <Link href={"/admin/material-receiving"} className=" border text-black px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Cancel
                        </Link>
                        <button type="submit" disabled={loading} className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            {loading ? "Saving..." : "Save Receiving Record"}
                        </button>
                    </div>
                </form>
            </div>
            {/* form container */}
        </div>
    )
}