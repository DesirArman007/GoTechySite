// API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// --- Auth Helpers ---

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const loginAdmin = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return response.json();
};

export const verifyAdminToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: getAuthHeaders()
    });
    return response.json();
};

// --- Public APIs ---

export const fetchLatestContent = async () => {
    const response = await fetch(`${API_BASE_URL}/content/latest`);
    return response.json();
};

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
};

export const searchProducts = async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/products/search?productName=${encodeURIComponent(query)}`);
    return response.json();
};

export const fetchTeam = async () => {
    const response = await fetch(`${API_BASE_URL}/team`);
    return response.json();
};

export const fetchAbout = async () => {
    const response = await fetch(`${API_BASE_URL}/about`);
    return response.json();
};

// --- Admin APIs (JWT Protected) ---

export const addTeamMember = async (data: any) => {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };

    // Add JWT auth
    Object.assign(headers, getAuthHeaders());

    const body = isFormData ? data : JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers,
        body
    });
    return response.json();
};

export const addProduct = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteTeamMember = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.json();
};

export const deleteProduct = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.json();
};

export const togglePinProduct = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/pin`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    return response.json();
};

export const updateProduct = async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const updateAbout = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/about`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const addInstagramReel = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/content/instagram`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data
    });
    return response.json();
};

export const deleteInstagramReel = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/content/instagram/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response.json();
};
