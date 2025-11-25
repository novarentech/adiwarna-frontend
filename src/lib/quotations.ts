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






export async function getAllQuotations(page = 1, search = "") {
    try {
        const res = await fetch(`/api/quotations?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch quotations" };
    }
}


export async function createQuotation(payload: any) {
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
