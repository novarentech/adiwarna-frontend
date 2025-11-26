import { Customer } from "./customer";

export interface DailyActivity {
    id: number;
    po_no: string;
    po_year: string;
    ref_no: string | null;
    customer: string;
    location: string;
    date: string; // bisa juga Date jika mau parse
    prepared_name: string;
}

// export interface DailyActivityByID {
//     id: number;
//     po_no: string;
//     po_year: string;
//     ref_no: string | null;
//     customer: Customer[];
//     location: string;
//     date: string; // bisa juga Date jika mau parse
//     prepared_name: string;
// }


export interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface GetDailyActivitiesResponse {
    success: boolean;
    data: DailyActivity[];
    meta: Meta;
}



// CREATE
export interface DailyActivityDescriptionPayload {
    description: string;
    equipment_no: string;
}

export interface CreateDailyActivityPayload {
    po_no: string;
    po_year: number;
    ref_no: string | null;
    customer_id: number;
    date: string;            // "YYYY-MM-DD"
    location: string;
    time_from: string;       // "HH:MM"
    time_to: string;         // "HH:MM"
    members: number[];       // employee_id[]
    descriptions: DailyActivityDescriptionPayload[];
    prepared_name: string;
    prepared_pos: string;
    acknowledge_name: string;
    acknowledge_pos: string;
}


export interface DailyActivityMember {
    id: number;
    employee_id: number | string;
    employee_name: string;
}

export interface DailyActivityDescription {
    id: number;
    description: string;
    equipment_no: string;
}

export interface DailyActivityData {
    id: number;
    po_no: string;
    po_year: number;
    ref_no: string | null;
    date: string;
    location: string;
    time_from: string;
    time_to: string;
    prepared_name: string;
    prepared_pos: string;
    acknowledge_name: string;
    acknowledge_pos: string;
    members: DailyActivityMember[];
    descriptions: DailyActivityDescription[];
    created_at: string;
    updated_at: string;
}

export interface CreateDailyActivityResponse {
    success: boolean;
    message: string;
    data: DailyActivityData;
}


// GET BY ID
export interface GetDailyActivityByIdResponse {
    success: boolean;
    data?: GetDailyActivityData;
    message?: string;
}



// EDIT
// export interface UpdateDailyActivityMemberPayload {
//     id?: number;            // old row
//     employee_id: number;
// }

// export interface UpdateDailyActivityDescriptionPayload {
//     id?: number;            // old row
//     description: string;
//     equipment_no: string;
// }

export interface UpdateDailyActivityMember {
    id?: number;          // kalau old record → ada ID, kalau new → tidak ada
    employee_id: number;
}

export interface UpdateDailyActivityDescription {
    id?: number;          // old record → ada ID, new → tanpa ID
    description: string;
    equipment_no: string;
}

export interface UpdateDailyActivityPayload {
    po_no: string;
    po_year: number;
    ref_no: string;
    customer_id: number;
    date: string;
    location: string;
    time_from: string;
    time_to: string;
    members: UpdateDailyActivityMember[];
    descriptions: UpdateDailyActivityDescription[];
    prepared_name: string;
    prepared_pos: string;
    acknowledge_name: string;
    acknowledge_pos: string;
}

export interface UpdatedDailyActivityMember {
    id: number;
    employee_id: number;
    employee_name: string;
}

export interface UpdatedDailyDescription {
    id: number;
    description: string;
    equipment_no: string;
}

export interface UpdateDailyActivityResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        po_no: string;
        po_year: string;
        ref_no: string;
        date: string;
        location: string;
        time_from: string;
        time_to: string;
        prepared_name: string;
        prepared_pos: string;
        acknowledge_name: string;
        acknowledge_pos: string;
        members: UpdatedDailyActivityMember[];
        descriptions: UpdatedDailyDescription[];
        created_at: string;
        updated_at: string;
    };
}



export interface GetDailyActivityMember {
    id: number;
    employee_id: number;
    employee_name: string;
}

export interface GetDailyActivityDescription {
    id: number;
    description: string;
    equipment_no: string;
}

export interface GetDailyActivityCustomer {
    id: number;
    customer_no: string;
    name: string;
    phone_number: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export interface GetDailyActivityData {
    id: number;
    po_no: string;
    po_year: string;
    ref_no: string;
    customer: GetDailyActivityCustomer;
    date: string;
    location: string;
    time_from: string;
    time_to: string;
    prepared_name: string;
    prepared_pos: string;
    acknowledge_name: string;
    acknowledge_pos: string;
    members: GetDailyActivityMember[];
    descriptions: GetDailyActivityDescription[];
    created_at: string;
    updated_at: string;
}




// get ALL
export async function getAllDailyActivities(page = 1, search = "") {
    try {
        const res = await fetch(`/api/daily-activities?page=${page}&search=${search}`);

        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetch daily-activities" };
    }
}


export async function createDailyActivity(payload: CreateDailyActivityPayload): Promise<CreateDailyActivityResponse> {
    try {
        const res = await fetch("/api/daily-activities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Error create daily-activities",
            data: null as any
        };
    }
}



export async function updateDailyActivity(
    id: number,
    payload: UpdateDailyActivityPayload
): Promise<UpdateDailyActivityResponse> {
    try {
        const res = await fetch(`/api/daily-activities/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        return await res.json();
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Error update daily activity",
        };
    }
}



export async function getDailyActivityById(
    id: number
): Promise<GetDailyActivityByIdResponse> {
    try {
        const res = await fetch(`/api/daily-activities/${id}`, {
            method: "GET",
        });

        return await res.json();
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Error get daily activity",
        };
    }
}




export async function deleteDailyActivity(id: number) {
    try {
        const res = await fetch(`/api/daily-activities/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete daily activities" };
    }
}