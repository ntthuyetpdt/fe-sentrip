import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewInforPro, exportExcel, exportPDF, updateInforPro } from "../../../api/api";

import { EyeOutlined, FileExcelOutlined, FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { Space, Button, message, Select, Modal } from "antd";

import NVInforPro from "../../components/NVInforPro";

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
  { value: "PENDING",           label: "Chờ xác nhận" },
  { value: "PENDING_PAYMENT",   label: "Chờ thanh toán" },
  { value: "CONFIRM",           label: "Đã xác nhận" },
  { value: "CONFIRMED",         label: "Đã xác nhận (confirmed)" },
  { value: "PAID",              label: "Đã thanh toán" },
  { value: "COMPLETED",         label: "Hoàn thành" },
  { value: "CANCELLED",         label: "Hủy vé" },
  { value: "REFUND_REQUESTED",  label: "Yêu cầu hoàn vé" },
  { value: "REFUNDED",          label: "Hoàn tiền" },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING:          "#faad14",
  PENDING_PAYMENT:  "#1677ff",
  CONFIRM:          "#13c2c2",
  CONFIRMED:        "#13c2c2",
  PAID:             "#52c41a",
  COMPLETED:        "#237804",
  CANCELLED:        "#ff4d4f",
  REFUND_REQUESTED: "#fa8c16",
  REFUNDED:         "#722ed1",
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

      // Cập nhật lại data local, không cần gọi lại API
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
      title: "Trạng thái",
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
          <EditOutlined
            style={{ color: "#1677ff", cursor: "pointer", fontSize: 16 }}
            onClick={() => openUpdateModal(record)}
            title="Cập nhật trạng thái"
          />
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

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          loading={exportingExcel}
          onClick={handleExportExcel}
          style={{ backgroundColor: "#217346", borderColor: "#217346" }}
        >
          Xuất Excel
        </Button>
      </div>

      <CommonTable<OrderInfor>
        columns={columns}
        dataSource={data}
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
          options={STATUS_OPTIONS.map((s) => ({
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