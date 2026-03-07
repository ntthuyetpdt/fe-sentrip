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
const QuanLiDonHang = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
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

    setFilteredOrders(data);
  };

  const handlePay = (orderCode: string) => {
    navigate(`/details/${orderCode}`);
  };

  const items = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "cancel", label: "Đã hủy" },
    { key: "invoice", label: "Đã xuất hóa đơn" },
  ];

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
            />
          </div>
        </div>

        <div className="tab-menu">
          <Tabs
            items={items}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
          />
        </div>

        <div className="card-list">
          {filteredOrders.length === 0 ? (
            <div><Empty /></div>
          ) : (
            filteredOrders.map((item) => (
              <OrderCard
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