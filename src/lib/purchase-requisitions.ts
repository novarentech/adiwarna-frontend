// GET ALL

export interface GetAllPurchaseRequisitionResponse {
    success: boolean;
    data: GetAllPurchaseRequisitionData[];
    meta: PaginationMeta;
}

export interface GetAllPurchaseRequisitionData {
    id: number;
    pr_no: string;
    pr_date: string;
    date: string; // format: DD/MM/YYYY
    supplier: string;
    // place_of_delivery: string;
    total_amount: string; // contoh: "Rp 52.945.660"
    status: "Draft" | "Approved" | "Pending";
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// CREATE
export interface PurchaseRequisitionRequest {
    pr_no: string;
    // rev_no: string;
    date: string; // format: YYYY-MM-DD
    // required_delivery: string; // format: YYYY-MM-DD
    po_no_cash: string | null;
    supplier: string;
    routing: "online" | "offline";
    // place_of_delivery: string;
    vat_percentage: number; // contoh: 10
    requested_by: string;
    requested_position: string;
    approved_by: string;
    approved_position: string;
    authorized_by: string;
    status: "draft" | "pending" | "approved" | "rejected";
    notes?: string;
    items: PurchaseRequisitionItem[];
}
export interface PurchaseRequisitionItem {
    qty: number;
    unit: string;
    description: string;
    unit_price: number;
}


// GET BY ID
export interface PurchaseRequisitionGetByIdResponse {
    success: boolean;
    data: GetByIDPurchaseRequisitionDetails;
}

export interface GetByIDPurchaseRequisitionDetails {
    id: number;
    pr_no: string;
    pr_date: string;
    // rev_no: string | null;
    date: string; // format: YYYY-MM-DD
    // required_delivery: string; // format: YYYY-MM-DD
    po_no_cash: string;
    supplier: string;
    // place_of_delivery: string;
    routing: "online" | "offline";
    sub_total: string; // misalnya: "30135.99"
    vat_percentage: string; // misalnya: "10.00"
    vat_amount: string; // misalnya: "3013.60"
    total_amount: string; // misalnya: "33149.59"
    requested_by: string;
    requested_position: string;
    approved_by: string;
    approved_position: string;
    authorized_by: string;
    status: "draft" | "pending" | "approved" | "rejected";
    notes: string | null;
    items: GetbyIDPurchaseRequisitionItem[];
}

export interface GetbyIDPurchaseRequisitionItem {
    id: number;
    qty: string; // jumlah sebagai string (bisa digunakan untuk angka besar atau desimal)
    unit: string;
    description: string;
    unit_price: string; // unit price sebagai string untuk memastikan angka dengan format desimal
    total_price: string; // total price juga sebagai string
}

// EDIT / UPDATE
export interface PurchaseRequisitionUpdateRequest {
    pr_no: string;
    // rev_no: string;
    date: string; // format: YYYY-MM-DD
    // required_delivery: string; // format: YYYY-MM-DD
    po_no_cash: string;
    supplier: string;
    // place_of_delivery: string;
    routing: "online" | "offline";
    vat_percentage: number;
    requested_by: string;
    approved_by: string;
    authorized_by: string;
    status: "draft" | "pending" | "approved" | "rejected";
    notes?: string;
    items: PurchaseRequisitionItemUpdate[];
}

export interface PurchaseRequisitionItemUpdate {
    id?: number; // id untuk item yang sudah ada, bisa di-omit jika item baru
    qty: number;
    unit: string;
    description: string;
    unit_price: number;
}





// GET ALL
export async function GetAllPurchaseRequisition(page = 1, perPage = 15, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/purchase-requisitions?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}

export async function GetAll999PurchaseRequisition(page = 1, perPage = 999999, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/purchase-requisitions?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}

// CREATE
export async function CreatePurchaseRequisition(payload: PurchaseRequisitionRequest) {
    try {
        const res = await fetch("/api/purchase-requisitions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error creating equipment data" };
    }
}

// GET BY ID
export async function getPurchaseRequisitionById(id: number) {
    try {
        const res = await fetch(`/api/purchase-requisitions/${id}`);
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching equipment data by ID" };
    }
}


// EDIT / UPDATE
export async function updatePurchaseRequisition(id: number, payload: PurchaseRequisitionUpdateRequest) {
    try {
        const res = await fetch(`/api/purchase-requisitions/${id}`, {
            method: "PUT", // Gunakan method PUT atau PATCH
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error updating equipment data" };
    }
}


// DELETE
export async function deletePurchaseRequisition(id: number) {
    try {
        const res = await fetch(`/api/purchase-requisitions/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}