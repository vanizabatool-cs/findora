import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");
    const navigate = useNavigate();
    const pendingUserRequest = useRef(null);

    const getUser = useCallback(() => {
        if (pendingUserRequest.current) return pendingUserRequest.current;

        setLoading(true);
        setAuthError("");
        const request = axios.get(`${API_URL}/user`, { withCredentials: true })
            .then((response) => {
                setUser(response.data.user);
                setAuthError("");
                return response.data.user;
            })
            .catch((error) => {
                console.error("Unable to restore the Findora session:", error.message);
                setAuthError("Unable to verify your session. Check your connection and try again.");
                return null;
            })
            .finally(() => {
                pendingUserRequest.current = null;
                setLoading(false);
            });

        pendingUserRequest.current = request;
        return request;
    }, []);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/logout`, {
                withCredentials: true
            });
            setUser(null);
            setAuthError("");
            toast.success(response.data.message);
            navigate("/", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <UserContext.Provider
            value={{ user, setUser, getUser, loading, authError, handleLogout }}
        >
            {children}
        </UserContext.Provider>
    );
};