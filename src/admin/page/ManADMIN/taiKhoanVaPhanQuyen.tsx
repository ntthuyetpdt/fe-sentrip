import React, { useEffect, useState, useCallback } from "react";
import CommonTable from "../../../components/custom/table";
import { getEmployee, editEmployee, deleteEmployee, createEmployee } from "../../../api/api";
import EmployeeModal from "../../components/EmployeeModal";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { message, Popconfirm, Space } from "antd";
import ButtonCustom from "../../../components/custom/button";

interface Employee {
  id: any;
  JoinDate: string;
  Role: string;
  accountBank: string;
  address: string;
  bankName: string;
  cccd: string;
  fullName: string;
  gender: string;
  img: string | null;
  mnv: string;
  phone: string;
}

const QuanLiNhanVien = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchMnv, setSearchMnv] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const columns = [
    { title: "ID", dataIndex: "id" },
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string | null) =>
        img ? (
          <img
            src={img}
            alt="avatar"
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          "Không có"
        ),
    },
    { title: "Mã NV", dataIndex: "mnv" },
    { title: "Họ tên", dataIndex: "fullName" },
    { title: "Giới tính", dataIndex: "gender" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "CCCD", dataIndex: "cccd" },
    { title: "Chức vụ", dataIndex: "Role" },
    { title: "Địa chỉ", dataIndex: "address" },
    { title: "Ngân hàng", dataIndex: "bankName" },
    { title: "Số tài khoản", dataIndex: "accountBank" },
    {
      title: "Ngày vào làm",
      dataIndex: "JoinDate",
      render: (value: string) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={() => { setSelectedEmployee(record); setMode("view"); setModalOpen(true); }}
          />
          <EditOutlined
            style={{ color: "#4C1D95", cursor: "pointer" }}
            onClick={() => { setSelectedEmployee(record); setMode("edit"); setModalOpen(true); }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá nhân viên này?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={async () => {
              try {
                await deleteEmployee(Number(record.id));
                message.success("Xoá thành công");
                fetchEmployees();
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

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployee();
      if (res?.data) {
        setData(res.data);
        setFilteredData(res.data);
        setPagination((prev) => ({ ...prev, total: res.data.length }));
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleSearch = useCallback(() => {
    const mnv = searchMnv.trim().toLowerCase();
    const name = searchName.trim().toLowerCase();
    const address = searchAddress.trim().toLowerCase();

    const result = data.filter((emp) => {
      const matchMnv = mnv ? emp.mnv?.toLowerCase().includes(mnv) : true;
      const matchName = name ? emp.fullName?.toLowerCase().includes(name) : true;
      const matchAddress = address ? emp.address?.toLowerCase().includes(address) : true;
      return matchMnv && matchName && matchAddress;
    });

    setFilteredData(result);
    setPagination((prev) => ({ ...prev, total: result.length, current: 1 }));
  }, [data, searchMnv, searchName, searchAddress]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <ButtonCustom
          text="Thêm nhân viên"
          onClick={() => { setSelectedEmployee(null); setMode("create"); setModalOpen(true); }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center", justifyContent:'end' }}>
        <input
          placeholder="Tìm theo mã nhân viên"
          value={searchMnv}
          onChange={(e) => setSearchMnv(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <input
          placeholder="Tìm theo họ tên"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
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

      <CommonTable<Employee>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={pagination}
        rowKeyField="fullName"
        hideSearch
      />

      <EmployeeModal
        open={modalOpen}
        mode={mode}
        data={selectedEmployee || undefined}
        onCancel={() => setModalOpen(false)}
        onSubmit={async (values) => {
          try {
            if (mode === "create") {
              await createEmployee(values);
              message.success("Tạo nhân viên thành công");
            } else {
              if (!selectedEmployee?.id) return;
              await editEmployee(Number(selectedEmployee.id), values);
              message.success("Cập nhật thành công");
            }
            setModalOpen(false);
            fetchEmployees();
          } catch {}
        }}
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

export default QuanLiNhanVien;