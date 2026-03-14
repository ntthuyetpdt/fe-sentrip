import React from "react";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  variant?: "default" | "purple";
  error?: boolean;
  disabled?: boolean; 
  style?: any
}

const CommonInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  variant = "default",
  error = false,
  disabled = false,   
  style
}) => {
  return (
    <div
      className={`common-input 
        ${variant === "purple" ? "common-input--purple" : ""} 
        ${error ? "common-input--error" : ""} 
        ${disabled ? "common-input--disabled" : ""}`}
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        style={style}
      />
    </div>
  );
};

export default CommonInput;