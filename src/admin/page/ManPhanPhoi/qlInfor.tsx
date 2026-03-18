import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewCutomerOrdered, viewMerchanKHDetails } from "../../../api/api";

import { EyeOutlined, SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
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

const filterStyles = `
  .qlkh-filter-panel {
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

  .qlkh-filter-panel::before {
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

  .qlkh-filter-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
    z-index: 1;
  }

  .qlkh-filter-field__label {
    font-size: 11px;
    font-weight: 700;
    color: #7c3aed;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding-left: 2px;
  }

  .qlkh-filter-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .qlkh-filter-input-wrap .qlkh-input-icon {
    position: absolute;
    left: 10px;
    color: #c4b5fd;
    font-size: 13px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .qlkh-filter-input-wrap:focus-within .qlkh-input-icon {
    color: #8b5cf6;
  }

  .qlkh-filter-input {
    height: 34px;
    padding: 0 12px 0 30px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    background: rgba(255, 255, 255, 0.85);
    width: 170px;
    color: #3b1fa8;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .qlkh-filter-input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .qlkh-filter-input:focus {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .qlkh-filter-input:hover:not(:focus) {
    border-color: #a78bfa;
  }

  .qlkh-filter-range {
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

  .qlkh-filter-range:focus-within {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .qlkh-filter-range:hover:not(:focus-within) {
    border-color: #a78bfa;
  }

  .qlkh-range-input {
    border: none;
    outline: none;
    width: 80px;
    font-size: 13.5px;
    background: transparent;
    color: #3b1fa8;
  }

  .qlkh-range-input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .qlkh-range-input::-webkit-outer-spin-button,
  .qlkh-range-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .qlkh-range-input[type=number] {
    -moz-appearance: textfield;
  }

  .qlkh-range-sep {
    color: #c4b5fd;
    font-weight: 700;
    font-size: 14px;
    user-select: none;
  }

  .qlkh-clear-btn {
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

  .qlkh-clear-btn:hover {
    background: #fff;
    border-color: #8b5cf6;
    color: #5b21b6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.18);
    transform: translateY(-1px);
  }

  .qlkh-clear-btn:active {
    transform: translateY(0);
  }

  .qlkh-eye-action {
    color: #8b5cf6;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.15s, transform 0.15s;
  }

  .qlkh-eye-action:hover {
    color: #5b21b6;
    transform: scale(1.2);
  }
`;

const QuanLiKhachHangDaMua = () => {
  const [data, setData] = useState<CustomerOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<CustomerOrderDetail | null>(null);

  const [filterOrderCode, setFilterOrderCode] = useState("");
  const [filterFullName, setFilterFullName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const hasFilter = filterOrderCode || filterFullName || filterPhone || priceMin || priceMax;

  const clearFilters = () => {
    setFilterOrderCode("");
    setFilterFullName("");
    setFilterPhone("");
    setPriceMin("");
    setPriceMax("");
  };

  const filteredData = data.filter((item) => {
    const matchOrderCode = item.orderCode.toLowerCase().includes(filterOrderCode.toLowerCase());
    const matchFullName = item.fullName.toLowerCase().includes(filterFullName.toLowerCase());
    const matchPhone = item.phone.includes(filterPhone);

    let matchPrice = true;
    if (priceMin !== "" && priceMax !== "") {
      matchPrice = item.price >= Number(priceMin) && item.price <= Number(priceMax);
    } else if (priceMin !== "") {
      matchPrice = item.price >= Number(priceMin);
    } else if (priceMax !== "") {
      matchPrice = item.price <= Number(priceMax);
    }

    return matchOrderCode && matchFullName && matchPhone && matchPrice;
  });

  const columns = [
    { title: "Mã đơn", dataIndex: "orderCode" },
    { title: "Tên KH", dataIndex: "fullName" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Sản phẩm", dataIndex: "productName" },
    { title: "Số lượng", dataIndex: "quantity" },
    {
      title: "Giá tiền",
      dataIndex: "price",
      render: (value: number) => value?.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      render: (_: any, record: CustomerOrderItem) => (
        <Space>
          <EyeOutlined
            className="qlkh-eye-action"
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
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await viewCutomerOrdered();
      if (res) setData(res.data);
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
      <style>{filterStyles}</style>

      <div className="qlkh-filter-panel">

        {/* Mã đơn */}
        <div className="qlkh-filter-field">
          <span className="qlkh-filter-field__label">Mã đơn</span>
          <div className="qlkh-filter-input-wrap">
            <SearchOutlined className="qlkh-input-icon" />
            <input
              type="text"
              placeholder="Tìm mã đơn..."
              value={filterOrderCode}
              onChange={(e) => setFilterOrderCode(e.target.value)}
              className="qlkh-filter-input"
            />
          </div>
        </div>

        {/* Tên KH */}
        <div className="qlkh-filter-field">
          <span className="qlkh-filter-field__label">Tên khách hàng</span>
          <div className="qlkh-filter-input-wrap">
            <SearchOutlined className="qlkh-input-icon" />
            <input
              type="text"
              placeholder="Tìm tên KH..."
              value={filterFullName}
              onChange={(e) => setFilterFullName(e.target.value)}
              className="qlkh-filter-input"
            />
          </div>
        </div>

        {/* SĐT */}
        <div className="qlkh-filter-field">
          <span className="qlkh-filter-field__label">Số điện thoại</span>
          <div className="qlkh-filter-input-wrap">
            <SearchOutlined className="qlkh-input-icon" />
            <input
              type="text"
              placeholder="Tìm SĐT..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="qlkh-filter-input"
              style={{ width: "150px" }}
            />
          </div>
        </div>

        {/* Giá tiền */}
        <div className="qlkh-filter-field">
          <span className="qlkh-filter-field__label">Giá tiền</span>
          <div className="qlkh-filter-range">
            <input
              type="number"
              placeholder="Từ"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="qlkh-range-input"
            />
            <span className="qlkh-range-sep">—</span>
            <input
              type="number"
              placeholder="Đến"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="qlkh-range-input"
            />
          </div>
        </div>

        {/* Xoá lọc */}
        {hasFilter && (
          <button className="qlkh-clear-btn" onClick={clearFilters}>
            <CloseCircleOutlined />
            Xoá lọc
          </button>
        )}

      </div>

      <CommonTable<CustomerOrderItem>
        columns={columns}
        dataSource={filteredData}
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