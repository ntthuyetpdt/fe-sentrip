import React, { useEffect, useState, useCallback } from "react";
import { Space, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import CommonTable from "../../../components/custom/table";
import GetKhachHangModal from "../../components/GetKhachHangModal";

import { getCustomer } from "../../../api/api";
import ButtonCustom from "../../../components/custom/button";

export interface Customer {
  address: string;
  fullName: string;
  gmail: string;
  img: string;
  phone: string;
}

const GetKhachHang = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchGmail, setSearchGmail] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string) => <Avatar src={img} size={40} />,
    },
    { title: "Tên khách hàng", dataIndex: "fullName" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Gmail", dataIndex: "gmail" },
    { title: "Địa chỉ", dataIndex: "address" },
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
      ),
    },
  ];

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomer();
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
    const gmail = searchGmail.trim().toLowerCase();
    const address = searchAddress.trim().toLowerCase();

    const result = data.filter((c) => {
      const matchName = name ? c.fullName?.toLowerCase().includes(name) : true;
      const matchPhone = phone ? c.phone?.toLowerCase().includes(phone) : true;
      const matchGmail = gmail ? c.gmail?.toLowerCase().includes(gmail) : true;
      const matchAddress = address ? c.address?.toLowerCase().includes(address) : true;
      return matchName && matchPhone && matchGmail && matchAddress;
    });

    setFilteredData(result);
    setPagination((prev) => ({ ...prev, total: result.length, current: 1 }));
  }, [data, searchName, searchPhone, searchGmail, searchAddress]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    fetchCustomers();
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
          placeholder="Tìm theo tên khách hàng"
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
          placeholder="Tìm theo Gmail"
          value={searchGmail}
          onChange={(e) => setSearchGmail(e.target.value)}
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

      <CommonTable<Customer>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={pagination}
        rowKeyField="phone"
        hideSearch
      />

      <GetKhachHangModal
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

export default GetKhachHang;