import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewCutomerOrdered, viewMerchanKHDetails } from "../../../api/api";

import { EyeOutlined } from "@ant-design/icons";
import { Space } from "antd";
import dayjs from "dayjs";

import QuanLiKhachHangDaMuaModal, {
  CustomerOrderDetail
} from "../../components/QLKHDAMUA";

export interface CustomerOrderItem {
  orderCode: string;
  fullName: string;
  phone: string;
  productName: string;
  quantity: number;
  price: number;
  createdAt: string;
}

const QuanLiKhachHangDaMua = () => {

  const [data, setData] = useState<CustomerOrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<CustomerOrderDetail | null>(null);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode"
    },
    {
      title: "Tên KH",
      dataIndex: "fullName"
    },
    {
      title: "SĐT",
      dataIndex: "phone"
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName"
    },
    {
      title: "Số lượng",
      dataIndex: "quantity"
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      render: (value: number) =>
        value?.toLocaleString("vi-VN") + " đ"
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: string) =>
        dayjs(value).format("DD/MM/YYYY HH:mm")
    },
    {
      title: "Thao tác",
      render: (_: any, record: CustomerOrderItem) => (
        <Space>
          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={async () => {
              try {

                const res = await viewMerchanKHDetails(record.orderCode);

                if (res) {
                  setSelected(res);
                  setModalOpen(true);
                }

              } catch (error) {
                console.log(error);
              }
            }}
          />
        </Space>
      )
    }
  ];

  const fetchData = async () => {
    try {

      setLoading(true);

      const res = await viewCutomerOrdered();

      if (res) {
        setData(res.data);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>

      <CommonTable<CustomerOrderItem>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKeyField="orderCode"
        hideSearch
      />

      <QuanLiKhachHangDaMuaModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => {
          setModalOpen(false);
          setSelected(null);
        }}
      />

    </div>
  );
};

export default QuanLiKhachHangDaMua;