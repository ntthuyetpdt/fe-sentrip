import React, { useEffect, useState } from "react";
import { Space, Image, Popconfirm, message } from "antd";
import CommonTable from "../../../components/custom/table";
import ButtonCustom from "../../../components/custom/button";
import ProductModal from "../../components/SuppliePro";

import {
  viewProductSupplier,
  deleteProduct,
  searchProductMer,
} from "../../../api/api";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

interface Product {
  id: number;
  productName: string;
  type: string;
  additionalService: string;
  img: string;
  price: string;
  refundable: number;
  serviceType: string;
  status: number;
  address: string;
}

const createProductLocal = async (formData: FormData) => {
  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL;

  const res = await fetch(`${API_URL}/product/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText);
  }

  return res.json();
};

const updateProductLocal = async (id: number, formData: FormData) => {
  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL;

  const res = await fetch(`${API_URL}/product/update/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText);
  }

  return res.json();
};

const ProductManagement = () => {

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit" | "create">("create");
  const [selected, setSelected] = useState<Product | undefined>();

  const fetchData = async () => {
    try {

      setLoading(true);

      const res = await viewProductSupplier();

      if (res?.data) {

        setData(res.data);

        setPagination((prev) => ({
          ...prev,
          total: res.data.length,
        }));

      }

    } catch {

      message.error("Không tải được danh sách sản phẩm");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {

    if (!searchValue.trim()) {
      fetchData();
      return;
    }

    try {

      setLoading(true);

      const res = await searchProductMer(searchValue);

      if (Array.isArray(res.data)) {

        setData(res.data);

        setPagination((prev) => ({
          ...prev,
          total: res.data.length,
          current: 1,
        }));

      }

    } catch {

      message.error("Search thất bại");

    } finally {

      setLoading(false);

    }
  };

  const handleCreate = () => {
    setMode("create");
    setSelected(undefined);
    setOpen(true);
  };

  const handleEdit = (record: Product) => {
    setMode("edit");
    setSelected(record);
    setOpen(true);
  };

  const handleView = (record: Product) => {
    setMode("view");
    setSelected(record);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {

      await deleteProduct(id);

      message.success("Xoá sản phẩm thành công");

      fetchData();

    } catch {

      message.error("Xoá thất bại");

    }
  };

  const handleSubmit = async (formData: FormData) => {

    try {

      if (mode === "create") {

        await createProductLocal(formData);

        message.success("Thêm sản phẩm thành công");

      }

      if (mode === "edit" && selected) {

        await updateProductLocal(selected.id, formData);

        message.success("Cập nhật thành công");

      }

      setOpen(false);

      fetchData();

    } catch {

      message.error("Thao tác thất bại");

    }

  };

  const columns = [

    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img: string) => (
        <Image
          src={img}
          width={80}
          height={60}
          style={{ objectFit: "cover" }}
        />
      ),
    },

    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },

    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType",
    },

    {
      title: "Giá",
      dataIndex: "price",
      render: (price: string) =>
        Number(price).toLocaleString() + " VNĐ",
    },

    {
      title: "Hoàn tiền",
      dataIndex: "refundable",
      render: (val: number) =>
        val === 1 ? "Có" : "Không",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (val: number) =>
        val === 1 ? "Hoạt động" : "Ngừng",
    },

    {
      title: "Hành động",
      render: (_: any, record: Product) => (

        <Space size="middle">

          <EyeOutlined
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => handleView(record)}
          />

          <EditOutlined
            style={{ color: "#52c41a", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />

          <Popconfirm
            title="Xác nhận xoá"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", cursor: "pointer" }}
            />
          </Popconfirm>

        </Space>

      ),
    },

  ];

  return (
    <div>

      <div style={{ marginBottom: 20 }}>
        <ButtonCustom text="Thêm sản phẩm" onClick={handleCreate} />
      </div>

      <CommonTable<Product>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        rowKeyField="id"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchClick={handleSearch}
      />

      <ProductModal
        open={open}
        mode={mode}
        data={selected}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default ProductManagement;