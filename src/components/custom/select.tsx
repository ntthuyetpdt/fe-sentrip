import { Select } from "antd";
import type { SelectProps } from "antd";

interface OptionType {
  label: string;
  value: string;
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: OptionType[];
  variant?: "default" | "purple";
  error?: boolean;
  disabled?: boolean;
}

const CommonSelect = ({
  value,
  onChange,
  placeholder,
  options,
  variant = "default",
  error = false,
  disabled = false,
}: Props) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      disabled={disabled}

    />
  );
};

export default CommonSelect;