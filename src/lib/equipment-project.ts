export interface EquipmentProjectData {
    id: number;
    project_date: string; // Format YYYY-MM-DD
    customer: string;
    location: string;
    prepared_by: string;
    verified_by: string;
}

export interface EquipmentProjectMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface GetAllEquipmentProjectResponse {
    success: boolean;
    data: {
        data: EquipmentProjectData[];
    };
    meta: EquipmentProjectMeta;
}


// src/lib/equipment-project.ts (Tambahkan di file ini atau file Equipment Project/General lainnya)

// --- INTERFACES UNTUK FORM EQUIPMENT PROJECT ---

// Sesuaikan dengan data equipment yang tersedia di tabel (dari equipment general)
export interface EquipmentItem {
    id: number;
    description: string;
    merk_type: string;
    serial_number: string;
    calibration_date: string; // YYYY-MM-DD
    // Tambahkan field lain jika perlu, misal: durasi, expired, lembaga_kalibrasi
}

export interface GetAllEquipmentItemResponse {
    success: boolean;
    data: {
        data: EquipmentItem[];
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}


// --- PAYLOAD UNTUK CREATE EQUIPMENT PROJECT ---

export interface CreateEquipmentProjectPayload {
    project_date: string;
    customer_id: number; // Dari dropdown Customer
    customer_location_id: number; // Dari dropdown Work Location
    prepared_by: string;
    verified_by: string;
    // Array ID peralatan yang dipilih dari tabel
    equipment_ids: number[];
}


export interface EquipmentProjectDetail {
    id: number;
    project_date: string; // YYYY-MM-DD
    customer: string;
    customer_id: number; // ASUMSI: ID customer diperlukan untuk mengisi dropdown
    location: string;
    customer_location_id: number; // ASUMSI: ID lokasi diperlukan untuk mengisi dropdown
    prepared_by: string;
    verified_by: string;
    equipments: EquipmentItem[]; // Daftar equipment yang sudah terikat
}

export interface GetEquipmentProjectByIdResponse {
    success: boolean;
    data: EquipmentProjectDetail;
    message?: string;
}

export async function getAllEquipmentproject(page = 1, perPage = 15, search = ""): Promise<GetAllEquipmentProjectResponse> {
    try {
        // Request ke API dengan page, perPage, dan search
        const res = await fetch(`/api/equipment/project?page=${page}&per_page=${perPage}&search=${search}`);

        return await res.json() as GetAllEquipmentProjectResponse;
    } catch (err: any) {
        // Return tipe yang sesuai dengan response yang diharapkan
        return { success: false, data: { data: [] }, meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } };
    }
}


export async function createEquipmentproject(payload: CreateEquipmentProjectPayload) {
    try {
        const res = await fetch("/api/equipment/project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error creating equipment data" };
    }
}

export async function getEquipmentprojectById(id: number) {
    try {
        const res = await fetch(`/api/equipment/project/${id}`);
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching equipment data by ID" };
    }
}


export async function updateEquipmentproject(id: number, payload: CreateEquipmentProjectPayload) {
    try {
        const res = await fetch(`/api/equipment/project/${id}`, {
            method: "PUT", // Gunakan method PUT atau PATCH
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error updating equipment data" };
    }
}


export async function deleteEquipmentproject(id: number) {
    try {
        const res = await fetch(`/api/equipment/project/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}


export async function getAllAvailableEquipment(page = 1, perPage = 10, search = ""): Promise<GetAllEquipmentItemResponse> {
    try {
        // Ganti dengan endpoint API yang benar untuk equipment yang tersedia
        const res = await fetch(`/api/equipment/general?page=${page}&per_page=${perPage}&search=${search}`);
        const data = await res.json();

        // Memastikan tipe kembali sesuai dengan interface
        if (data.success) {
            return data as GetAllEquipmentItemResponse;
        }

        return { success: false, data: { data: [] }, meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };

    } catch (err: any) {
        return {
            success: false, data: { data: [] }, meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
        }
    }
}