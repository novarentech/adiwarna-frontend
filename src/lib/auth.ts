// LOGINS
export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    usertype: "admin" | "user" | string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface LoginResult {
    success: boolean;
    message: string;
    user?: User;
}

export interface MeResponse {
    token: string | null;
    role: string | null;
}


// LOGOUT
export interface LogoutResponse {
    success: boolean;
    message: string;
}


// GET CURRENT USER
export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    usertype: string;
}

export interface AuthMeResponse {
    success: boolean;
    data: IUser;
}


// helper login
export async function loginRequest(loginData: LoginRequest): Promise<LoginResult> {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    return res.json();
}


// helper logout
export async function logoutRequest(): Promise<LogoutResponse> {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    return res.json();
}


// get current user
export async function getUserProfile(): Promise<AuthMeResponse> {
    const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
    });

    return res.json();
}