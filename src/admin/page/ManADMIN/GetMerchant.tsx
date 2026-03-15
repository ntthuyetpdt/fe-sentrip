import React, { useEffect, useState } from "react";
import { Space, Avatar, Modal, message, Popconfirm } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import GetMerchantModal from "../../components/GetMerchantModal";

import { getMechant, searchMechant, deleteMechant } from "../../../api/api";

export interface Merchant {
  id: number;
  merchantName: string;
  phone: string;
  address: string;
  bankAccount: string;
  bankName: string;
  businessLicense: string;
  cccd: string;
  img?: string | null;
}

const GetMerchant = () => {
  const [data, setData] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Merchant | null>(null);


  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string) => (
        <Avatar src={img} size={40} />
      )
    },
    {
      title: "Tên Merchant",
      dataIndex: "merchantName"
    },
    {
      title: "SĐT",
      dataIndex: "phone"
    },
    {
      title: "Địa chỉ",
      dataIndex: "address"
    },
    {
      title: "Ngân hàng",
      dataIndex: "bankName"
    },
    {
      title: "Thao tác",
      render: (_: any, record: Merchant) => (
        <Space>

          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={() => {
              setSelected(record);
              setModalOpen(true);
            }}
          />

          <Popconfirm
            title="Bạn có chắc muốn xoá merchant này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={async () => {
              try {
                await deleteMechant(Number(record.id));
                message.success("Xoá thành công");
                fetchMerchants();
              } catch (error) {
                message.error("Xoá thất bại");
              }
            }}
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
            />
          </Popconfirm>

        </Space>
      )
    }
  ];


  const fetchMerchants = async () => {
    try {

      setLoading(true);

      const res = await getMechant();

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
      fetchMerchants();
      return;
    }

    try {

      setLoading(true);

      const res = await searchMechant({
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
    fetchMerchants();
  }, []);

  return (
    <div>

      <CommonTable<Merchant>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKeyField="id"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchClick={handleSearch}
      />

      <GetMerchantModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
};

export default GetMerchant;