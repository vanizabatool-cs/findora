const configuredApiUrl = import.meta.env.VITE_API_URL || "/api";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return `${API_URL}${imageUrl}`;
    return imageUrl;
};
