import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewInforPro } from "../../../api/api";

import { EyeOutlined } from "@ant-design/icons";
import { Space } from "antd";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<OrderInfor | null>(null);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode"
    },
    {
      title: "Tên KH",
      dataIndex: "fullNameCustomer"
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType"
    },
    {
      title: "Dịch vụ thêm",
      dataIndex: "additionalService"
    },
    {
      title: "Địa chỉ",
      dataIndex: "address"
    },
    {
      title: "Giá",
      dataIndex: "totalAmount",
      render: (price: number) =>
        price?.toLocaleString("vi-VN") + " đ"
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleString("vi-VN")
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
        </Space>
      )
    }
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