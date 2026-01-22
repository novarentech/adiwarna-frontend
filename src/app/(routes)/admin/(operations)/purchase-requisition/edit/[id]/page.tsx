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
import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPurchaseRequisitionById, PurchaseRequisitionGetByIdResponse, PurchaseRequisitionItemUpdate, PurchaseRequisitionUpdateRequest, updatePurchaseRequisition } from "@/lib/purchase-requisitions";
import { toast } from "sonner";

export default function EditPurchaseRequisitionPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. State Header & Metadata
    const [formData, setFormData] = useState({
        pr_no: "",
        date: "",
        po_no_cash: "",
        supplier: "",
        routing: "offline" as "online" | "offline",
        vat_percentage: 10,
        requested_by: "",
        requested_position: "",
        approved_by: "",
        approved_position: "",
        authorized_by: "",
        status: "draft" as "draft" | "pending" | "approved" | "rejected",
        notes: ""
    });

    // 2. State Items
    const [items, setItems] = useState<PurchaseRequisitionItemUpdate[]>([]);

    // 3. Fetch Initial Data
    useEffect(() => {
        const fetchPR = async () => {
            try {
                const res: PurchaseRequisitionGetByIdResponse = await getPurchaseRequisitionById(id);
                if (res.success && res.data) {
                    const d = res.data;
                    setFormData({
                        pr_no: d.pr_no,
                        date: d.date,
                        po_no_cash: d.po_no_cash,
                        supplier: d.supplier,
                        routing: d.routing,
                        vat_percentage: Number(d.vat_percentage),
                        requested_by: d.requested_by,
                        requested_position: d.requested_position,
                        approved_by: d.approved_by,
                        approved_position: d.approved_position,
                        authorized_by: d.authorized_by,
                        status: d.status,
                        notes: d.notes || ""
                    });

                    // Map items string to number
                    const mappedItems = d.items.map(item => ({
                        id: item.id,
                        qty: Number(item.qty),
                        unit: item.unit,
                        description: item.description,
                        unit_price: Number(item.unit_price)
                    }));
                    setItems(mappedItems);
                } else {
                    alert("Data PR tidak ditemukan");
                    router.push("/admin/purchase-requisition");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchPR();
    }, [id, router]);

    // 4. Perhitungan Otomatis
    const totals = useMemo(() => {
        const subTotal = items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0);
        const vatAmount = (subTotal * formData.vat_percentage) / 100;
        const grandTotal = subTotal + vatAmount;
        return { subTotal, vatAmount, grandTotal };
    }, [items, formData.vat_percentage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: id === "vat_percentage" ? Number(value) : value }));
    };

    const handleItemChange = (index: number, field: keyof PurchaseRequisitionItemUpdate, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const displayDate = useMemo(() => {
        if (!formData.date) return { month: "", year: "" };
        const [year, month] = formData.date.split("-");
        return { month, year };
    }, [formData.date]);

    const toRoman = (num: number): string => {
        const romanNumerals = [
            "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"
        ];
        return romanNumerals[num - 1];
    };

    const addItem = () => {
        setItems([...items, { qty: 0, unit: "", description: "", unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: PurchaseRequisitionUpdateRequest = {
            ...formData,
            items: items
        };

        const res = await updatePurchaseRequisition(id, payload);

        if (res.success) {
            toast.success("Purchase Requisition updated successfully!");
            router.push("/admin/purchase-requisition");
        } else {
            toast.error("Update failed: " + res.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (formData.routing === "online") {
            setFormData((prev) => ({
                ...prev,
                supplier: "online", // or any other default supplier name for online routing
            }));
        } else if (formData.routing === "offline") {
            setFormData((prev) => ({
                ...prev,
                supplier: "offline", // or any other default supplier name for offline routing
            }));
        }
    }, [formData.routing]);

    if (fetching) return <div className="p-16 text-center">Loading PR Data...</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            <h1 className="text-4xl mt-8">Edit Purchase Requisition : {id}</h1>
            {/* form container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-xl">PT. ADIWARNA PRATAMA</p>
                        <div className="flex flex-col text-[#4A5565]">
                            <p>PURCHASE REQUISITION</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm text-[#4A5565]">Doc. No:</p>
                        <p className="text-sm">M-PU-1-04</p>

                    </div>
                </div>


                <hr className="border-b border-[#e6e6e6] my-6" />

                <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
                    <div className="w-full grid grid-cols-2 gap-x-8">
                        {/* left side */}
                        <div className="space-y-4">
                            <div className="flex-1 flex flex-col space-y-4">
                                <label htmlFor="pr_no" className="text-sm font-bold">P.R. No.</label>
                                <div className="w-full flex flex-row items-center">
                                    <input id="pr_no" type="text" required value={formData.pr_no} onChange={handleInputChange} className="w-2/6 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="e.g 037" />
                                    <p className="w-2/6 text-center mx-2">/PR/AWP - </p>
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
                                <label htmlFor="required_delivery" className="text-sm font-bold">Required Delivery</label>
                                <input id="required_delivery" type="text" required value={"AWP"} onChange={handleInputChange} className="w-full h-10 border px-2 rounded-sm bg-[#e9ecef] border-[#D1D5DC]" disabled />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="place_of_delivery" className="text-sm font-bold">Place of Delivery</label>
                                <input id="place_of_delivery" type="text" required value={"AWP HO"} onChange={handleInputChange} className="w-full h-10 border px-2 rounded-sm bg-[#e9ecef] border-[#D1D5DC]" disabled />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="date" className="text-sm font-bold">Date</label>
                                <input id="date" required value={formData.date} onChange={handleInputChange} type="date" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                        </div>
                        {/* right side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="po_no_cash" className="text-sm font-bold">P.O. No. / Cash</label>
                                <input id="po_no_cash" type="text" value={formData.po_no_cash} onChange={handleInputChange} className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Fill in -> Null" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="supplier" className="text-sm font-bold">Supplier</label>
                                <input id="supplier" required value={formData.supplier} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="online" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="routing" className="text-sm font-bold">Routing / Offline</label>
                                <select id="routing" value={formData.routing} onChange={handleInputChange} className="h-10 border px-3 rounded-sm border-[#D1D5DC]">
                                    <option value="offline">Offline</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="status" className="text-sm font-bold">Status</label>
                                <select id="status" value={formData.status} onChange={handleInputChange} className="h-10 border px-3 rounded-sm border-[#D1D5DC]">
                                    {/* "draft" | "pending" | "approved" | "rejected" */}
                                    <option value="draft">draft</option>
                                    <option value="pending">pending</option>
                                    <option value="approved">approved</option>
                                    <option value="rejected">rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* item list (nanti bisa add item) */}
                    <div className="flex flex-col mt-6">
                        <div className="w-full flex flex-row justify-between">
                            <h1>Items Details</h1>
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
                                        <TableHead className="w-1/12 pl-10">No</TableHead>
                                        <TableHead className="w-1/12 font-bold">Qty</TableHead>
                                        <TableHead className="w-1/12 font-bold">Unit</TableHead>
                                        <TableHead className="w-2/6 font-bold">Description</TableHead>
                                        <TableHead className="w-1/6 font-bold">Unit Price</TableHead>
                                        <TableHead className="w-1/6 font-bold">Total Price</TableHead>
                                        <TableHead className="font-bold text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="py-6 pl-10">{index + 1}</TableCell>
                                            <TableCell><input required type="number" value={item.qty} onChange={(e) => handleItemChange(index, "qty", parseInt(e.target.value) || 0)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                            <TableCell><input required type="text" value={item.unit} onChange={(e) => handleItemChange(index, "unit", e.target.value)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                            <TableCell><input required type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Item description" /></TableCell>
                                            <TableCell className="space-x-2"><p className="inline-block">RP</p><input required type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseInt(e.target.value) || 0)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="0" /></TableCell>
                                            <TableCell className="text-left font-medium">
                                                <div className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC] justify-start items-center flex">
                                                    {(item.qty * item.unit_price).toLocaleString('id-ID')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center"><div onClick={() => removeItem(index)} className="cursor-pointer hover:contrast-75"><RiDeleteBinLine className="w-6 h-6 text-[#E7000B]" /></div></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>


                    <div className="w-3/12 flex flex-col ml-auto space-y-4 mt-4">
                        <hr className="border-b border-[#e6e6e6] my-1" />
                        <div className="flex justify-between">
                            <p>Sub Total:</p>
                            {/* value subtotal */}
                            <span>Rp {totals.subTotal.toLocaleString('id-ID')}</span>
                        </div>
                        <hr className="border-b border-[#e6e6e6] my-1" />
                        <div className="flex justify-between items-center">
                            <p>10% VAT:</p>
                            {/* value subtotal */}
                            <input id="vat_percentage" type="number" value={formData.vat_percentage} onChange={handleInputChange} className="w-12 border px-1 text-center h-7 rounded ml-auto" />
                            <span>%</span>
                        </div>
                        <hr className="border-b border-black my-1" />
                        <div className="flex justify-between">
                            <p>TOTAL:</p>
                            {/* value subtotal */}
                            <p>Rp {totals.grandTotal.toLocaleString('id-ID')}</p>
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="notes" className="text-sm font-bold">Notes</label>
                        <textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full border p-3 rounded-sm min-h-[100px]" placeholder="Add extra notes here..." />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="requested_by" className="text-sm font-bold">Requested by</label>
                            <input id="requested_by" required value={formData.requested_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="requested_position" className="text-sm font-bold">Position</label>
                            <input id="requested_position" required value={formData.requested_position} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Position" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="approved_by" className="text-sm font-bold">Approved by</label>
                            <input id="approved_by" required value={formData.approved_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name/Position" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="approved_position" className="text-sm font-bold">position</label>
                            <input id="approved_position" required value={formData.approved_position} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Position" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="authorized_by" className="text-sm font-bold">Approved by</label>
                            <input id="authorized_by" required value={formData.authorized_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-row ml-auto gap-x-4">
                        <Link href={"/admin/purchase-requisition"} className=" border text-black px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Cancel
                        </Link>
                        <button className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            {loading ? "Processing..." : "Save Purchase Requisition"}
                        </button>
                    </div>
                </form>
            </div>
            {/* form container */}


        </div>
    )
}