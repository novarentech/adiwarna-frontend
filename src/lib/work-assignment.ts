export interface GetAllWorkAssignment {
    id: number;
    assignment_no: string;
    assignment_year: string;
    ref_no: string;
    ref_year: string;
    date: string;
    customer: string;
    work_location: string;
}

export interface GetAllWorkAssignmentResponse {
    success: boolean;
    data: GetAllWorkAssignment[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }
}

// CREATE

export interface RowDataWorker {
    details: string;   // nama pekerja
    position: string;  // posisi pekerja
}

export interface WorkAssignmentFormData {
    assignment_no: string;
    assignment_year: string;   // simpan sebagai string di input, nanti di parseInt saat submit
    date: string;              // yyyy-mm-dd
    ref_no: string;
    ref_year: string;
    customer_id: string;
    customer_location_id: string;
    ref_po_no_instruction: string;
    scope: string;
    estimation: string;
    mobilization: string;
    auth_name: string;
    auth_pos: string;
}


export interface CreateWorkAssignmentPayload {
    assignment_no: string;
    assignment_year: number;
    date: string;
    ref_no: string;
    ref_year: number;
    customer_id: number;
    customer_location_id: number;
    ref_po_no_instruction: string;
    scope: string;
    estimation: string;
    mobilization: string;
    auth_name: string;
    auth_pos: string;
    workers: {
        worker_name: string;
        position: string;
    }[];
}


// GET BY ID
// Types
export interface Worker {
    id?: number;
    worker_name: string;
    position: string;
}

export interface WorkAssignment {
    id: number;
    assignment_no: string;
    assignment_year: string | number;
    date: string;
    ref_no: string;
    ref_year: string | number;
    customer: {
        id: number;
        name: string;
        customer_no?: string;
        phone_number?: string;
        address?: string;
    };
    customer_location_id?: number;
    ref_po_no_instruction?: string;
    scope: string;
    estimation: string;
    mobilization: string;
    auth_name: string;
    auth_pos: string;
    workers: Worker[];
}


// UPDATE

interface WorkAssignmentResponse {
    success: boolean;
    message?: string;
    data?: WorkAssignment;
}

interface UpdateWorkAssignmentPayload {
    assignment_no: string;
    assignment_year: number;
    date: string;
    ref_no: string;
    ref_year: number;
    customer_id: number;
    customer_location_id: number;
    ref_po_no_instruction?: string;
    scope: string;
    estimation: string;
    mobilization: string;
    auth_name: string;
    auth_pos: string;
    workers: Worker[];
}


export async function getAllWorkAssignment(page = 1, search = "") {
    try {
        const res = await fetch(`/api/work-assignments?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch work assignments" };
    }
}


export async function createPurchaseWorkAssignment(payload: CreateWorkAssignmentPayload) {
    try {
        const res = await fetch("/api/work-assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error create purchase-orders" };
    }
}


// Ambil Work Assignment by ID
export async function getWorkAssignmentById(id: string): Promise<WorkAssignmentResponse> {
    try {
        const res = await fetch(`/api/work-assignments/${id}`, {
            method: "GET",
        });
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error getting work assignment" };
    }
}

// Update Work Assignment
export async function updateWorkAssignment(id: string, payload: UpdateWorkAssignmentPayload): Promise<WorkAssignmentResponse> {
    try {
        const res = await fetch(`/api/work-assignments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error updating work assignment" };
    }
}



export async function deleteWorkAssignment(id: number) {
    try {
        const res = await fetch(`/api/work-assignments/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete work assignments" };
    }
}