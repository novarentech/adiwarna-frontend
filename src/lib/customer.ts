// export interface CustomerLocation {
//     id: number;
//     location_name: string;
// }

export interface Customer {
    id: number;
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    customer_locations: CustomerLocation[];
}

export interface CustomerById {
    id: number;
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    locations: CustomerLocation[];
}

export interface CustomerResponse {
    success: boolean;
    data: Customer[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}


export interface CustomerLocationInput {
    location_name: string;
}

export interface CreateCustomerBody {
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    customer_locations: CustomerLocationInput[];
}

export interface CustomerLocation extends CustomerLocationInput {
    id: number;
    customer_id: number;
    created_at: string;
    updated_at: string;
}

export interface CustomerResponseData {
    id: number;
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    locations: CustomerLocation[];
    created_at: string;
    updated_at: string;
}

export interface CreateCustomerResponse {
    success: boolean;
    message: string;
    data: CustomerResponseData;
}


export interface EditCustomerBody {
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    locations: CustomerLocation[];
}



export async function getCustomers(search: string = "", page: number = 1) {
    try {
        const query = `?search=${search}&page=${page}`;

        const res = await fetch(`/api/customers${query}`, {
            method: "GET",
            cache: "no-store",
        });

        return await res.json();
    } catch (error) {
        return { success: false, message: "Failed to fetch customers" };
    }
}

export async function getCustomersAllForDropdown(search: string = "", page: number = 1) {
    try {
        const query = `?search=${search}&page=${page}`;

        const res = await fetch(`/api/customers/all${query}`, {
            method: "GET",
            cache: "no-store",
        });

        return await res.json();
    } catch (error) {
        return { success: false, message: "Failed to fetch customers" };
    }
}



export async function createCustomerRequest(
    body: CreateCustomerBody
): Promise<CreateCustomerResponse> {
    const res = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(body),
    });

    return res.json();
}


export async function getCustomerById(id: Number) {
    const res = await fetch(`/api/customers/${id}`, {
        method: "GET",
        cache: "no-store"
    });
    return res.json();
}

export async function updateCustomerRequest(id: Number, body: EditCustomerBody) {
    const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    return res.json();
}

export async function deleteCustomer(id: number) {
    try {
        const res = await fetch(`/api/customers/${id}`, {
            method: "DELETE"
        });

        return await res.json();

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}
