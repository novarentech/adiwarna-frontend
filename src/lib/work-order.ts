// Interface untuk masing-masing Work Order
export interface GetAllWorkOrder {
    id: number;
    work_order_no: string;
    work_order_year: number;
    date: string; // bisa diganti ke Date jika ingin parsing
    employees: string[];
    scope_of_work: string[];
    customer: string;
    work_location: string;
}

// Interface untuk meta informasi pagination
export interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Interface utama untuk response API
export interface GetAllWorkOrdersResponse {
    success: boolean;
    data: GetAllWorkOrder[];
    meta: Meta;
}


// CREATE
export interface CreateWorkOrderBody {
    work_order_no: string;
    work_order_year: number;
    date: string;
    customer_id: number;
    customer_location_id: number;
    scope_of_work: string[];
    employees: { employee_id: number }[];
}

// Response interfaces
export interface CreateCustomer {
    id: number;
    name: string;
    phone: string;
}

export interface CreateEmployee {
    id: number;
    employee_id: number;
    name: string;
    position: string;
}

export interface CreateWorkOrderData {
    id: number;
    work_order_no: string;
    work_order_year: number;
    date: string;
    customer_id: number;
    customer: CreateCustomer;
    customer_location_id: number;
    work_location: string;
    scope_of_work: string[];
    employees: CreateEmployee[];
    created_at: string;
    updated_at: string;
}

export interface CreateWorkOrderResponse {
    success: boolean;
    message: string;
    data: CreateWorkOrderData;
}

export interface UpdateWorkOrderBody {
    work_order_no: string;
    work_order_year: number;
    date: string;
    customer_id: number;
    customer_location_id: number;
    scope_of_work: string[];
    employees: { id?: number; employee_id: number }[]; // id opsional untuk row baru
}





export async function getAllWorkOrders(page = 1, search = "") {
    try {
        const res = await fetch(`/api/work-orders?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch work orders" };
    }
}




export async function createWorkOrder(body: CreateWorkOrderBody) {
    try {
        const res = await fetch("/api/work-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data: CreateWorkOrderResponse = await res.json();
        return data;
    } catch (err: any) {
        return { success: false, message: err.message || "Error creating work order" };
    }
}

export async function getWorkOrderById(id: number) {
    try {
        const res = await fetch(`/api/work-orders/${id}`, { cache: 'no-store' });
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch detail" };
    }
}

export async function updateWorkOrder(id: number, body: UpdateWorkOrderBody) {
    try {
        const res = await fetch(`/api/work-orders/${id}`, {
            method: "PUT", // Atau PATCH tergantung backend
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error updating work order" };
    }
}


export async function deleteWorkOrders(id: number) {
    try {
        const res = await fetch(`/api/work-orders/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete work order" };
    }
}