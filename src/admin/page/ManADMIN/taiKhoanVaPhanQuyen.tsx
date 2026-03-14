import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { getEmployee, searchEmployee, editEmployee, deleteEmployee, createEmployee } from "../../../api/api";
import EmployeeModal from "../../components/EmployeeModal";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { message, Popconfirm, Button, Space } from "antd";
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
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

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
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: "50%",
            }}
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
      render: (value: string) =>
        new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <EyeOutlined
            style={{ color: "violet", cursor: "pointer" }}
            onClick={() => {
              setSelectedEmployee(record);
              setMode("view");
              setModalOpen(true);
            }}
          />

          <EditOutlined
            style={{ color: "#4C1D95", cursor: "pointer" }}
            onClick={() => {
              setSelectedEmployee(record);
              setMode("edit");
              setModalOpen(true);
            }}
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
      ),
    }
  ];

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployee();

      if (res?.data) {
        setData(res.data);
        setPagination((prev) => ({
          ...prev,
          total: res.data.length,
        }));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      fetchEmployees();
      return;
    }

    try {
      setLoading(true);
      const data = await searchEmployee({ fullName: searchValue });
      const value = data.data
      if (Array.isArray(value)) {
        setData(value);
        setPagination((prev) => ({
          ...prev,
          total: data.length,
          current: 1,
        }));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <div>
        <ButtonCustom
          text="Thêm nhân viên"
          onClick={() => {
            setSelectedEmployee(null);
            setMode("create");
            setModalOpen(true);
          }}
        />
      </div>

      <CommonTable<Employee>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        rowKeyField="fullName"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchClick={handleSearch}
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

              await editEmployee(
                Number(selectedEmployee.id),
                values
              );

              message.success("Cập nhật thành công");
            }

            setModalOpen(false);
            fetchEmployees();
          } catch (error: any) {

          }
        }}
      />
    </div>
  );
};

export default QuanLiNhanVien;