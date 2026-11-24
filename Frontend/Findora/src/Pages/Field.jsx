import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

// `suffix` renders extra content (like a Send OTP button) inside the input box.
export default function Field({ label, icon, type = "text", error, id, suffix, ...rest }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field__box">
        {icon}
        <input id={id} type={isPassword && show ? "text" : type} {...rest} />
        {suffix}
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
      {error && <p className="field__error">{error}</p>}
    </div>
  );
}