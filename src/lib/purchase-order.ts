export interface PurchaseOrder {
    id: number;
    po_no: string;
    po_year: string;
    date: string;
    customer: string;
    pic_name: string;
    pic_phone: string;
    required_date: string;
}

export interface PurchaseOrderResponse {
    success: boolean;
    data: PurchaseOrder[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}


// CREATE
export interface PurchaseOrderItemPayload {
    description: string;
    quantity: number;
    unit: string;
    rate: number;
}

export interface CreatePurchaseOrderPayload {
    po_no: string;
    po_year: number;
    date: string;
    customer_id: number;
    pic_name: string;
    pic_phone: string;
    required_date: string;
    top_dp: string;
    top_cod: string;
    quotation_ref: string;
    purchase_requisition_no: string;
    purchase_requisition_year: number;
    discount: number;
    req_name: string;
    req_pos: string;
    app_name: string;
    app_pos: string;
    auth_name: string;
    auth_pos: string;
    items: PurchaseOrderItemPayload[];
}


// UPDATE
export interface UpdatePurchaseOrderItemPayload {
    id?: number; // optional (ada jika item lama, tidak ada jika item baru)
    description: string;
    quantity: number;
    unit: string;
    rate: number;
}

export interface UpdatePurchaseOrderPayload {
    po_no: string;
    po_year: number;
    date: string;
    customer_id: number;
    pic_name: string;
    pic_phone: string;
    required_date: string;
    top_dp: string;
    top_cod: string;
    quotation_ref: string;
    purchase_requisition_no: string;
    purchase_requisition_year: number;
    discount: number;
    req_name: string;
    req_pos: string;
    app_name: string;
    app_pos: string;
    auth_name: string;
    auth_pos: string;

    items: UpdatePurchaseOrderItemPayload[];
}


// GET BY ID

export interface PurchaseOrderItem {
    id: number;
    description: string;
    quantity: number | string; // API mengembalikan string
    unit: string;
    rate: number | string; // API mengembalikan string
}


export interface PurchaseOrderCustomer {
    id: number;
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    created_at: string;
    updated_at: string;
}




export interface PurchaseOrderDetail {
    id: number;
    po_no: string;
    po_year: string;
    date: string;

    customer: PurchaseOrderCustomer;

    pic_name: string;
    pic_phone: string;
    required_date: string;

    top_dp: string | null;
    top_cod: string | null;
    quotation_ref: string;
    purchase_requisition_no: string | null;
    purchase_requisition_year: number | null;

    discount: string | number | null;

    req_name: string | null;
    req_pos: string | null;
    app_name: string;
    app_pos: string;
    auth_name: string;
    auth_pos: string;

    items: PurchaseOrderItem[];

    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderByIdResponse {
    success: boolean;
    data: PurchaseOrderDetail;
}



// DELETE
export interface DeletePurchaseOrderResponse {
    success: string;
    message: string;
}


export async function getAllPurchaseOrders(page = 1, search = "") {
    try {
        const res = await fetch(`/api/purchase-orders?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch purchase-orders" };
    }
}


export async function createPurchaseOrder(payload: CreatePurchaseOrderPayload) {
    try {
        const res = await fetch("/api/purchase-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error create purchase-orders" };
    }
}


export async function getPurchaseOrderById(id: string): Promise<PurchaseOrderByIdResponse> {
    try {
        const res = await fetch(`/api/purchase-orders/${id}`, {
            method: "GET",
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error get purchase-orders" } as any;
    }
}

export async function updatePurchaseOrder(id: string, payload: UpdatePurchaseOrderPayload) {
    try {
        const res = await fetch(`/api/purchase-orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error update purchase-orders" };
    }
}



export async function deletePurchaseOrders(id: number) {
    try {
        const res = await fetch(`/api/purchase-orders/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete purchase order" };
    }
}