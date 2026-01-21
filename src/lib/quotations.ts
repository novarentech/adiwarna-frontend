export interface GetAllQuotation {
    id: number;
    date: string;
    ref_no: string;
    ref_year: string;
    customer: string;
    pic_name: string;
    subject: string;
}

export interface QuotationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface GetQuotationResponse {
    success: boolean;
    data: GetAllQuotation[];
    meta: QuotationMeta;
}


// create
export interface QuotationItemPayload {
    description: string;
    quantity: number;
    unit: string;
    rate: number;
}

export interface AdiwarnaPayload {
    adiwarna_description: string;
}

export interface ClientPayload {
    client_description: string;
}

export interface CreateQuotationPayload {
    date: string;
    ref_no: string;
    ref_year: number;
    customer_id: number;
    pic_name: string;
    pic_phone: string;
    subject: string;
    top: string;
    valid_until: string;
    clause: string;
    workday: string;
    auth_name: string;
    auth_position: string;
    discount: number;
    items: QuotationItemPayload[];
    adiwarnas: AdiwarnaPayload[];
    clients: ClientPayload[];
}

// update

export interface Customer {
    id: number;
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export interface QuotationItem {
    id: number;
    description: string;
    quantity: string;
    unit: string;
    rate: string;
}

export interface Adiwarna {
    id: number;
    quotation_id: number;
    adiwarna_description: string;
    created_at: string;
    updated_at: string;
}

export interface Client {
    id: number;
    quotation_id: number;
    client_description: string;
    created_at: string;
    updated_at: string;
}

export interface Quotation {
    id: number;
    date: string;
    ref_no: string;
    ref_year: string;
    customer: Customer;
    pic_name: string;
    pic_phone: string;
    subject: string;
    top: string;
    valid_until: string;
    clause: string;
    workday: string;
    auth_name: string;
    auth_position: string;
    discount: string;
    items: QuotationItem[];
    adiwarnas: Adiwarna[];
    clients: Client[];
    created_at: string;
    updated_at: string;
}



export interface UpdateQuotationPayload {
    date: string;
    ref_no: string;
    ref_year: number;
    customer_id: number;
    pic_name: string;
    pic_phone: string;
    subject: string;
    top: string;
    valid_until: string;
    clause: string;
    workday: string;
    auth_name: string;
    auth_position: string;
    discount: number;
    items: {
        id?: number; // existing item will have ID
        description: string;
        quantity: number;
        unit: string;
        rate: number;
    }[];
    adiwarnas: {
        id?: number;
        adiwarna_description: string;
    }[];
    clients: {
        id?: number;
        client_description: string;
    }[];
}



export async function getAllQuotations(page = 1, search = "") {
    try {
        const res = await fetch(`/api/quotations?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch quotations" };
    }
}

export async function getAll999Quotations(page = 1, search = "") {
    try {
        const res = await fetch(`/api/quotations/all?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch quotations" };
    }
}


export async function createQuotation(payload: CreateQuotationPayload) {
    try {
        const res = await fetch("/api/quotations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error create quotation" };
    }
}


export async function getQuotationsById(id: string) {
    const res = await fetch(`/api/quotations/${id}`, {
        method: "GET",
    });

    return res.json();
}

export async function updateQuotations(id: string, payload: UpdateQuotationPayload) {
    const res = await fetch(`/api/quotations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function deleteQuotations(id: number) {
    try {
        const res = await fetch(`/api/quotations/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}

