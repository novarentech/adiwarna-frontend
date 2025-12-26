// GET ALL
export interface GetAllMaterialReceivingReportResponse {
    success: boolean;
    data: AllMaterialReceivingData[];
    meta: Meta;
}

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AllMaterialReceivingData {
    id: number;
    po_inv_pr_no: string;
    supplier: string;
    receiving_date: string;
    order_by: string;
    total_items: number;
    received_by: string;
    status: string;
}

// CREATE
// Item detail pada receiving
export interface MaterialReceivingReportItemRequest {
    description: string;
    order_qty: number;
    received_qty: number;
    remarks?: string;
}

// Request body utama
export interface MaterialReceivingReportRequestBody {
    po_inv_pr_no: string;
    supplier: string;
    receiving_date: string; // format: YYYY-MM-DD
    order_by: "online" | "offline";
    received_by: string;
    acknowledge_by: string;
    status: "partial" | "complete";
    notes?: string;
    items: MaterialReceivingReportItemRequest[];
    received_position: string;
    acknowledge_position: string;
}


// GET BY ID
// Item detail pada receiving
export interface GetByIDMaterialReceivingReportItem {
    id: number;
    description: string;
    order_qty: string;  // bisa jadi string jika disimpan sebagai string pada API
    received_qty: string; // bisa jadi string jika disimpan sebagai string pada API
    remarks: string | null;
}

// Response body untuk GET by ID
export interface GetMaterialReceivingReportResponseById {
    success: boolean;
    data: {
        id: number;
        po_inv_pr_no: string;
        supplier: string;
        receiving_date: string;  // format: YYYY-MM-DD
        order_by: "online" | "offline";
        received_by: string;
        acknowledge_by: string;
        status: "partial" | "complete";
        notes: string;
        items: GetByIDMaterialReceivingReportItem[];
        received_position: string;
        acknowledge_position: string;
    };
}

export interface GetMaterialRecevingResponseByIDForPrint {
    id: number;
    po_inv_pr_no: string;
    supplier: string;
    receiving_date: string;  // format: YYYY-MM-DD
    order_by: "online" | "offline";
    received_by: string;
    acknowledge_by: string;
    status: "partial" | "complete";
    notes: string;
    items: GetByIDMaterialReceivingReportItem[];
    received_position: string;
    acknowledge_position: string;
};


// EDIT
// Item detail pada receiving yang digunakan untuk update
export interface ReceivingItemUpdateRequest {
    id?: number;  // id optional karena item baru tidak punya id
    description: string;
    order_qty: number;
    received_qty: number;
    remarks?: string; // remarks optional jika tidak ada
}

// Request body untuk edit/update material receiving
export interface MaterialReceivingUpdateRequestBody {
    po_inv_pr_no: string;
    supplier: string;
    receiving_date: string; // format: YYYY-MM-DD
    order_by: "online" | "offline";
    received_by: string;
    acknowledge_by: string;
    status: "partial" | "complete";
    notes?: string; // notes optional
    items: ReceivingItemUpdateRequest[];
}




// GET ALL
export async function GetAllMaterialReceiving(page = 1, perPage = 15, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/material-receiving-reports?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}


export async function GetAll999MaterialReceiving(page = 1, perPage = 999999, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/material-receiving-reports?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}

// CREATE
export async function CreateMaterialReceiving(payload: MaterialReceivingReportRequestBody) {
    try {
        const res = await fetch("/api/material-receiving-reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error creating equipment data" };
    }
}


export async function getMaterialReceivinById(id: number) {
    try {
        const res = await fetch(`/api/material-receiving-reports/${id}`);
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching equipment data by ID" };
    }
}


export async function updateMaterialReceiving(id: number, payload: MaterialReceivingUpdateRequestBody) {
    try {
        const res = await fetch(`/api/material-receiving-reports/${id}`, {
            method: "PUT", // Gunakan method PUT atau PATCH
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error updating equipment data" };
    }
}


export async function deleteMaterialReceiving(id: number) {
    try {
        const res = await fetch(`/api/material-receiving-reports/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}