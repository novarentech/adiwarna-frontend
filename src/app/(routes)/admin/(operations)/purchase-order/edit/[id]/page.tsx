"use client";

import { MdAddShoppingCart } from "react-icons/md";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { getPurchaseOrderById, updatePurchaseOrder, UpdatePurchaseOrderItemPayload, UpdatePurchaseOrderPayload } from "@/lib/purchase-order";
import { Customer, getCustomerById, getCustomersAllForDropdown } from "@/lib/customer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RowDataScope {
    id?: string | number;
    qty: string;
    unit: string;
    description: string;
    unitRate: string;
}

type EditPurchaseOrderParams = Promise<{ id: string }>;

export default function EditPurchaseOrderPage({
    params,
}: {
    params: EditPurchaseOrderParams;
}) {
    const actualParams = use(params);
    const id = actualParams.id;

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");

    const [formData, setFormData] = useState({
        po_no: "",
        po_year: "",
        date: "",
        customer_id: 0,
        pic_name: "",
        pic_phone: "",
        required_date: "",
        top_dp: "",
        top_cod: "",
        quotation_ref: "",
        purchase_requisition_no: "",
        purchase_requisition_year: "",
        discount: "",
        req_name: "",
        req_pos: "",
        app_name: "",
        app_pos: "",
        auth_name: "",
        auth_pos: "",
    });

    const [rowsScope, setRowsScope] = useState<RowDataScope[]>([]);

    // LOAD CUSTOMER DROPDOWN
    useEffect(() => {
        const fetchCustomers = async () => {
            const res = await getCustomersAllForDropdown();
            if (res.success) {
                setCustomers(res.data.rows || res.data);
            }
        };
        fetchCustomers();
    }, []);

    // LOAD DETAIL PO
    useEffect(() => {
        const loadPurchaseOrderDetail = async () => {
            const result = await getPurchaseOrderById(id);
            if (!result.success) {
                alert("Gagal mengambil data");
                return;
            }

            const po = result.data;

            // SET FORM
            setFormData({
                po_no: po.po_no,
                po_year: po.po_year,
                date: po.date.substring(0, 10),
                customer_id: po.customer.id,
                pic_name: po.pic_name,
                pic_phone: po.pic_phone,
                required_date: po.required_date.substring(0, 10),
                top_dp: po.top_dp || "",
                top_cod: po.top_cod || "",
                quotation_ref: po.quotation_ref,
                purchase_requisition_no: po.purchase_requisition_no || "",
                purchase_requisition_year: po.purchase_requisition_year?.toString() || "",
                discount: po.discount?.toString() || "",
                req_name: po.req_name || "",
                req_pos: po.req_pos || "",
                app_name: po.app_name,
                app_pos: po.app_pos,
                auth_name: po.auth_name,
                auth_pos: po.auth_pos
            });

            // SET CUSTOMER DETAIL
            setCustomerAddress(po.customer.address);
            setCustomerPhoneNumber(po.customer.phone_number);

            // SET ITEMS
            setRowsScope(
                po.items.map(item => ({
                    id: item.id,
                    qty: item.quantity.toString(),
                    description: item.description,
                    unit: item.unit,
                    unitRate: item.rate.toString(),
                }))
            );
        };

        loadPurchaseOrderDetail();
    }, [id]);

    // HANDLE CHANGE FORM INPUTS
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // SCOPE TABLE ACTIONS
    const addRowScope = () =>
        setRowsScope(prev => [
            ...prev,
            { qty: "", unit: "", description: "", unitRate: "" },
        ]);

    const updateRowScope = (i: number, field: keyof RowDataScope, value: string) => {
        const copy = [...rowsScope];
        copy[i][field] = value;
        setRowsScope(copy);
    };

    const deleteRowScope = (i: number) => {
        setRowsScope(prev => prev.filter((_, idx) => idx !== i));
    };

    // SUBMIT EDIT
    const handleUpdatePurchaseOrder = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const items: UpdatePurchaseOrderItemPayload[] = rowsScope.map(row => ({
            id: row.id !== undefined ? Number(row.id) : undefined, // jika item lama → ada id
            description: row.description || "N/A",
            quantity: parseFloat(row.qty),
            unit: row.unit,
            rate: parseFloat(row.unitRate),
        }));

        const payload: UpdatePurchaseOrderPayload = {
            po_no: formData.po_no,
            po_year: Number(formData.po_year),
            date: formData.date,
            customer_id: Number(formData.customer_id),
            pic_name: formData.pic_name,
            pic_phone: formData.pic_phone,
            required_date: formData.required_date,
            top_dp: formData.top_dp,
            top_cod: formData.top_cod,
            quotation_ref: formData.quotation_ref,
            purchase_requisition_no: formData.purchase_requisition_no,
            purchase_requisition_year: Number(formData.purchase_requisition_year),
            discount: parseFloat(formData.discount) || 0,
            req_name: formData.req_name,
            req_pos: formData.req_pos,
            app_name: formData.app_name,
            app_pos: formData.app_pos,
            auth_name: formData.auth_name,
            auth_pos: formData.auth_pos,
            items,
        };

        const result = await updatePurchaseOrder(id, payload);
        if (result.success) {
            // alert("Purchase Order updated!");
            toast.success("Purchase Order updated successfully!");
            router.push("/admin/purchase-order");
        } else {
            // alert(result.message || "Gagal update PO");
            toast.error(result.message || "Gagal update PO");
        }

        setLoading(false);
    };

    // LOAD CUSTOMER DETAILS WHEN ID CHANGED
    useEffect(() => {
        const fetchCustomerDetail = async () => {
            if (!formData.customer_id) return;

            const result = await getCustomerById(formData.customer_id);

            if (result && result.data) {
                const cust = result.data;
                setCustomerAddress(cust.address || "");
                setCustomerPhoneNumber(cust.phone_number || "");
            }
        };

        fetchCustomerDetail();
    }, [formData.customer_id]);



    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdAddShoppingCart className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Purchase Order : {id}  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleUpdatePurchaseOrder} className="flex flex-col">
                    {/* seperate into 2 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REF */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="po-no" className="font-bold">PO No. <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="po_no" required value={formData.po_no}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add number" />
                                    <p className="mx-4 font-bold">/PO/AWS-INS/</p>
                                    <input type="text" id="po_year" required value={formData.po_year}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="year" />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Date */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="date" className="font-bold">Date <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="date" id="date" required value={formData.date}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* customer */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer" className="font-bold">Customer <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <select id="customer_id" required value={formData.customer_id}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2">
                                        <option value="" className="font-light" hidden>---Choose Customer's Name---</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer-address" className="font-bold">Customer's Address</label>
                                <div className="flex">
                                    <input type="text" value={customerAddress} id="customer-address" className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2 bg-[#e9ecef]" placeholder="" disabled />
                                </div>
                            </div>
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer-phone" className="font-bold">Customer's Phone Number</label>
                                <div className="flex">
                                    <input type="text" id="customer-phone" value={customerPhoneNumber} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2 bg-[#e9ecef]" placeholder="" disabled />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* PIC */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic_name" className="font-bold">Person in Charge (PIC) <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="pic_name" required value={formData.pic_name}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add PIC'S name" />
                                </div>
                            </div>
                            {/* PIC phone */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic-phone" className="font-bold">PIC's Phone number <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="pic_phone" required value={formData.pic_phone}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add PIC'S telephone number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6" />

                    <div className="grid grid-cols-[3fr_2fr_2fr] my-6 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* required delivery date */}
                                <label htmlFor="required_date" className="font-bold">Required Delivery Date <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="date" id="required_date" required value={formData.required_date}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* quotation */}
                            <div className="flex flex-col space-y-1">
                                {/* terms of payment */}
                                <label htmlFor="term-of-payment" className="font-bold">Terms of Payment <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="top_dp" required value={formData.top_dp}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="50" />
                                    <p className="mx-2 font-bold">% DP;</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* persen COD */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="quotations-valid" className="font-bold text-transparent">.</label>
                                <div className="flex items-center">
                                    <input type="text" id="top_cod" required value={formData.top_cod}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="50" />
                                    <p className="mx-4 font-bold">% COD</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[3fr_2fr_2fr] my-1 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* Quotation Ref. */}
                                <label htmlFor="quotation-ref" className="font-bold">Quotation Ref. <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="quotation_ref" required value={formData.quotation_ref}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* PR no */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pr-no" className="font-bold">PR No. <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="purchase_requisition_no" required value={formData.purchase_requisition_no}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="50" />
                                    <p className="mx-2 font-bold">/PR/</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* year */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="purchase_requisition_year" className="font-bold text-transparent">.</label>
                                <div className="flex items-center">
                                    <input type="number" id="purchase_requisition_year" required value={formData.purchase_requisition_year}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Year" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6" />

                    {/* scope of works */}
                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-6 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[10%]">Qty</th>
                                    <th className="w-[10%]">Unit</th>
                                    <th>Descsription</th>
                                    <th className="w-[15%]">Unit Rate</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsScope.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <input
                                                type="number"
                                                required
                                                value={row.qty}
                                                onChange={(e) => updateRowScope(index, "qty", e.target.value)}
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mx-auto appearance-none"
                                                placeholder="0"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                required
                                                value={row.unit}
                                                onChange={(e) => updateRowScope(index, "unit", e.target.value)}
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                                placeholder="Unit"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                required
                                                value={row.description}
                                                onChange={(e) =>
                                                    updateRowScope(index, "description", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                                placeholder="Add Description"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                required
                                                value={row.unitRate}
                                                onChange={(e) => updateRowScope(index, "unitRate", e.target.value)}
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                                placeholder="0"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowScope(index)}
                                            >
                                                <FaTrash className="w-5 h-5 text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Button Add Row */}
                        <div
                            onClick={addRowScope}
                            className="mt-4 px-4 py-2 bg-[#31C6D4] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REQ BY */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="req_name" className="font-bold">Requested By <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="req_name" required value={formData.req_name}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan nama anda" />
                                </div>
                            </div>
                            {/* approved */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="app_name" className="font-bold">Approved By <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="app_name" required value={formData.app_name}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan nama" />
                                </div>
                            </div>
                            {/* author */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="auth_name" className="font-bold">Authorized By <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="auth_name" required value={formData.auth_name}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan nama" />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Position request by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="req_pos" className="font-bold">Position <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="req_pos" required value={formData.req_pos}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan Posisi Anda" />
                                </div>
                            </div>
                            {/* position approved by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="app_pos" className="font-bold">Person in Charge (PIC) <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="app_pos" required value={formData.app_pos}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan Posisi " />
                                </div>
                            </div>
                            {/* position authorized by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="auth_pos" className="font-bold">Position <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="auth_pos" required value={formData.auth_pos}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan Posisi " />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className=" flex-col space-y-4">
                        {/* Dicount */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="discount" className="font-bold">Discount <span className="text-red-500">*</span></label>
                            <div className="flex">
                                <input type="text" id="discount" required value={formData.discount}
                                    onChange={handleFormChange} className="w-2/6 border border-[#AAAAAA] rounded-sm h-9 px-2" />
                                <p className="my-auto ml-2">{"(%)"}</p>
                            </div>
                        </div>
                    </div>
                    <hr className="border-b my-6" />
                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/purchase-order"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#31C6D4] flex justify-center items-center text-white h-10 rounded-sm">Save</button>
                    </div>
                </form>
                {/* end form */}
            </div >
            {/* end of form container */}

            <div className="h-20 text-transparent" >.</div>
        </div >
    )
}