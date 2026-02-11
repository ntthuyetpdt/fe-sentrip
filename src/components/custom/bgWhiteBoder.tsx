import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const BgWhiteBorder: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={`bg-white-border ${className || ""}`}>
      {children}
    </div>
  );
};

export default BgWhiteBorder;
