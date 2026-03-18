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
  SearchOutlined,
  CloseCircleOutlined,
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

const filterStyles = `
  .pm-filter-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 60%, #ede9fe 100%);
    border-radius: 12px;
    border: 1px solid #ddd6fe;
    box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08);
    align-items: flex-end;

    position: relative;
    overflow: hidden;
  }

  .pm-filter-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 24px,
      rgba(167, 139, 250, 0.04) 24px,
      rgba(167, 139, 250, 0.04) 48px
    );
    pointer-events: none;
  }

  .pm-filter-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
    z-index: 1;
  }

  .pm-filter-field__label {
    font-size: 11px;
    font-weight: 700;
    color: #7c3aed;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding-left: 2px;
  }

  .pm-filter-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .pm-filter-input-wrap .pm-input-icon {
    position: absolute;
    left: 10px;
    color: #c4b5fd;
    font-size: 13px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .pm-filter-input-wrap:focus-within .pm-input-icon {
    color: #8b5cf6;
  }

  .pm-filter-input {
    height: 34px;
    padding: 0 12px 0 30px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    background: rgba(255, 255, 255, 0.85);
    width: 220px;
    color: #3b1fa8;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .pm-filter-input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .pm-filter-input:focus {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .pm-filter-input:hover:not(:focus) {
    border-color: #a78bfa;
  }

  .pm-filter-range {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 12px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.85);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .pm-filter-range:focus-within {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .pm-filter-range:hover:not(:focus-within) {
    border-color: #a78bfa;
  }

  .pm-range-input {
    border: none;
    outline: none;
    width: 80px;
    font-size: 13.5px;
    background: transparent;
    color: #3b1fa8;
  }

  .pm-range-input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .pm-range-input::-webkit-outer-spin-button,
  .pm-range-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .pm-range-input[type=number] {
    -moz-appearance: textfield;
  }

  .pm-range-sep {
    color: #c4b5fd;
    font-weight: 700;
    font-size: 14px;
    user-select: none;
  }

  .pm-clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 14px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.7);
    color: #7c3aed;
    transition: all 0.2s;
    position: relative;
    z-index: 1;
  }

  .pm-clear-btn:hover {
    background: #fff;
    border-color: #8b5cf6;
    color: #5b21b6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.18);
    transform: translateY(-1px);
  }

  .pm-clear-btn:active {
    transform: translateY(0);
  }

  .pm-action-eye   { color: #1677ff; font-size: 15px; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
  .pm-action-edit  { color: #52c41a; font-size: 15px; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
  .pm-action-del   { color: #ff4d4f; font-size: 15px; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }

  .pm-action-eye:hover,
  .pm-action-edit:hover,
  .pm-action-del:hover {
    opacity: 0.75;
    transform: scale(1.2);
  }
`;

const createProductLocal = async (formData: FormData) => {
  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL;
  const res = await fetch(`${API_URL}/product/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const updateProductLocal = async (id: number, formData: FormData) => {
  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL;
  const res = await fetch(`${API_URL}/product/update/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
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

  const [filterProductName, setFilterProductName] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const hasFilter = filterProductName || priceMin || priceMax;

  const clearFilters = () => {
    setFilterProductName("");
    setPriceMin("");
    setPriceMax("");
  };

  const filteredData = data.filter((item) => {
    const matchName = item.productName
      .toLowerCase()
      .includes(filterProductName.toLowerCase());

    let matchPrice = true;
    const price = Number(item.price);
    if (priceMin !== "" && priceMax !== "") {
      matchPrice = price >= Number(priceMin) && price <= Number(priceMax);
    } else if (priceMin !== "") {
      matchPrice = price >= Number(priceMin);
    } else if (priceMax !== "") {
      matchPrice = price <= Number(priceMax);
    }

    return matchName && matchPrice;
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await viewProductSupplier();
      if (res?.data) {
        setData(res.data);
        setPagination((prev) => ({ ...prev, total: res.data.length }));
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
    if (!searchValue.trim()) { fetchData(); return; }
    try {
      setLoading(true);
      const res = await searchProductMer(searchValue);
      if (Array.isArray(res.data)) {
        setData(res.data);
        setPagination((prev) => ({ ...prev, total: res.data.length, current: 1 }));
      }
    } catch {
      message.error("Search thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => { setMode("create"); setSelected(undefined); setOpen(true); };
  const handleEdit   = (r: Product) => { setMode("edit");   setSelected(r); setOpen(true); };
  const handleView   = (r: Product) => { setMode("view");   setSelected(r); setOpen(true); };

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
        <Image src={img} width={80} height={60} style={{ objectFit: "cover" }} />
      ),
    },
    { title: "Tên sản phẩm", dataIndex: "productName" },
    { title: "Loại dịch vụ", dataIndex: "serviceType" },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price: string) => Number(price).toLocaleString() + " VNĐ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (val: number) => val === 1 ? "Hoạt động" : "Ngừng",
    },
    {
      title: "Hành động",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <EyeOutlined
            className="pm-action-eye"
            onClick={() => handleView(record)}
          />
          <EditOutlined
            className="pm-action-edit"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm title="Xác nhận xoá" onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined className="pm-action-del" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <style>{filterStyles}</style>

      <div style={{ marginBottom: 20 }}>
        <ButtonCustom text="Thêm sản phẩm" onClick={handleCreate} />
      </div>

      {/* Filter bar */}
      <div className="pm-filter-panel">

        {/* Tên sản phẩm */}
        <div className="pm-filter-field">
          <span className="pm-filter-field__label">Tên sản phẩm</span>
          <div className="pm-filter-input-wrap">
            <SearchOutlined className="pm-input-icon" />
            <input
              type="text"
              placeholder="Tìm tên sản phẩm..."
              value={filterProductName}
              onChange={(e) => setFilterProductName(e.target.value)}
              className="pm-filter-input"
            />
          </div>
        </div>

        {/* Khoảng giá */}
        <div className="pm-filter-field">
          <span className="pm-filter-field__label">Khoảng giá</span>
          <div className="pm-filter-range">
            <input
              type="number"
              placeholder="Từ"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="pm-range-input"
            />
            <span className="pm-range-sep">—</span>
            <input
              type="number"
              placeholder="Đến"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="pm-range-input"
            />
          </div>
        </div>

        {/* Xoá lọc */}
        {hasFilter && (
          <button className="pm-clear-btn" onClick={clearFilters}>
            <CloseCircleOutlined />
            Xoá lọc
          </button>
        )}

      </div>

      <CommonTable<Product>
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={pagination}
        rowKeyField="id"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchClick={handleSearch}
        hideSearch
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