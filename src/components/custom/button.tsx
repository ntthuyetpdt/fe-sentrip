interface PropsButton {
  text: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ButtonCustom = ({
  text, 
  className,
  onClick,
  disabled = false,
}: PropsButton) => {
  return (
    <button
      className={`btnCustom ${className ?? ""} ${disabled ? "btnCustom--disabled" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default ButtonCustom;
