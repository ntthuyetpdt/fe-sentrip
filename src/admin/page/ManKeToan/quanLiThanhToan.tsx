import React, { useEffect, useState, useMemo } from "react";
import { Space, Tag, Upload, Button, message, Modal, Select } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import GetHoaDonModal from "../../components/GetHoaDonModal";
import { viewInvoice } from "../../../api/api";
import ButtonCustom from "../../../components/custom/button";
import styles from "./GetHoaDon.module.scss";

export interface Invoice {
  amount: number;
  fileName: string;
  fileUrl: string;
  generatedAt: string;
  invoiceCode: string;
  orderCode: string;
  status: string;
}

const DOMAIN = process.env.REACT_APP_API_URL;

const TIME_OPTIONS = [
  { value: "ALL",    label: "Tất cả thời gian" },
  { value: "TODAY",  label: "Hôm nay" },
  { value: "7DAYS",  label: "7 ngày gần đây" },
  { value: "30DAYS", label: "30 ngày gần đây" },
];

const STATUS_OPTIONS = [
  { value: "UNPAID",                 label: "Chưa thanh toán",       color: "#ff4d4f" },
  { value: "INVOICE_HAS_BEEN_ISSUED", label: "Đã xuất hóa đơn",      color: "#1677ff" },
  { value: "GENERATED",              label: "Đã tạo hóa đơn",        color: "#52c41a" },
];

const STATUS_COLOR: Record<string, string> = {
  UNPAID:                  "#ff4d4f",
  INVOICE_HAS_BEEN_ISSUED: "#1677ff",
  GENERATED:               "#52c41a",
};

const STATUS_LABEL: Record<string, string> = {
  UNPAID:                  "Chưa thanh toán",
  INVOICE_HAS_BEEN_ISSUED: "Đã xuất hóa đơn",
  GENERATED:               "Đã tạo hóa đơn",
};

const GetHoaDon = () => {
  const [originData, setOriginData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadOrderCode, setUploadOrderCode] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ── Filter state ──────────────────────────────
  const [filterInvoiceCode, setFilterInvoiceCode] = useState("");
  const [filterOrderCode, setFilterOrderCode] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState("ALL");

  const token = localStorage.getItem("access_token");

  // ── Filtered data ─────────────────────────────
  const filteredData = useMemo(() => {
    const now = new Date();

    return originData.filter((item) => {
      // Mã hóa đơn
      if (
        filterInvoiceCode.trim() &&
        !item.invoiceCode.toLowerCase().includes(filterInvoiceCode.trim().toLowerCase())
      ) return false;

      // Mã đơn hàng
      if (
        filterOrderCode.trim() &&
        !item.orderCode.toLowerCase().includes(filterOrderCode.trim().toLowerCase())
      ) return false;

      // Số tiền
      if (amountMin !== "" && !isNaN(Number(amountMin)) && item.amount < Number(amountMin))
        return false;
      if (amountMax !== "" && !isNaN(Number(amountMax)) && item.amount > Number(amountMax))
        return false;

      // Trạng thái
      if (filterStatus && item.status !== filterStatus) return false;

      // Thời gian
      if (timeFilter !== "ALL") {
        const date = new Date(item.generatedAt);
        if (timeFilter === "TODAY") {
          if (
            date.getDate() !== now.getDate() ||
            date.getMonth() !== now.getMonth() ||
            date.getFullYear() !== now.getFullYear()
          ) return false;
        }
        if (timeFilter === "7DAYS") {
          const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
          if (diff > 7) return false;
        }
        if (timeFilter === "30DAYS") {
          const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
          if (diff > 30) return false;
        }
      }

      return true;
    });
  }, [originData, filterInvoiceCode, filterOrderCode, amountMin, amountMax, filterStatus, timeFilter]);

  const hasActiveFilters =
    filterInvoiceCode.trim() !== "" ||
    filterOrderCode.trim() !== "" ||
    amountMin !== "" ||
    amountMax !== "" ||
    filterStatus !== undefined ||
    timeFilter !== "ALL";

  const handleReset = () => {
    setFilterInvoiceCode("");
    setFilterOrderCode("");
    setAmountMin("");
    setAmountMax("");
    setFilterStatus(undefined);
    setTimeFilter("ALL");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") handleReset();
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await viewInvoice();
      if (res?.data) {
        setOriginData(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInput = async (file: File, orderCode: string) => {
    try {
      const formData = new FormData();
      formData.append("orderCode", orderCode);
      formData.append("file", file);

      const res = await fetch(`${DOMAIN}/invoice/submit-input`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      message.success(data?.message || "Gửi đơn vị thành công");
      fetchInvoices();
    } catch (err) {
      console.log(err);
      message.error("Gửi đơn vị thất bại");
    }
  };

  const openUploadModal = (orderCode: string) => {
    setUploadOrderCode(orderCode);
    setUploadModalOpen(true);
  };

  const handleUploadOk = async () => {
    if (!selectedFile || !uploadOrderCode) {
      message.warning("Vui lòng chọn file");
      return;
    }
    await handleSubmitInput(selectedFile, uploadOrderCode);
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  const columns = [
    { title: "Mã hóa đơn", dataIndex: "invoiceCode" },
    { title: "Mã đơn hàng", dataIndex: "orderCode" },
    {
      title: "Số tiền",
      dataIndex: "amount",
      render: (amount: number) =>
        amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const label = STATUS_LABEL[status] || status;
        const color = STATUS_COLOR[status] || "default";
        return (
          <Tag color={color === "#ff4d4f" ? "red" : color === "#1677ff" ? "blue" : "green"}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "generatedAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      render: (_: any, record: Invoice) => (
        <Space>
          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={() => { setSelected(record); setModalOpen(true); }}
          />
          <Button
            size="small"
            icon={<UploadOutlined />}
            className="btn-submit-unit"
            onClick={() => openUploadModal(record.orderCode)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => { fetchInvoices(); }, []);

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className={styles.filterBar}>

        {/* Mã hóa đơn */}
        {/* <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Mã hóa đơn</span>
          <input
            className={styles.filterInput}
            type="text"
            placeholder="Tìm mã hóa đơn..."
            value={filterInvoiceCode}
            onChange={(e) => setFilterInvoiceCode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div> */}

        <div className={styles.filterDivider} />

        {/* Mã đơn hàng */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Mã đơn hàng</span>
          <input
            className={styles.filterInput}
            type="text"
            placeholder="Tìm mã đơn hàng..."
            value={filterOrderCode}
            onChange={(e) => setFilterOrderCode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.filterDivider} />

        {/* Số tiền */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Số tiền (đ)</span>
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
            style={{ width: 200, height: 36 }}
            options={STATUS_OPTIONS.map((s) => ({
              value: s.value,
              label: <span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span>,
            }))}
          />
        </div>

        <div className={styles.filterDivider} />

        {/* Thời gian */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Thời gian</span>
          <Select
            value={timeFilter}
            onChange={(val) => setTimeFilter(val)}
            style={{ width: 170, height: 36 }}
            options={TIME_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
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

      <CommonTable<Invoice>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKeyField="invoiceCode"
        hideSearch
      />

      <GetHoaDonModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />

      <Modal
        title="Up vé file KT"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
      >
        <Upload
          beforeUpload={(file) => { setSelectedFile(file); return false; }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn file</Button>
        </Upload>

        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <ButtonCustom text="Hủy" onClick={() => setUploadModalOpen(false)} />
          <ButtonCustom text="Gửi" onClick={handleUploadOk} />
        </div>
      </Modal>
    </div>
  );
};

export default GetHoaDon;