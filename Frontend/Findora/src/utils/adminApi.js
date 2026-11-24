import axios from "axios";
import { API_URL } from "./api";

const requestConfig = { withCredentials: true };

export async function fetchAdminData() {
    const [usersResponse, itemsResponse, matchesResponse] = await Promise.all([
        axios.get(`${API_URL}/user/admin/users`, requestConfig),
        axios.get(`${API_URL}/item/admin/all`, requestConfig),
        axios.get(`${API_URL}/item/admin/matches`, requestConfig)
    ]);

    return {
        users: usersResponse.data.users,
        items: itemsResponse.data.Items,
        matches: matchesResponse.data.matches
    };
}

export async function deleteAdminUser(id) {
    return axios.delete(`${API_URL}/user/admin/users/${id}`, requestConfig);
}

export async function deleteAdminItem(id) {
    return axios.delete(`${API_URL}/item/admin/${id}`, requestConfig);
}

export async function updateAdminItemStatus(id, status) {
    return axios.patch(
        `${API_URL}/item/admin/${id}/status`,
        { status },
        requestConfig
    );
}

export async function updateAdminMatch(id, action) {
    return axios.patch(
        `${API_URL}/item/admin/matches/${id}`,
        { action },
        requestConfig
    );
}
