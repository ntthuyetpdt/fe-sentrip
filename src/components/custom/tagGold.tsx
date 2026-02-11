import React from "react";
import HangVang from "../../assets/hangvang.png";

interface TagGoldProps {
  style?: React.CSSProperties;
  className?: string;
  hideIcon?: boolean;
}

const TagGold: React.FC<TagGoldProps> = ({
  style,
  className,
  hideIcon = false,
}) => {
  return (
    <div className={`tag-gold ${className ?? ""}`} style={style}>
      {!hideIcon && <img src={HangVang} alt="Hạng vàng" />}
      Hạng vàng
    </div>
  );
};

export default TagGold;
