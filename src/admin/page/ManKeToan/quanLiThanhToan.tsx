import React, { useEffect, useState } from "react";
import { Space, Tag, Row, Col, Upload, Button, message, Modal } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import CommonSelect from "../../../components/custom/select";

import GetHoaDonModal from "../../components/GetHoaDonModal";

import { viewInvoice } from "../../../api/api";
import ButtonCustom from "../../../components/custom/button";

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
  { value: "ALL", label: "Tất cả" },
  { value: "TODAY", label: "Hôm nay" },
  { value: "7DAYS", label: "7 ngày gần đây" },
  { value: "30DAYS", label: "30 ngày gần đây" }
];

const GetHoaDon = () => {

  const [data, setData] = useState<Invoice[]>([]);
  const [originData, setOriginData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadOrderCode, setUploadOrderCode] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const token = localStorage.getItem("access_token");

  const fetchInvoices = async () => {
    try {

      setLoading(true);

      const res = await viewInvoice();

      if (res?.data) {
        setData(res.data);
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
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

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
    {
      title: "Mã hóa đơn",
      dataIndex: "invoiceCode"
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode"
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      render: (amount: number) =>
        amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "PAID" ? "green" : "red"}>
          {status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      )
    },
    {
      title: "Ngày tạo",
      dataIndex: "generatedAt",
      render: (date: string) =>
        new Date(date).toLocaleString("vi-VN")
    },
    {
      title: "Thao tác",
      render: (_: any, record: Invoice) => (
        <Space>

          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={() => {
              setSelected(record);
              setModalOpen(true);
            }}
          />

          <Button
            size="small"
            icon={<UploadOutlined />}
            className="btn-submit-unit"
            onClick={() => openUploadModal(record.orderCode)}
          >
          </Button>



        </Space>
      )
    }
  ];

  const handleSearch = () => {

    if (!searchValue.trim()) {
      setData(originData);
      return;
    }

    const filtered = originData.filter(
      (item) =>
        item.invoiceCode.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.orderCode.toLowerCase().includes(searchValue.toLowerCase())
    );

    setData(filtered);

  };

  const handleFilterTime = (value: string) => {

    setTimeFilter(value);

    if (value === "ALL") {
      setData(originData);
      return;
    }

    const now = new Date();

    const filtered = originData.filter((item) => {

      const date = new Date(item.generatedAt);

      if (value === "TODAY") {

        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );

      }

      if (value === "7DAYS") {

        const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
        return diff <= 7;

      }

      if (value === "30DAYS") {

        const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
        return diff <= 30;

      }

      return true;

    });

    setData(filtered);

  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>

      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <CommonSelect
            value={timeFilter}
            options={TIME_OPTIONS}
            placeholder="Lọc theo thời gian"
            onChange={handleFilterTime}
          />
        </Col>
      </Row>

      <CommonTable<Invoice>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKeyField="invoiceCode"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchClick={handleSearch}
      />

      <GetHoaDonModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />

      <Modal
        title="Gửi file, đi tiền"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
      >

        <Upload
          beforeUpload={(file) => {
            setSelectedFile(file);
            return false;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            Chọn file
          </Button>
        </Upload>

        <div style={{ marginTop: 20, textAlign: "right", display: "flex", gap: 10, justifyContent: "flex-end" }}>

          <ButtonCustom
            text="Hủy"
            onClick={() => setUploadModalOpen(false)}
          />

          <ButtonCustom
            text="Gửi"
            onClick={handleUploadOk}
          />

        </div>

      </Modal>

    </div>
  );

};

export default GetHoaDon;