import React, { useEffect, useState } from "react";
import { Divider, Empty, Tag } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  MailOutlined,
  CreditCardOutlined,
  DollarOutlined
} from "@ant-design/icons";

import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import { myTicket } from "../../api/api";

const styles = `
  .ticket-page {
    min-height: 100vh;
    background: #f0f2f5;
    padding: 24px 16px;
  }

  .ticket-wrapper {
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ticket-page-header {
    background: #fff;
    border-radius: 12px;
    padding: 16px 24px;
  }

  .ticket-page-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .ticket-empty-box {
    background: #fff;
    border-radius: 12px;
    padding: 60px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ticket-card-box {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
  }

  .ticket-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .ticket-card-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .ticket-section {
    margin-bottom: 8px;
  }

  .ticket-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: #4a4a6a;
    font-size: 15px;
    font-weight: 600;
  }

  .ticket-section-title .anticon {
    font-size: 16px;
    color: #6366f1;
  }

  .ticket-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 600px) {
    .ticket-info-grid {
      grid-template-columns: 1fr;
    }
  }

  .ticket-info-item {
    background: #f8f8fc;
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ticket-info-label {
    font-size: 12px;
    color: #9999b3;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .ticket-info-value {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .ticket-product-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    background: #f8f8fc;
    border-radius: 10px;
    padding: 14px;
  }

  .ticket-product-img-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .ticket-product-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e8e8f0;
  }

  .ticket-product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ticket-product-name {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .ticket-product-detail-row {
    font-size: 13px;
    color: #4a4a6a;
  }

  .ticket-product-detail-row strong {
    color: #1a1a2e;
  }

  .ticket-payment-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ticket-payment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #4a4a6a;
    padding: 10px 14px;
    background: #f8f8fc;
    border-radius: 8px;
  }

  .ticket-payment-item.ticket-total {
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    font-weight: 700;
  }

  .ticket-total-amount {
    font-size: 16px;
    font-weight: 800;
    color: #6366f1;
  }
`;

interface Ticket {
  fullName?: string;
  phone?: string;
  gmail?: string;
  cccd?: string;
  productName?: string;
  serviceType?: string;
  type?: string;
  createTime?: string;
  status?: string;
  totalAmount?: number;
  paidAt?: string;
  paymentCode?: string;
  img?: string;
  quantities?: string;
}

const MyTicket = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTicket = async () => {
    try {
      const res = await myTicket();
      setTickets(res?.data || []);
    } catch (error) {
      console.error("Lỗi lấy vé:", error);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div className="ticket-page">
        <div className="ticket-wrapper">

          <div className="ticket-page-header">
            <h3>Vé của tôi</h3>
          </div>

          {tickets.length === 0 ? (

            <div className="ticket-empty-box">
              <Empty description="Bạn chưa có vé nào" />
            </div>

          ) : (

            tickets.map((detail, index) => (
              <div key={index} className="ticket-card-box">

                {/* Header */}
                <div className="ticket-card-header">
                  <h2>Chi tiết vé</h2>
                  <Tag color="blue">{detail.paymentCode}</Tag>
                </div>

                {/* Thông tin liên hệ */}
                <div className="ticket-section">
                  <div className="ticket-section-title">
                    <UserOutlined />
                    <span>Thông tin liên hệ</span>
                  </div>

                  <div className="ticket-info-grid">
                    <div className="ticket-info-item">
                      <span className="ticket-info-label">
                        <UserOutlined /> Tên khách hàng
                      </span>
                      <span className="ticket-info-value">
                        {detail.fullName || "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="ticket-info-item">
                      <span className="ticket-info-label">
                        <PhoneOutlined /> Số điện thoại
                      </span>
                      <span className="ticket-info-value">
                        {detail.phone || "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="ticket-info-item">
                      <span className="ticket-info-label">
                        <IdcardOutlined /> CCCD
                      </span>
                      <span className="ticket-info-value">
                        {detail.cccd || "Chưa cập nhật"}
                      </span>
                    </div>

                    <div className="ticket-info-item">
                      <span className="ticket-info-label">
                        <MailOutlined /> Email
                      </span>
                      <span className="ticket-info-value">
                        {detail.gmail || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Thông tin vé */}
                <div className="ticket-section">
                  <div className="ticket-section-title">
                    <CreditCardOutlined />
                    <span>Thông tin vé</span>
                  </div>

                  <div className="ticket-product-row">
                    <div className="ticket-product-img-wrap">
                      <img
                        className="ticket-product-img"
                        src={detail.img}
                        alt="ticket"
                      />
                      <Tag color="gold">{detail.serviceType}</Tag>
                    </div>

                    <div className="ticket-product-info">
                      <h3 className="ticket-product-name">{detail.productName}</h3>
                      <div className="ticket-product-detail-row">
                        <strong>Loại vé:</strong> {detail.type}
                      </div>
                      <div className="ticket-product-detail-row">
                        <strong>Số lượng:</strong> {detail.quantities}
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Thông tin thanh toán */}
                <div className="ticket-section">
                  <div className="ticket-section-title">
                    <DollarOutlined />
                    <span>Thông tin thanh toán</span>
                  </div>

                  <div className="ticket-payment-list">
                    <div className="ticket-payment-item">
                      <span>Trạng thái</span>
                      <Tag color={detail.status === "SUCCESS" ? "green" : "orange"}>
                        {detail.status}
                      </Tag>
                    </div>

                    <div className="ticket-payment-item">
                      <span>Mã thanh toán</span>
                      <span>{detail.paymentCode || "Chưa có"}</span>
                    </div>

                    <div className="ticket-payment-item">
                      <span>Ngày tạo</span>
                      <span>
                        {detail.createTime
                          ? new Date(detail.createTime).toLocaleString()
                          : "Không có"}
                      </span>
                    </div>

                    <div className="ticket-payment-item">
                      <span>Ngày thanh toán</span>
                      <span>
                        {detail.paidAt
                          ? new Date(detail.paidAt).toLocaleString()
                          : "Chưa thanh toán"}
                      </span>
                    </div>

                    <div className="ticket-payment-item ticket-total">
                      <span>Tổng tiền</span>
                      <span className="ticket-total-amount">
                        {detail.totalAmount?.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))

          )}

        </div>
      </div>
    </>
  );
};

export default MyTicket;