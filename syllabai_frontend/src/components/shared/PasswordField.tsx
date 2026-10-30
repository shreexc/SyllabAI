"use client";

import { useState, type ChangeEvent } from "react";

interface PasswordFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  required = true,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-field password-field">
      <label className="field-label" htmlFor={id}>Password</label>
      <span className="password-input-wrap">
        <input
          className="field-input"
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
        <button
          className="password-visibility"
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
              <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.5 5.6 8.5 5.6a8.6 8.6 0 0 1-3.1 3.4M6.2 6.2C3.9 7.7 2.5 10 2.5 10s3.3 5.6 9.5 5.6c.8 0 1.5-.1 2.2-.3" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M2.5 12S5.8 6.4 12 6.4 21.5 12 21.5 12 18.2 17.6 12 17.6 2.5 12 2.5 12Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
        </button>
      </span>
    </div>
  );
}
