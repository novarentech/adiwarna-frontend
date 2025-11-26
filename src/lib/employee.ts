export interface Employee {
    id: number;
    employee_no: string;
    name: string;
    position: string;
}

export interface GetEmployeeListResponse {
    success: boolean;
    data: {
        data: Employee[];
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}


export async function getEmployees(page: number = 1, search: string = ""): Promise<GetEmployeeListResponse> {
    const res = await fetch(`/api/employees?page=${page}&per_page=15&search=${search}`, {
        method: "GET",
        cache: "no-store",
    });

    return res.json();
}

export async function getEmployeesAllForDropdown(search: string = "", page: number = 1) {
    try {
        const query = `?search=${search}&page=${page}`;

        const res = await fetch(`/api/employees/all${query}`, {
            method: "GET",
            cache: "no-store",
        });

        return await res.json();
    } catch (error) {
        return { success: false, message: "Failed to fetch customers" };
    }
}

export async function createEmployee(payload: {
    employee_no: string;
    name: string;
    position: string;
}) {
    const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return res.json();
}


export async function getEmployeeById(id: string) {
    const res = await fetch(`/api/employees/${id}`, {
        method: "GET",
    });

    return res.json();
}

export async function updateEmployee(id: string, payload: {
    employee_no: string;
    name: string;
    position: string;
}) {
    const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function deleteEmployee(id: number) {
    try {
        const res = await fetch(`/api/employees/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();

        return data;

    } catch (err: any) {
        return { success: false, message: err.message || "Error delete" };
    }
}
