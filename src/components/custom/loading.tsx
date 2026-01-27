import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";

const indicator = (
    <LoadingOutlined spin style={{ fontSize: 100, color: "var(--pinkGlobal)" }} />
);

const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
};

const LoadingOverlay = () => (
    <div style={overlayStyle}>
        <Spin size="large" tip="Loading..." indicator={indicator} />
    </div>
);

export default LoadingOverlay;
