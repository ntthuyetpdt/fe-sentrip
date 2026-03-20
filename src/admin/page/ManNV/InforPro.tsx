import React, { useEffect, useState, useMemo } from "react";
import CommonTable from "../../../components/custom/table";
import { viewInforPro, exportExcel, exportPDF, updateInforPro } from "../../../api/api";

import { EyeOutlined, FileExcelOutlined, FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { Space, Button, message, Select, Modal } from "antd";

import NVInforPro from "../../components/NVInforPro";
import styles from "./InforPro.module.scss";

export interface OrderInfor {
  orderCode: string;
  fullNameCustomer: string;
  createdAt: string;
  serviceType: string;
  additionalService: string;
  address: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string | null;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRM", label: "Đã xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Hủy vé" },
  { value: "REFUND_REQUESTED", label: "Yêu cầu hoàn vé" },
  { value: "REFUNDED", label: "Hoàn tiền" },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#faad14",
  PENDING_PAYMENT: "#1677ff",
  CONFIRM: "#13c2c2",
  CONFIRMED: "#13c2c2",
  PAID: "#52c41a",
  COMPLETED: "#237804",
  CANCELLED: "#ff4d4f",
  REFUND_REQUESTED: "#fa8c16",
  REFUNDED: "#722ed1",
};

const PAYMENT_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "WAITING_FOR_PAYMENT", label: "Chờ thanh toán" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
  { value: "CANCELED", label: "Đã hủy" },
];

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  PENDING: "#faad14",
  WAITING_FOR_PAYMENT: "#1677ff",
  SUCCESS: "#52c41a",
  FAILED: "#ff4d4f",
  CANCELED: "#8c8c8c",
};

const InforPro = () => {
  const [data, setData] = useState<OrderInfor[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<OrderInfor | null>(null);

  // --- Update status state ---
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedForUpdate, setSelectedForUpdate] = useState<OrderInfor | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // --- Filter state ---
  const [filterOrderCode, setFilterOrderCode] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | undefined>(undefined);

  const user_profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
  const role = user_profile.role;

  // --- Filtered data ---
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter mã đơn
      if (
        filterOrderCode.trim() &&
        !item.orderCode.toLowerCase().includes(filterOrderCode.trim().toLowerCase())
      ) {
        return false;
      }

      // Filter khoảng giá
      const hasPriceFilter = priceMin !== "" || priceMax !== "";
      if (hasPriceFilter) {
        if (item.totalAmount === null || item.totalAmount === undefined) return false;
        if (priceMin !== "" && !isNaN(Number(priceMin)) && item.totalAmount < Number(priceMin)) return false;
        if (priceMax !== "" && !isNaN(Number(priceMax)) && item.totalAmount > Number(priceMax)) return false;
      }

      // Filter trạng thái đơn
      if (filterStatus === "CONFIRM") {
        if (item.orderStatus !== "CONFIRM" && item.orderStatus !== "CONFIRMED") return false;
      } else if (filterStatus === "UNCONFIRMED") {
        if (item.orderStatus === "CONFIRM" || item.orderStatus === "CONFIRMED") return false;
      }

      // Filter trạng thái thanh toán
      if (filterPaymentStatus !== undefined) {
        if (filterPaymentStatus === "NONE") {
          if (item.paymentStatus !== null && item.paymentStatus !== undefined) return false;
        } else {
          if (item.paymentStatus !== filterPaymentStatus) return false;
        }
      }

      return true;
    });
  }, [data, filterOrderCode, priceMin, priceMax, filterStatus, filterPaymentStatus]);

  const handleResetFilters = () => {
    setFilterOrderCode("");
    setPriceMin("");
    setPriceMax("");
    setFilterStatus(undefined);
    setFilterPaymentStatus(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setPriceMin("");
      setPriceMax("");
    }
  };

  const handleExportExcel = async () => {
    try {
      setExportingExcel(true);
      const res = await exportExcel();

      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `danh-sach-don-hang-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success("Xuất Excel thành công!");
    } catch (err) {
      console.log(err);
      message.error("Xuất Excel thất bại!");
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPDF = async (orderCode: string) => {
    try {
      setExportingPDF(orderCode);
      const res = await exportPDF(orderCode);

      const pdfUrl = res.data;

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `hoa-don-${orderCode}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success(`Xuất PDF đơn ${orderCode} thành công!`);
    } catch (err) {
      console.log(err);
      message.error("Xuất PDF thất bại!");
    } finally {
      setExportingPDF(null);
    }
  };

  const openUpdateModal = (record: OrderInfor) => {
    setSelectedForUpdate(record);
    setNewStatus(record.orderStatus);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedForUpdate || !newStatus) return;

    try {
      setUpdatingStatus(true);

      await updateInforPro(
        {
          orderCode: selectedForUpdate.orderCode,
          orderStatus: newStatus,
        },
        selectedForUpdate.orderCode
      );

      message.success("Cập nhật trạng thái thành công!");

      setData((prev) =>
        prev.map((item) =>
          item.orderCode === selectedForUpdate.orderCode
            ? { ...item, orderStatus: newStatus }
            : item
        )
      );

      setStatusModalOpen(false);
      setSelectedForUpdate(null);
    } catch (err) {
      console.log(err);
      message.error("Cập nhật trạng thái thất bại!");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
    },
    {
      title: "Tên KH",
      dataIndex: "fullNameCustomer",
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType",
    },
    {
      title: "Dịch vụ thêm",
      dataIndex: "additionalService",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Giá",
      dataIndex: "totalAmount",
      render: (price: number) => price?.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "orderStatus",
      render: (status: string) => {
        const label = STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
        return (
          <span
            style={{
              color: STATUS_COLOR[status] || "#000",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      render: (status: string | null) => {
        if (!status) return <span style={{ color: "#8c8c8c" }}>Chưa có</span>;
        const label =
          PAYMENT_STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
        return (
          <span
            style={{
              color: PAYMENT_STATUS_COLOR[status] || "#000",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      render: (_: any, record: OrderInfor) => (
        <Space>
          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={() => {
              setSelected(record);
              setModalOpen(true);
            }}
          />
          <FilePdfOutlined
            style={{
              color: exportingPDF === record.orderCode ? "gray" : "red",
              cursor: exportingPDF === record.orderCode ? "not-allowed" : "pointer",
              fontSize: 16,
            }}
            onClick={() => {
              if (!exportingPDF) handleExportPDF(record.orderCode);
            }}
            title="Xuất PDF"
          />
          {role !== "ADMIN" && record.paymentStatus === "SUCCESS" && (
            <EditOutlined
              style={{ color: "#1677ff", cursor: "pointer", fontSize: 16 }}
              onClick={() => openUpdateModal(record)}
              title="Cập nhật trạng thái"
            />
          )}
        </Space>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await viewInforPro();
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasActiveFilters =
    filterOrderCode.trim() !== "" ||
    priceMin !== "" ||
    priceMax !== "" ||
    filterStatus !== undefined ||
    filterPaymentStatus !== undefined;

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className={styles.filterBar}>

        {/* Filter: Mã đơn */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Mã đơn</span>
          <input
            className={styles.filterInput}
            type="text"
            placeholder="Tìm mã đơn..."
            value={filterOrderCode}
            onChange={(e) => setFilterOrderCode(e.target.value)}
          />
        </div>

        <div className={styles.filterDivider} />

        {/* Filter: Khoảng giá */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Khoảng giá (đ)</span>
          <div className={styles.priceRangeBox}>
            <input
              className={styles.priceInput}
              type="number"
              placeholder="Từ"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              className={styles.priceInput}
              type="number"
              placeholder="Đến"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className={styles.filterDivider} />

        {/* Filter: Trạng thái đơn */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Trạng thái đơn</span>
          <Select
            allowClear
            placeholder="Tất cả trạng thái"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            style={{ width: 210, height: 36 }}
            options={[
              {
                value: "CONFIRM",
                label: (
                  <span style={{ color: STATUS_COLOR["CONFIRM"], fontWeight: 600 }}>
                    Đã xác nhận
                  </span>
                ),
              },
              {
                value: "UNCONFIRMED",
                label: (
                  <span style={{ color: "#faad14", fontWeight: 600 }}>
                    Chưa xác nhận
                  </span>
                ),
              },
            ]}
          />
        </div>

        <div className={styles.filterDivider} />

        {/* Filter: Trạng thái thanh toán */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Trạng thái TT</span>
          <Select
            allowClear
            placeholder="Tất cả"
            value={filterPaymentStatus}
            onChange={(val) => setFilterPaymentStatus(val)}
            style={{ width: 190, height: 36 }}
            options={[
              {
                value: "NONE",
                label: (
                  <span style={{ color: "#8c8c8c", fontWeight: 600 }}>Chưa có</span>
                ),
              },
              ...PAYMENT_STATUS_OPTIONS.map((s) => ({
                value: s.value,
                label: (
                  <span style={{ color: PAYMENT_STATUS_COLOR[s.value], fontWeight: 600 }}>
                    {s.label}
                  </span>
                ),
              })),
            ]}
          />
        </div>

        {/* Actions */}
        <div className={styles.filterActions}>
          {hasActiveFilters && (
            <>
              <span className={styles.resultCount}>
                Hiển thị <b>{filteredData.length}</b> / {data.length} đơn
              </span>
              <Button className={styles.resetBtn} onClick={handleResetFilters}>
                ✕ Xóa bộ lọc
              </Button>
            </>
          )}
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            loading={exportingExcel}
            onClick={handleExportExcel}
            className={styles.excelBtn}
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <CommonTable<OrderInfor>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKeyField="orderCode"
        hideSearch
      />

      <NVInforPro
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />

      {/* Modal cập nhật trạng thái */}
      <Modal
        title={`Cập nhật trạng thái — ${selectedForUpdate?.orderCode}`}
        open={statusModalOpen}
        onCancel={() => {
          setStatusModalOpen(false);
          setSelectedForUpdate(null);
        }}
        onOk={handleUpdateStatus}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={updatingStatus}
        width={420}
      >
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <span style={{ fontWeight: 500 }}>Trạng thái mới:</span>
        </div>
        <Select
          style={{ width: "100%" }}
          value={newStatus}
          onChange={(val) => setNewStatus(val)}
          options={STATUS_OPTIONS
            .filter((s) => s.value === "CONFIRM")
            .map((s) => ({
              value: s.value,
              label: (
                <span style={{ color: STATUS_COLOR[s.value], fontWeight: 600 }}>
                  {s.label}
                </span>
              ),
            }))}
        />
      </Modal>
    </div>
  );
};

export default InforPro;