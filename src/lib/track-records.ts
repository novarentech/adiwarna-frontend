// Interface untuk track record item
export interface TrackRecordItem {
    work_order_no: string;
    work_order_year: number;
    date_started: string; // Format YYYY-MM-DD
    workers_name: string;
    scope_of_work: string;
    customer: string;
    work_location: string;
}

// Interface untuk metadata pagination
export interface TrackRecordMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Response yang diterima dari API
export interface TrackRecordResponse {
    success: boolean;
    data: TrackRecordItem[];
    meta: TrackRecordMeta;
}


export async function getAllTrackRecords(page = 1, perPage = 15, search = "", startDate = "", endDate = "", sortBy = "", sortOrder = "asc") {
    try {
        // Menggunakan encodeURIComponent untuk memastikan nilai parameter aman dalam URL
        const encodedSearch = encodeURIComponent(search);

        // Memasukkan semua parameter (page, perPage, search, startDate, endDate, sortBy, sortOrder) ke dalam URL
        const res = await fetch(`/api/track-records?per_page=${perPage}&page=${page}&start_date=${startDate}&end_date=${endDate}&search=${encodedSearch}&sort_by=${sortBy}&sort_order=${sortOrder}`);

        // Parsing response JSON
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching track records" };
    }
}


export async function getAll999TrackRecords(page = 1, perPage = 999999, search = "", startDate = "", endDate = "", sortBy = "", sortOrder = "asc") {
    try {
        // Menggunakan encodeURIComponent untuk memastikan nilai parameter aman dalam URL
        const encodedSearch = encodeURIComponent(search);

        // Memasukkan semua parameter (page, perPage, search, startDate, endDate, sortBy, sortOrder) ke dalam URL
        const res = await fetch(`/api/track-records?per_page=${perPage}&page=${page}&start_date=${startDate}&end_date=${endDate}&search=${encodedSearch}&sort_by=${sortBy}&sort_order=${sortOrder}`);

        // Parsing response JSON
        return await res.json();
    } catch (err: any) {
        return { success: false, message: err.message || "Error fetching track records" };
    }
}