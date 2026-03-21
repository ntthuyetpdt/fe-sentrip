import React, { useEffect, useState, useCallback } from "react";
import { Space, Avatar, message, Popconfirm } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import GetMerchantModal from "../../components/GetMerchantModal";
import ButtonCustom from "../../../components/custom/button";

import { getMechant, deleteMechant } from "../../../api/api";

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
  const [filteredData, setFilteredData] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Merchant | null>(null);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string) => <Avatar src={img} size={40} />,
    },
    { title: "Tên nhà cung cấp", dataIndex: "merchantName" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Địa chỉ", dataIndex: "address" },
    { title: "Ngân hàng", dataIndex: "bankName" },
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
              } catch {
                message.error("Xoá thất bại");
              }
            }}
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const res = await getMechant();
      if (res?.data) {
        setData(res.data);
        setFilteredData(res.data);
        setPagination((prev) => ({ ...prev, total: res.data.length }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(() => {
    const name = searchName.trim().toLowerCase();
    const phone = searchPhone.trim().toLowerCase();
    const address = searchAddress.trim().toLowerCase();

    const result = data.filter((m) => {
      const matchName = name ? m.merchantName?.toLowerCase().includes(name) : true;
      const matchPhone = phone ? m.phone?.toLowerCase().includes(phone) : true;
      const matchAddress = address ? m.address?.toLowerCase().includes(address) : true;
      return matchName && matchPhone && matchAddress;
    });

    setFilteredData(result);
    setPagination((prev) => ({ ...prev, total: result.length, current: 1 }));
  }, [data, searchName, searchPhone, searchAddress]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <input
          placeholder="Tìm theo tên nhà cung cấp"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <input
          placeholder="Tìm theo SĐT"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <input
          placeholder="Tìm theo địa chỉ"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <ButtonCustom text="Tìm kiếm" onClick={handleSearch} />
      </div>

      <CommonTable<Merchant>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        // pagination={pagination}
        rowKeyField="id"
        hideSearch
      />

      <GetMerchantModal
        open={modalOpen}
        data={selected || undefined}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid #d9d9d9",
  outline: "none",
  fontSize: 14,
  minWidth: 200,
};

export default GetMerchant;