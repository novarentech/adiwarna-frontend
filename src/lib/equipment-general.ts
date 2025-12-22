export interface GetAllEquipmentItem {
    id: number;
    description: string;
    merk_type: string;
    serial_number: string;
    duration: string;
    calibration_date: string;
    expired_date: string;
    calibration_agency: "internal" | "external";
    condition: "ok" | "repair" | "reject";
}

export interface EquipmentDataWrapper {
    data: GetAllEquipmentItem[];
}

export interface EquipmentMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface GetAllEquipmentResponse {
    success: boolean;
    data: EquipmentDataWrapper;
    meta: EquipmentMeta;
}


// lib/equipment-general.ts

// Interface untuk payload saat membuat data baru (sesuai format body JSON)
export interface CreateEquipmentPayload {
    description: string;
    merk_type: string;
    serial_number: string;
    calibration_date: string;
    duration_months: 6 | 12; // Hanya 6 atau 12 bulan
    calibration_agency: "internal" | "external";
    condition: "ok" | "repair" | "reject";
}


export interface GetEquipmentResponse {
    success: boolean;
    data: GetAllEquipmentItem; // Menggunakan interface yang sudah ada
}



export async function getAllEquipmentGeneral(page = 1, perPage = 15, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/equipment/general?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}

export async function getAll999EquipmentGeneral(page = 1, perPage = 999999, search = "") {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/equipment/general?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch equipment data" };
    }
}




export async function createEquipmentGeneral(payload: CreateEquipmentPayload) {
    try {
        const res = await fetch("/api/equipment/general", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error creating equipment data" };
    }
}

export async function getEquipmentGeneralById(id: number) {
    try {
        const res = await fetch(`/api/equipment/general/${id}`);
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching equipment data by ID" };
    }
}


export async function updateEquipmentGeneral(id: number, payload: CreateEquipmentPayload) {
    try {
        const res = await fetch(`/api/equipment/general/${id}`, {
            method: "PUT", // Gunakan method PUT atau PATCH
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error updating equipment data" };
    }
}


export async function deleteEquipmentGeneral(id: number) {
    try {
        const res = await fetch(`/api/equipment/general/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}