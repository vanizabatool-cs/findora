import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OtpInput from "./OtpInput";
import { API_URL } from "../utils/api";

export default function VerifyEmail() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleVerify = async () => {

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                `${API_URL}/user/verify-otp`,
                {
                    email,
                    otp
                },
                {
                    withCredentials: true
                }
            );
            setMessage(response.data.message);
            navigate("/");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "OTP verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-container">
            <h2>Verify Your Email</h2>
            <p>Enter the OTP sent to {email}</p>
            <OtpInput
                length={6}
                onChange={setOtp}
                disabled={loading}
            />
            <button
                onClick={handleVerify}
                disabled={otp.length !== 6 || loading}
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p>{message}</p>

        </div>
    );
}