import React, { useEffect, useState, useMemo } from "react";
import { Space, Tag, Upload, Modal, message, Image, Select } from "antd";
import type { ColumnsType } from "antd/es/table";

import CommonTable from "../../../components/custom/table";
import BtnCustom from "../../../components/custom/button";
import { viewInvoiceMerchant } from "../../../api/api";
import styles from "./GetMerchantDiTien.module.scss";

export interface MerchantPayout {
    id: number;
    orderCode: string;
    merchantId: number;
    merchantName: string;
    bankName: string;
    bankAccount: string;
    orderAmount: number;
    payoutAmount: number;
    status: string;
    billFileUrl: string;
    requestedAt: string;
    processedAt: string;
}

const DOMAIN = process.env.REACT_APP_API_URL;

const STATUS_OPTIONS = [
    { value: "PAID",    label: "Đã thanh toán", color: "#52c41a" },
    { value: "PENDING", label: "Chờ xử lý",     color: "#faad14" },
];

const GetMerchantDiTien: React.FC = () => {
    const [originData, setOriginData] = useState<MerchantPayout[]>([]);
    const [loading, setLoading]       = useState(false);

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedId, setSelectedId]           = useState<number | null>(null);
    const [selectedFile, setSelectedFile]       = useState<File | null>(null);
    const [preview, setPreview]                 = useState<string | null>(null);
    const [uploadLoading, setUploadLoading]     = useState(false);

    // ── Filter state ──────────────────────────────
    const [filterOrderCode, setFilterOrderCode] = useState("");
    const [filterMerchant,  setFilterMerchant]  = useState("");
    const [amountMin,       setAmountMin]        = useState("");
    const [amountMax,       setAmountMax]        = useState("");
    const [filterStatus,    setFilterStatus]     = useState<string | undefined>(undefined);

    const token = localStorage.getItem("access_token");

    // ── Filtered data ─────────────────────────────
    const filteredData = useMemo(() => {
        return originData.filter((item) => {
            if (filterOrderCode.trim() &&
                !item.orderCode.toLowerCase().includes(filterOrderCode.trim().toLowerCase()))
                return false;

            if (filterMerchant.trim() &&
                !item.merchantName.toLowerCase().includes(filterMerchant.trim().toLowerCase()))
                return false;

            if (amountMin !== "" && !isNaN(Number(amountMin)) && item.orderAmount < Number(amountMin))
                return false;

            if (amountMax !== "" && !isNaN(Number(amountMax)) && item.orderAmount > Number(amountMax))
                return false;

            if (filterStatus && item.status !== filterStatus)
                return false;

            return true;
        });
    }, [originData, filterOrderCode, filterMerchant, amountMin, amountMax, filterStatus]);

    const hasActiveFilters =
        filterOrderCode.trim() !== "" ||
        filterMerchant.trim()  !== "" ||
        amountMin  !== ""            ||
        amountMax  !== ""            ||
        filterStatus !== undefined;

    const handleReset = () => {
        setFilterOrderCode("");
        setFilterMerchant("");
        setAmountMin("");
        setAmountMax("");
        setFilterStatus(undefined);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") handleReset();
    };

    // ── API ───────────────────────────────────────
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await viewInvoiceMerchant();
            setOriginData(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const openUploadModal = (id: number) => {
        setSelectedId(id);
        setUploadModalOpen(true);
    };

    const handleUploadOk = async () => {
        if (!selectedFile || !selectedId) {
            message.warning("Vui lòng chọn ảnh");
            return;
        }
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("img", selectedFile);

            const res = await fetch(`${DOMAIN}/payout/process/${selectedId}?img`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const resData = await res.json();
            message.success(resData?.message || "Đi đơn thành công");
            setUploadModalOpen(false);
            setSelectedFile(null);
            setPreview(null);
            fetchData();
        } catch (err) {
            message.error("Đi đơn thất bại");
        } finally {
            setUploadLoading(false);
        }
    };

    const columns: ColumnsType<MerchantPayout> = [
        { title: "Mã đơn",       dataIndex: "orderCode" },
        { title: "Nhà cung cấp",     dataIndex: "merchantName" },
        { title: "Ngân hàng",    dataIndex: "bankName" },
        { title: "Số tài khoản", dataIndex: "bankAccount" },
        {
            title: "Ảnh bill",
            dataIndex: "billFileUrl",
            render: (url: string) =>
                url ? (
                    <Image src={url} width={60} height={60} style={{ objectFit: "cover", borderRadius: 6 }} />
                ) : "Chưa có",
        },
        {
            title: "Số tiền đơn",
            dataIndex: "orderAmount",
            render: (amount: number) =>
                amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Số tiền payout",
            dataIndex: "payoutAmount",
            render: (amount: number) =>
                amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={status === "PAID" ? "green" : "orange"}>{status}</Tag>
            ),
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: "requestedAt",
            render: (date: string) => new Date(date).toLocaleString("vi-VN"),
        },
        {
            title: "Thao tác",
            render: (_: unknown, record: MerchantPayout) => (
                <Space>
                    <BtnCustom
                        text="Thanh toán"
                        disabled={record.status === "PAID"}
                        onClick={() => openUploadModal(record.id)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => { fetchData(); }, []);

    return (
        <div>
            {/* ── Filter bar ── */}
            <div className={styles.filterBar}>

                {/* Mã đơn */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Mã đơn</span>
                    <input
                        className={styles.filterInput}
                        type="text"
                        placeholder="Tìm mã đơn..."
                        value={filterOrderCode}
                        onChange={(e) => setFilterOrderCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={styles.filterDivider} />

                {/* Merchant */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Nhà cung cấp</span>
                    <input
                        className={styles.filterInput}
                        type="text"
                        placeholder="Tìm nhà cung cấp..."
                        value={filterMerchant}
                        onChange={(e) => setFilterMerchant(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={styles.filterDivider} />

                {/* Số tiền đơn */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Số tiền đơn (đ)</span>
                    <div className={styles.priceRangeBox}>
                        <input
                            className={styles.priceInput}
                            type="number"
                            placeholder="Từ"
                            value={amountMin}
                            onChange={(e) => setAmountMin(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span className={styles.priceSeparator}>—</span>
                        <input
                            className={styles.priceInput}
                            type="number"
                            placeholder="Đến"
                            value={amountMax}
                            onChange={(e) => setAmountMax(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className={styles.filterDivider} />

                {/* Trạng thái */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Trạng thái</span>
                    <Select
                        allowClear
                        placeholder="Tất cả"
                        value={filterStatus}
                        onChange={(val) => setFilterStatus(val)}
                        style={{ width: 180, height: 36 }}
                        options={STATUS_OPTIONS.map((s) => ({
                            value: s.value,
                            label: <span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span>,
                        }))}
                    />
                </div>

                {/* Actions */}
                <div className={styles.filterActions}>
                    {hasActiveFilters && (
                        <>
                            <span className={styles.resultCount}>
                                Hiển thị <b>{filteredData.length}</b> / {originData.length} đơn
                            </span>
                            <button className={styles.resetBtn} onClick={handleReset}>
                                ✕ Xóa bộ lọc
                            </button>
                        </>
                    )}
                </div>
            </div>

            <CommonTable<MerchantPayout>
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKeyField="id"
                hideSearch
            />

            <Modal
                title="Upload ảnh xác nhận"
                open={uploadModalOpen}
                onCancel={() => setUploadModalOpen(false)}
                footer={null}
            >
                <Upload
                    beforeUpload={(file) => {
                        setSelectedFile(file);
                        setPreview(URL.createObjectURL(file));
                        return false;
                    }}
                    maxCount={1}
                >
                    <BtnCustom text="Chọn ảnh" />
                </Upload>

                {preview && (
                    <div style={{ marginTop: 16 }}>
                        <Image src={preview} width={200} style={{ borderRadius: 8 }} />
                    </div>
                )}

                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <BtnCustom text="Hủy" onClick={() => setUploadModalOpen(false)} />
                    <BtnCustom text="OK" onClick={handleUploadOk} />
                </div>
            </Modal>
        </div>
    );
};

export default GetMerchantDiTien;