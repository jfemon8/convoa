import api from "../lib/api";

export const loginUser = async ({ phone, name }) => {
    const response = await api.post("/auth/login", {
        phone,
        name,
    });

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};
