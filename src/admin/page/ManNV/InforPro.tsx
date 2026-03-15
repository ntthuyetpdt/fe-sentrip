import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewInforPro, exportExcel, exportPDF } from "../../../api/api";

import { EyeOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Space, Button, message } from "antd";

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

const InforPro = () => {
  const [data, setData] = useState<OrderInfor[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<OrderInfor | null>(null);

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
      {/* Nút xuất Excel đặt phía trên bảng */}
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
    </div>
  );
};

export default InforPro;