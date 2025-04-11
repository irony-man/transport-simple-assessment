import React from "react";
import Error from "./Error";

export default function TextArea({
  value,
  label,
  name,
  placeholder,
  type,
  onChange,
  className,
  id,
  error,
  rows = 5,
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <textarea
        type={type}
        value={value}
        name={name}
        id={id}
        className="form-control"
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
        {...props}
      />
      <Error error={error} />
    </div>
  );
}
