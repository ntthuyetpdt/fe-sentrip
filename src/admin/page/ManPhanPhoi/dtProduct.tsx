import React, { useEffect, useState } from "react";
import { Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import { viewMerProInfor } from "../../../api/api";

import GetDoanhThuProModal from "../../components/ProductStatisticModal";

export interface ProductStatistics {
  productId: number;
  productName: string;
  additionalServices: string;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

const GetDoanhThuPro = () => {

  const [data, setData] = useState<ProductStatistics[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ProductStatistics | null>(null);

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName"
    },
    {
      title: "Dịch vụ kèm",
      dataIndex: "additionalServices"
    },
    {
      title: "Số khách",
      dataIndex: "totalCustomers"
    },
    {
      title: "Số đơn",
      dataIndex: "totalOrders"
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      render: (value: number | string) => {
        const revenue = Number(value || 0);
        return revenue.toLocaleString("vi-VN") + " VNĐ";
      }
    },
    {
      title: "Thao tác",
      render: (_: any, record: ProductStatistics) => (
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

  const fetchProducts = async () => {
    try {

      setLoading(true);

      const res = await viewMerProInfor();

      if (Array.isArray(res?.data)) {
        setData(res.data);
      } else if (Array.isArray(res)) {
        setData(res);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>

      <CommonTable<ProductStatistics>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKeyField="productId"
        hideSearch
      />

      <GetDoanhThuProModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
};

export default GetDoanhThuPro;