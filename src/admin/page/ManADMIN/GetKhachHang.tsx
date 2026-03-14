import React, { useEffect, useState } from "react";
import { Space, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import GetKhachHangModal from "../../components/GetKhachHangModal";

import { getCustomer, searchCustomer } from "../../../api/api";

export interface Customer {
  address: string;
  fullName: string;
  gmail: string;
  img: string;
  phone: string;
}

const GetKhachHang = () => {

  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string) => (
        <Avatar src={img} size={40} />
      )
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullName"
    },
    {
      title: "SĐT",
      dataIndex: "phone"
    },
    {
      title: "Gmail",
      dataIndex: "gmail"
    },
    {
      title: "Địa chỉ",
      dataIndex: "address"
    },
    {
      title: "Thao tác",
      render: (_: any, record: Customer) => (
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

  const fetchCustomers = async () => {
    try {

      setLoading(true);

      const res = await getCustomer();

      if (res?.data) {
        setData(res.data);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {

    if (!searchValue.trim()) {
      fetchCustomers();
      return;
    }

    try {

      setLoading(true);

      const res = await searchCustomer({
        fullName: searchValue
      });

      const value = res?.data;

      if (Array.isArray(value)) {
        setData(value);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>

      <CommonTable<Customer>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKeyField="phone"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchClick={handleSearch}
      />

      <GetKhachHangModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
};

export default GetKhachHang;