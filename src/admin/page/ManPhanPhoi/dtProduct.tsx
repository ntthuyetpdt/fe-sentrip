import React, { useEffect, useState } from "react";
import { Space } from "antd";
import { EyeOutlined, FilterOutlined, CloseCircleOutlined } from "@ant-design/icons";

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

const filterStyles = `
  .filter-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
    padding: 18px 20px;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 60%, #ede9fe 100%);
    border-radius: 12px;
    border: 1px solid #ddd6fe;
    box-shadow: 0 2px 12px rgba(139, 92, 246, 0.08);
    align-items: flex-end;
    position: relative;
  }

  .filter-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 20px,
      rgba(167, 139, 250, 0.03) 20px,
      rgba(167, 139, 250, 0.03) 40px
    );
    pointer-events: none;
  }

  .filter-panel__header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    font-size: 13px;
    font-weight: 600;
    color: #7c3aed;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .filter-panel__header .anticon {
    font-size: 14px;
  }

  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .filter-field__label {
    font-size: 11.5px;
    font-weight: 600;
    color: #7c3aed;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .filter-input {
    height: 34px;
    padding: 0 12px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    background: rgba(255,255,255,0.85);
    width: 160px;
    color: #3b1fa8;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    backdrop-filter: blur(4px);
  }

  .filter-input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  .filter-input:focus {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .filter-input:hover:not(:focus) {
    border-color: #a78bfa;
  }

  .filter-range {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 10px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    background: rgba(255,255,255,0.85);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    backdrop-filter: blur(4px);
  }

  .filter-range:focus-within {
    border-color: #8b5cf6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .filter-range:hover:not(:focus-within) {
    border-color: #a78bfa;
  }

  .filter-range__input {
    border: none;
    outline: none;
    width: 70px;
    font-size: 13.5px;
    background: transparent;
    color: #3b1fa8;
  }

  .filter-range__input--wide {
    width: 90px;
  }

  .filter-range__input::placeholder {
    color: #c4b5fd;
    font-size: 12.5px;
  }

  /* Remove number input arrows */
  .filter-range__input::-webkit-outer-spin-button,
  .filter-range__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .filter-range__input[type=number] {
    -moz-appearance: textfield;
  }

  .filter-range__sep {
    color: #c4b5fd;
    font-weight: 700;
    font-size: 14px;
    user-select: none;
  }

  .filter-clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 16px;
    border: 1.5px solid #ddd6fe;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: rgba(255,255,255,0.7);
    color: #7c3aed;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }

  .filter-clear-btn:hover {
    background: #fff;
    border-color: #8b5cf6;
    color: #5b21b6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
    transform: translateY(-1px);
  }

  .filter-clear-btn:active {
    transform: translateY(0);
  }

  .filter-active-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #7c3aed;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    margin-left: 2px;
  }

  .eye-action {
    color: #8b5cf6;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.15s, transform 0.15s;
  }

  .eye-action:hover {
    color: #5b21b6;
    transform: scale(1.2);
  }
`;

const GetDoanhThuPro = () => {
  const [data, setData] = useState<ProductStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ProductStatistics | null>(null);

  const [filterProductName, setFilterProductName] = useState("");
  const [filterAdditionalServices, setFilterAdditionalServices] = useState("");
  const [filterMinCustomers, setFilterMinCustomers] = useState("");
  const [filterMaxCustomers, setFilterMaxCustomers] = useState("");
  const [filterMinOrders, setFilterMinOrders] = useState("");
  const [filterMaxOrders, setFilterMaxOrders] = useState("");
  const [revenueMin, setRevenueMin] = useState("");
  const [revenueMax, setRevenueMax] = useState("");

  const activeFiltersCount = [
    filterProductName, filterAdditionalServices,
    filterMinCustomers, filterMaxCustomers,
    filterMinOrders, filterMaxOrders,
    revenueMin, revenueMax,
  ].filter(Boolean).length;

  const hasFilter = activeFiltersCount > 0;

  const filteredData = data.filter((item) => {
    const matchName = item.productName.toLowerCase().includes(filterProductName.toLowerCase());
    const matchService = item.additionalServices.toLowerCase().includes(filterAdditionalServices.toLowerCase());

    let matchCustomers = true;
    if (filterMinCustomers !== "" && filterMaxCustomers !== "") {
      matchCustomers = item.totalCustomers >= Number(filterMinCustomers) && item.totalCustomers <= Number(filterMaxCustomers);
    } else if (filterMinCustomers !== "") {
      matchCustomers = item.totalCustomers >= Number(filterMinCustomers);
    } else if (filterMaxCustomers !== "") {
      matchCustomers = item.totalCustomers <= Number(filterMaxCustomers);
    }

    let matchOrders = true;
    if (filterMinOrders !== "" && filterMaxOrders !== "") {
      matchOrders = item.totalOrders >= Number(filterMinOrders) && item.totalOrders <= Number(filterMaxOrders);
    } else if (filterMinOrders !== "") {
      matchOrders = item.totalOrders >= Number(filterMinOrders);
    } else if (filterMaxOrders !== "") {
      matchOrders = item.totalOrders <= Number(filterMaxOrders);
    }

    let matchRevenue = true;
    const revenue = Number(item.totalRevenue || 0);
    if (revenueMin !== "" && revenueMax !== "") {
      matchRevenue = revenue >= Number(revenueMin) && revenue <= Number(revenueMax);
    } else if (revenueMin !== "") {
      matchRevenue = revenue >= Number(revenueMin);
    } else if (revenueMax !== "") {
      matchRevenue = revenue <= Number(revenueMax);
    }

    return matchName && matchService && matchCustomers && matchOrders && matchRevenue;
  });

  const columns = [
    { title: "Tên dịch vụ", dataIndex: "productName" },
    { title: "Dịch vụ kèm", dataIndex: "additionalServices" },
    { title: "Số khách", dataIndex: "totalCustomers" },
    { title: "Số đơn", dataIndex: "totalOrders" },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      render: (value: number | string) => {
        const revenue = Number(value || 0);
        return revenue.toLocaleString("vi-VN") + " VNĐ";
      },
    },
    {
      title: "Thao tác",
      render: (_: any, record: ProductStatistics) => (
        <Space>
          <EyeOutlined
            className="eye-action"
            onClick={() => {
              setSelected(record);
              setModalOpen(true);
            }}
          />
        </Space>
      ),
    },
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

  const clearFilters = () => {
    setFilterProductName("");
    setFilterAdditionalServices("");
    setFilterMinCustomers("");
    setFilterMaxCustomers("");
    setFilterMinOrders("");
    setFilterMaxOrders("");
    setRevenueMin("");
    setRevenueMax("");
  };

  return (
    <div>
      <style>{filterStyles}</style>

      <div className="filter-panel">

        {/* Header row */}
        {/* <div className="filter-panel__header">
          <FilterOutlined />
          Bộ lọc
          {hasFilter && <span className="filter-active-badge">{activeFiltersCount}</span>}
        </div> */}

        {/* Tên dịch vụ */}
        <div className="filter-field">
          <span className="filter-field__label">Tên dịch vụ</span>
          <input
            type="text"
            placeholder="Tìm tên dịch vụ..."
            value={filterProductName}
            onChange={(e) => setFilterProductName(e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Dịch vụ kèm */}
        <div className="filter-field">
          <span className="filter-field__label">Dịch vụ kèm</span>
          <input
            type="text"
            placeholder="Tìm dịch vụ..."
            value={filterAdditionalServices}
            onChange={(e) => setFilterAdditionalServices(e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Số khách */}
        <div className="filter-field">
          <span className="filter-field__label">Số khách</span>
          <div className="filter-range">
            <input
              type="number"
              placeholder="Từ"
              value={filterMinCustomers}
              onChange={(e) => setFilterMinCustomers(e.target.value)}
              className="filter-range__input"
            />
            <span className="filter-range__sep">—</span>
            <input
              type="number"
              placeholder="Đến"
              value={filterMaxCustomers}
              onChange={(e) => setFilterMaxCustomers(e.target.value)}
              className="filter-range__input"
            />
          </div>
        </div>

        {/* Số đơn */}
        <div className="filter-field">
          <span className="filter-field__label">Số đơn</span>
          <div className="filter-range">
            <input
              type="number"
              placeholder="Từ"
              value={filterMinOrders}
              onChange={(e) => setFilterMinOrders(e.target.value)}
              className="filter-range__input"
            />
            <span className="filter-range__sep">—</span>
            <input
              type="number"
              placeholder="Đến"
              value={filterMaxOrders}
              onChange={(e) => setFilterMaxOrders(e.target.value)}
              className="filter-range__input"
            />
          </div>
        </div>

        {/* Doanh thu */}
        <div className="filter-field">
          <span className="filter-field__label">Doanh thu</span>
          <div className="filter-range">
            <input
              type="number"
              placeholder="Từ"
              value={revenueMin}
              onChange={(e) => setRevenueMin(e.target.value)}
              className="filter-range__input filter-range__input--wide"
            />
            <span className="filter-range__sep">—</span>
            <input
              type="number"
              placeholder="Đến"
              value={revenueMax}
              onChange={(e) => setRevenueMax(e.target.value)}
              className="filter-range__input filter-range__input--wide"
            />
          </div>
        </div>

        {/* Xoá lọc */}
        {hasFilter && (
          <button className="filter-clear-btn" onClick={clearFilters}>
            <CloseCircleOutlined />
            Xoá lọc
          </button>
        )}

      </div>

      <CommonTable<ProductStatistics>
        columns={columns}
        dataSource={filteredData}
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