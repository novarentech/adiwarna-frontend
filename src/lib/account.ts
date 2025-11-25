// GET ACCOUNT
export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    usertype: string;
}

export interface UsersListResponse {
    success: boolean;
    data: {
        data: IUser[];
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// CREATE ACCOUNT
export interface CreateUserPayload {
    name: string;
    email: string;
    phone: string;
    usertype: string;
    password: string;
    password_confirmation: string;
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        name: string;
        email: string;
        phone: string;
        usertype: string;
    };
}


export interface DeleteUserResponse {
    success: boolean;
    message: string;
}



export async function getUsersList(page = 1, perPage = 10): Promise<UsersListResponse> {
    const res = await fetch(`/api/users?page=${page}&per_page=${perPage}`, {
        method: "GET",
        cache: "no-store",
    });

    return res.json();
}

export async function getUserById(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    return res.json();
}

export async function updateUser(id: string, body: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return res.json();
}




export async function createUser(data: CreateUserPayload): Promise<CreateUserResponse> {
    const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
    });

    return res.json();
}


export async function deleteUser(id: number): Promise<DeleteUserResponse> {
    const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
    });

    const data = await res.json();
    return data;
}