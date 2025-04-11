import React from "react";
import Error from "./Error";

export default function TextField({
  value,
  label,
  name,
  placeholder,
  type,
  onChange,
  className,
  id,
  error,
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <input
        type={type}
        value={value}
        name={name}
        id={id}
        className="form-control"
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
      <Error error={error} />
    </div>
  );
}
