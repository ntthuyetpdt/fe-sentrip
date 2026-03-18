import React, { useEffect, useState } from "react";
import { Empty, Tabs, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ButtonCustom from "../../components/custom/button";
import OrderCard from "../../components/custom/cardCustom";
import { oderUser } from "../../api/api";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  additionalService: any;
  createdAt: any;
  img: any;
  orderCode: any;
  orderStatus: any;
  productNames: any;
  quantities: any;
  totalAmount: any;
}

type TabKey =
  | "all"
  | "pending"
  | "confirmed"
  | "paid"
  | "completed"
  | "cancelled"
  | "refund_requested"
  | "refunded";

const STATUS_MAP: Record<TabKey, string[]> = {
  all: [],
  pending: ["PENDING", "PENDING_PAYMENT"],
  confirmed: ["CONFIRM", "CONFIRMED"],
  paid: ["PAID"],
  completed: ["COMPLETED"],
  cancelled: ["CANCELLED"],
  refund_requested: ["REFUND_REQUESTED"],
  refunded: ["REFUNDED"],
};

const TAB_ITEMS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "paid", label: "Đã thanh toán" },
  // { key: "completed", label: "Hoàn thành" },
  // { key: "cancelled", label: "Đã hủy" },
  // { key: "refund_requested", label: "Yêu cầu hoàn vé" },
  // { key: "refunded", label: "Đã hoàn tiền" },
];

const QuanLiDonHang = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [keyword, setKeyword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [activeTab, keyword, orders]);

  const fetchOrders = async () => {
    try {
      const res = await oderUser();
      setOrders(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách đơn hàng");
    }
  };

  const handleFilter = () => {
    let data = [...orders];

    if (activeTab !== "all") {
      const allowedStatuses = STATUS_MAP[activeTab];
      data = data.filter((order) =>
        allowedStatuses.includes(order.orderStatus?.toUpperCase())
      );
    }

    if (keyword.trim()) {
      const lower = keyword.trim().toLowerCase();

      data = data.filter((order) => {
        const codeMatch = order.orderCode
          ?.toString()
          .toLowerCase()
          .includes(lower);

        const nameMatch = Array.isArray(order.productNames)
          ? order.productNames.some((name: string) =>
            name.toLowerCase().includes(lower)
          )
          : order.productNames
            ?.toString()
            .toLowerCase()
            .includes(lower);

        return codeMatch || nameMatch;
      });
    }

    setFilteredOrders(data);
  };

  const handlePay = (orderCode: string) => {
    navigate(`/details/${orderCode}`);
  };

  return (
    <div className="quanLiDonHang">
      <BgWhiteBorder className="bg">
        <div className="top-content-QLDH">
          <h3>Đơn hàng của tôi</h3>
          <div className="search-QLDH">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <ButtonCustom
              className="btn-search-QLDH"
              text={<SearchOutlined />}
              onClick={handleFilter}
            />
          </div>
        </div>

        <div className="tab-menu">
          <Tabs
            items={TAB_ITEMS}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as TabKey)}
          />
        </div>

        <div className="card-list">
          {filteredOrders.length === 0 ? (
            <Empty description="Không có đơn hàng" />
          ) : (
            filteredOrders.map((item) => (
              <OrderCard
                key={item.orderCode}
                viewProduct={false}
                img={item.img}
                productName={item.productNames}
                createdAt={item.createdAt}
                price={item.totalAmount}
                status={item.orderStatus}
                orderCode={item.orderCode}
                additionalService={item.additionalService}
                quantities={item.quantities}
                onPay={() => handlePay(item.orderCode)}
              />
            ))
          )}
        </div>
      </BgWhiteBorder>
    </div>
  );
};

export default QuanLiDonHang;