export interface GetAllDocumentTransmittalResponse {
    success: boolean,
    data: GetAllDocTransmittalData[]
}

export interface GetAllDocTransmittalData {
    id: number,
    ta_no: string,
    date: string,
    customer: string,
    pic: string
}



export interface DocumentPayload {
    wo_number: string;
    wo_year: number;
    location: string;
}

// Interface untuk keseluruhan body saat membuat Transmittal
export interface CreateDocTransmittalPayload {
    name: string;
    ta_no: string;
    date: string;
    customer_id: number;
    customer_district: string;
    pic_name: string;
    report_type: string;
    documents: DocumentPayload[];
}

export interface DocumentPayload {
    id?: number; // Tambahkan ID (opsional) untuk baris yang sudah ada saat update
    wo_number: string;
    wo_year: number;
    location: string;
}

// Interface untuk keseluruhan body saat membuat/mengupdate Transmittal
export interface CreateDocTransmittalPayload { // Digunakan juga untuk Update
    name: string;
    ta_no: string;
    date: string;
    customer_id: number;
    customer_district: string;
    pic_name: string;
    report_type: string;
    documents: DocumentPayload[];
}

// Ganti nama ini agar lebih konsisten dengan payload di atas
export type UpdateDocTransmittalPayload = CreateDocTransmittalPayload;

export interface GetbyidDocumentTransmittal {
    id: number;
    name: string;
    ta_no: string;
    date: string;
    customer: {
        id: number;
        name: string;
        address: string;
        district: string;
    };
    pic_name: string;
    report_type: string;
    documents: {
        id: number;
        wo_number: string;
        wo_year: number;
        location: string;
    }[];
    created_at: string;
    updated_at: string;
}



export async function getAllDocTrans(page = 1, search = "") {
    try {
        const res = await fetch(`/api/document-transmittals?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch document-transmittals" };
    }
}

export async function getAll999DocTrans(page = 1, search = "") {
    try {
        const res = await fetch(`/api/document-transmittals/all?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch document-transmittals" };
    }
}

export async function createDocumentTransmittal(payload: CreateDocTransmittalPayload) {
    try {
        const res = await fetch("/api/document-transmittals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error create document transmittal" };
    }
}


export async function getDocumentTransmittalById(id: string) {
    try {
        const res = await fetch(`/api/document-transmittals/${id}`, {
            method: "GET",
        });
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch detail" };
    }
}

// Perbaiki fungsi update yang sebelumnya bernama updateQuotations
export async function updateDocTransmittal(id: string, payload: UpdateDocTransmittalPayload) {
    try {
        const res = await fetch(`/api/document-transmittals/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error update document transmittal" };
    }
}

export async function deleteDocTrans(id: number) {
    try {
        const res = await fetch(`/api/document-transmittals/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}