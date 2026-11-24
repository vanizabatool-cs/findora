import { useState } from "react";

export default function OtpInput({
    length = 6,
    onChange,
    disabled = false
}) {
    const [otp, setOtp] = useState("");

    const handleChange = (e) => {
        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, length);

        setOtp(value);
        onChange(value);
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            maxLength={length}
            value={otp}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Enter OTP"
        />
    );
}
