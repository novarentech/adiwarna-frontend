// GET ALL

export interface GetAllDeliveryNoteResponse {
    success: boolean;
    data: GetAllDeliveryNoteData[];
    meta: PaginationMeta;
}

export interface GetAllDeliveryNoteData {
    id: number;
    delivery_note_no: string;
    date: string; // format: YYYY-MM-DD
    customer: string;
    wo_no: string;
    vehicle_plate: string;
    total_items: number;
    status: "Delivered" | "Pending" | "Cancelled";
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// CREATE
export interface CreateDeliveryNoteRequest {
    delivery_note_no: string;
    date: string; // format: YYYY-MM-DD
    customer: string;
    customer_address: string;
    wo_no: string;
    delivered_with: string; // kendaraan yang digunakan untuk pengiriman
    vehicle_plate: string;
    delivered_by: string; // nama orang yang mengirim
    received_by: string; // nama orang yang menerima
    status: "delivered" | "pending" | "cancelled"; // status pengiriman
    notes?: string; // catatan tambahan
    items: CreateDeliveryNoteItem[]; // daftar item yang dikirim
}

export interface CreateDeliveryNoteItem {
    item_name: string;
    serial_number?: string; // bisa kosong kalau item tidak memiliki serial number
    qty: number;
}

// GET BY ID
export interface GetDeliveryNoteGetByIdResponse {
    success: boolean;
    data: GetbyIdDeliveryNoteDetails;
}

export interface GetbyIdDeliveryNoteDetails {
    id: number;
    delivery_note_no: string;
    date: string; // format: YYYY-MM-DD
    customer: string;
    customer_address: string;
    wo_no: string;
    delivered_with: string | null; // kendaraan pengirim, bisa null jika tidak disebutkan
    vehicle_plate: string;
    delivered_by: string;
    received_by: string;
    status: "delivered" | "pending" | "cancelled";
    notes: string | null;
    items: GetbyIdDeliveryNoteItemDetails[];
}

export interface GetbyIdDeliveryNoteItemDetails {
    id: number;
    item_name: string;
    serial_number: string | null; // serial number bisa null jika tidak ada
    qty: number;
}



// UPDATE
export interface UpdateDeliveryNoteRequest {
    delivery_note_no: string;
    date: string; // format: YYYY-MM-DD
    customer: string;
    customer_address: string;
    wo_no: string;
    delivered_with: string; // kendaraan yang digunakan untuk pengiriman
    vehicle_plate: string;
    delivered_by: string; // nama orang yang mengirim
    received_by: string; // nama orang yang menerima
    status: "delivered" | "pending" | "cancelled"; // status pengiriman
    notes?: string; // catatan tambahan
    items: DeliveryNoteItemUpdate[]; // daftar item yang dikirim
}

export interface DeliveryNoteItemUpdate {
    id: number; // id untuk item yang sudah ada, digunakan untuk update item
    item_name: string;
    serial_number: string;
    qty: number;
}



// GET ALL
export async function GetAllDeliveryNote(page = 1, perPage = 15, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/delivery-notes?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}

// CREATE
export async function CreateDeliveryNote(payload: CreateDeliveryNoteRequest) {
    try {
        const res = await fetch("/api/delivery-notes", {
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
export async function getDeliveryNoteById(id: number) {
    try {
        const res = await fetch(`/api/delivery-notes/${id}`);
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching equipment data by ID" };
    }
}


// EDIT / UPDATE
export async function updateDeliveryNote(id: number, payload: UpdateDeliveryNoteRequest) {
    try {
        const res = await fetch(`/api/delivery-notes/${id}`, {
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
export async function deleteDeliveryNote(id: number) {
    try {
        const res = await fetch(`/api/delivery-notes/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}