import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewProStatus, diDonProStatus } from "../../../api/api";

import { SendOutlined, SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Space, message, Popconfirm, Tag, Image } from "antd";

export interface ProStatus {
    bankAccount: string;
    bankName: string;
    billFileUrl: string;
    id: number;
    merchantId: number;
    merchantName: string;
    orderAmount: number;
    orderCode: string;
    payoutAmount: number;
    processedAt: string;
    requestedAt: string;
    status: string;
}

const STATUS_COLOR: Record<string, string> = {
    SUCCESS: "green",
    PENDING: "orange",
    PROCESSING: "blue",
    REJECTED: "red",
    PAID: "cyan",
};

const STATUS_LABEL: Record<string, string> = {
    SUCCESS: "Thành công",
    PENDING: "Chờ xử lý",
    PROCESSING: "Đang xử lý",
    REJECTED: "Từ chối",
    PAID: "Đã thanh toán",
};

const filterStyles = `
  .kttt-filter-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 60%, #ede9fe 100%);
    border-radius: 12px;
    border: 1px solid #ddd6fe;
    box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08);
    align-items: flex-end;
    position: relative;
    overflow: hidden;
  }

  .kttt-filter-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 24px,
      rgba(167, 139, 250, 0.04) 24px,
      rgba(167, 139, 250, 0.04) 48px
    );
    pointer-events: none;
  }

  .kttt-filter-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
    z-index: 1;
  }

  .kttt-filter-field__label {
    font-size: 11px;
    font-weight: 700;
    color: #7c3aed;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding-left: 2px;
  }

  /* Text input with icon */
  .kttt-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .kttt-input-wrap .kttt-input-icon {
    position: absolute;
    left: 10px;
    color: #c4b5fd;
    font-size: 13px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .kttt-input-wrap:focus-within .kttt-input-icon {
    color: #8b5cf6;
  }

  .kttt-text-input {
    height: 34px;
    padding: 0 12px 0 30px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    background: rgba(255, 255, 255, 0.85);
    width: 160px;
    color: #3b1fa8;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .kttt-text-input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .kttt-text-input:focus {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .kttt-text-input:hover:not(:focus) {
    border-color: #a78bfa;
  }

  /* Range box */
  .kttt-range {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 12px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.85);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .kttt-range:focus-within {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .kttt-range:hover:not(:focus-within) {
    border-color: #a78bfa;
  }

  .kttt-range__input {
    border: none;
    outline: none;
    width: 80px;
    font-size: 13.5px;
    background: transparent;
    color: #3b1fa8;
  }

  .kttt-range__input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .kttt-range__input::-webkit-outer-spin-button,
  .kttt-range__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .kttt-range__input[type=number] {
    -moz-appearance: textfield;
  }

  .kttt-range__sep {
    color: #c4b5fd;
    font-weight: 700;
    font-size: 14px;
    user-select: none;
  }

  /* Select */
  .kttt-select {
    height: 34px;
    padding: 0 10px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    background: rgba(255, 255, 255, 0.85);
    width: 160px;
    color: #3b1fa8;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  }

  .kttt-select:focus {
    border-color: #8b5cf6;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .kttt-select:hover:not(:focus) {
    border-color: #a78bfa;
  }

  /* Clear button */
  .kttt-clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 14px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.7);
    color: #7c3aed;
    transition: all 0.2s;
    position: relative;
    z-index: 1;
    align-self: flex-end;
  }

  .kttt-clear-btn:hover {
    background: #fff;
    border-color: #8b5cf6;
    color: #5b21b6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.18);
    transform: translateY(-1px);
  }

  .kttt-clear-btn:active {
    transform: translateY(0);
  }

  /* Send action icon */
  .kttt-send-active {
    font-size: 17px;
    color: #1677ff;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }

  .kttt-send-active:hover {
    opacity: 0.75;
    transform: scale(1.2);
  }

  .kttt-send-disabled {
    font-size: 17px;
    color: #d9d9d9;
    cursor: not-allowed;
  }
`;

const KiemTraTrangThaiDon = () => {
    const [data, setData] = useState<ProStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [dispatchingCode, setDispatchingCode] = useState<string | null>(null);

    const [filterOrderCode, setFilterOrderCode] = useState("");
    const [orderAmountMin, setOrderAmountMin] = useState("");
    const [orderAmountMax, setOrderAmountMax] = useState("");
    const [payoutAmountMin, setPayoutAmountMin] = useState("");
    const [payoutAmountMax, setPayoutAmountMax] = useState("");
    const [requestedAtFrom, setRequestedAtFrom] = useState("");
    const [requestedAtTo, setRequestedAtTo] = useState("");
    const [processedAtFrom, setProcessedAtFrom] = useState("");
    const [processedAtTo, setProcessedAtTo] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const hasFilter =
        filterOrderCode || orderAmountMin || orderAmountMax ||
        payoutAmountMin || payoutAmountMax ||
        requestedAtFrom || requestedAtTo ||
        processedAtFrom || processedAtTo ||
        filterStatus;

    const clearFilters = () => {
        setFilterOrderCode("");
        setOrderAmountMin(""); setOrderAmountMax("");
        setPayoutAmountMin(""); setPayoutAmountMax("");
        setRequestedAtFrom(""); setRequestedAtTo("");
        setProcessedAtFrom(""); setProcessedAtTo("");
        setFilterStatus("");
    };

    const filteredData = data.filter((item) => {
        const matchOrderCode = item.orderCode.toLowerCase().includes(filterOrderCode.toLowerCase());

        let matchOrderAmount = true;
        if (orderAmountMin !== "" && orderAmountMax !== "") {
            matchOrderAmount = item.orderAmount >= Number(orderAmountMin) && item.orderAmount <= Number(orderAmountMax);
        } else if (orderAmountMin !== "") {
            matchOrderAmount = item.orderAmount >= Number(orderAmountMin);
        } else if (orderAmountMax !== "") {
            matchOrderAmount = item.orderAmount <= Number(orderAmountMax);
        }

        let matchPayoutAmount = true;
        if (payoutAmountMin !== "" && payoutAmountMax !== "") {
            matchPayoutAmount = item.payoutAmount >= Number(payoutAmountMin) && item.payoutAmount <= Number(payoutAmountMax);
        } else if (payoutAmountMin !== "") {
            matchPayoutAmount = item.payoutAmount >= Number(payoutAmountMin);
        } else if (payoutAmountMax !== "") {
            matchPayoutAmount = item.payoutAmount <= Number(payoutAmountMax);
        }

        let matchRequestedAt = true;
        if (requestedAtFrom || requestedAtTo) {
            const d = new Date(item.requestedAt).getTime();
            if (requestedAtFrom) matchRequestedAt = d >= new Date(requestedAtFrom).getTime();
            if (requestedAtTo) matchRequestedAt = matchRequestedAt && d <= new Date(requestedAtTo + "T23:59:59").getTime();
        }

        let matchProcessedAt = true;
        if (processedAtFrom || processedAtTo) {
            const d = new Date(item.processedAt).getTime();
            if (processedAtFrom) matchProcessedAt = d >= new Date(processedAtFrom).getTime();
            if (processedAtTo) matchProcessedAt = matchProcessedAt && d <= new Date(processedAtTo + "T23:59:59").getTime();
        }

        const matchStatus = filterStatus ? item.status === filterStatus : true;

        return matchOrderCode && matchOrderAmount && matchPayoutAmount && matchRequestedAt && matchProcessedAt && matchStatus;
    });

    const handleDiTien = async (orderCode: string) => {
        try {
            setDispatchingCode(orderCode);
            await diDonProStatus(orderCode);
            message.success(`Đã đi tiền đơn ${orderCode} thành công!`);
            setData((prev) =>
                prev.map((item) =>
                    item.orderCode === orderCode ? { ...item, status: "SUCCESS" } : item
                )
            );
        } catch (err) {
            console.log(err);
            message.error("Đi tiền thất bại!");
        } finally {
            setDispatchingCode(null);
        }
    };

    const columns = [
        { title: "Mã đơn", dataIndex: "orderCode" },
        {
            title: "Người nhận",
            dataIndex: "merchantName",
            render: (val: string) => <div style={{ fontWeight: 600 }}>{val}</div>,
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
            render: (val: string, record: ProStatus) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{val}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{record.bankAccount}</div>
                </div>
            ),
        },
        {
            title: "Tiền đơn hàng",
            dataIndex: "orderAmount",
            render: (val: number) =>
                val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Tiền thanh toán",
            dataIndex: "payoutAmount",
            render: (val: number) =>
                val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Ảnh bill",
            dataIndex: "billFileUrl",
            render: (url: string) =>
                url ? (
                    <Image src={url} alt="bill" width={60} height={60} style={{ objectFit: "cover", borderRadius: 6 }} />
                ) : (
                    <span style={{ color: "#ccc" }}>—</span>
                ),
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: "requestedAt",
            render: (date: string) => date ? new Date(date).toLocaleString("vi-VN") : "—",
        },
        {
            title: "Ngày xử lý",
            dataIndex: "processedAt",
            render: (date: string) => date ? new Date(date).toLocaleString("vi-VN") : "—",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={STATUS_COLOR[status] || "default"}>
                    {STATUS_LABEL[status] || status}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            render: (_: any, record: ProStatus) => {
                const canPay = record.status !== "SUCCESS";
                const isDispatching = dispatchingCode === record.orderCode;
                return (
                    <Space>
                        <Popconfirm
                            title="Xác nhận đi tiền?"
                            description="Yêu cầu đi tiền đến kế toán"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            disabled={!canPay || isDispatching}
                            onConfirm={() => handleDiTien(record.orderCode)}
                        >
                            <SendOutlined
                                className={canPay && !isDispatching ? "kttt-send-active" : "kttt-send-disabled"}
                                style={{ opacity: isDispatching ? 0.5 : 1 }}
                                title={canPay ? "Đi tiền" : "Đã hoàn thành"}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await viewProStatus();
            if (res?.data) setData(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <style>{filterStyles}</style>

            {/* Filter bar */}
            <div className="kttt-filter-panel">

                {/* Mã đơn */}
                <div className="kttt-filter-field">
                    <span className="kttt-filter-field__label">Mã đơn</span>
                    <div className="kttt-input-wrap">
                        <SearchOutlined className="kttt-input-icon" />
                        <input
                            type="text"
                            placeholder="Tìm mã đơn..."
                            value={filterOrderCode}
                            onChange={(e) => setFilterOrderCode(e.target.value)}
                            className="kttt-text-input"
                        />
                    </div>
                </div>

                {/* Tiền đơn hàng */}
                <div className="kttt-filter-field">
                    <span className="kttt-filter-field__label">Tiền đơn hàng</span>
                    <div className="kttt-range">
                        <input
                            type="number"
                            placeholder="Từ"
                            value={orderAmountMin}
                            onChange={(e) => setOrderAmountMin(e.target.value)}
                            className="kttt-range__input"
                        />
                        <span className="kttt-range__sep">—</span>
                        <input
                            type="number"
                            placeholder="Đến"
                            value={orderAmountMax}
                            onChange={(e) => setOrderAmountMax(e.target.value)}
                            className="kttt-range__input"
                        />
                    </div>
                </div>

                {/* Tiền thanh toán */}
                <div className="kttt-filter-field">
                    <span className="kttt-filter-field__label">Tiền thanh toán</span>
                    <div className="kttt-range">
                        <input
                            type="number"
                            placeholder="Từ"
                            value={payoutAmountMin}
                            onChange={(e) => setPayoutAmountMin(e.target.value)}
                            className="kttt-range__input"
                        />
                        <span className="kttt-range__sep">—</span>
                        <input
                            type="number"
                            placeholder="Đến"
                            value={payoutAmountMax}
                            onChange={(e) => setPayoutAmountMax(e.target.value)}
                            className="kttt-range__input"
                        />
                    </div>
                </div>

                {/* Trạng thái */}
                <div className="kttt-filter-field">
                    <span className="kttt-filter-field__label">Trạng thái</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="kttt-select"
                    >
                        <option value="">Tất cả</option>
                        {Object.entries(STATUS_LABEL).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Xoá lọc */}
                {hasFilter && (
                    <button className="kttt-clear-btn" onClick={clearFilters}>
                        <CloseCircleOutlined />
                        Xoá lọc
                    </button>
                )}

            </div>

            <CommonTable<ProStatus>
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKeyField="id"
                hideSearch
            />
        </div>
    );
};

export default KiemTraTrangThaiDon;