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


interface Ticket {
  fullName: string;
  phone: string;
  gmail: string;
  cccd: string;
  productName: string;
  serviceType: string;
  type: string;
  createTime: string;
  status: string;
  totalAmount: number;
  paidAt: string;
  paymentCode: string;
  img: string;
  quantities: string;
}

const MyTicket = () => {

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTicket = async () => {
    const res = await myTicket();
    setTickets(res?.data || []);
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  if (tickets.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <BgWhiteBorder>
            <div className="cart-body empty-ticket">
              <Empty description="Bạn chưa có vé nào" />
            </div>
          </BgWhiteBorder>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        <div className="cart-header">
          <BgWhiteBorder>
            <div className="header-content">
              <h3>Vé của tôi</h3>
            </div>
          </BgWhiteBorder>
        </div>

        <div className="cart-body">

          {tickets.map((detail, index) => (

            <div key={index} className="cart-item">

              <BgWhiteBorder>

                <div className="pdDetail">

                  <div className="details-header">

                    <h2 className="page-title">
                      Chi tiết vé
                    </h2>

                    <Tag color="blue">
                      {detail.paymentCode}
                    </Tag>

                  </div>

                  <section className="details-section">

                    <div className="section-header">
                      <UserOutlined />
                      <h4>Thông tin liên hệ</h4>
                    </div>

                    <div className="info-grid">

                      <div className="info-item">
                        <span className="label">
                          <UserOutlined /> Tên khách hàng
                        </span>
                        <span className="value">
                          {detail.fullName || "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="label">
                          <PhoneOutlined /> Số điện thoại
                        </span>
                        <span className="value">
                          {detail.phone || "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="label">
                          <IdcardOutlined /> CCCD
                        </span>
                        <span className="value">
                          {detail.cccd || "Chưa cập nhật"}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="label">
                          <MailOutlined /> Email
                        </span>
                        <span className="value">
                          {detail.gmail || "Chưa cập nhật"}
                        </span>
                      </div>

                    </div>

                  </section>

                  <Divider />

                  <section className="details-section">

                    <div className="section-header">
                      <CreditCardOutlined />
                      <h4>Thông tin vé</h4>
                    </div>

                    <div className="ticket-card">

                      <div className="ticket-image-container">

                        <img
                          className="ticket-image"
                          src={detail.img}
                          alt="ticket"
                        />

                        <Tag color="gold">
                          {detail.serviceType}
                        </Tag>

                      </div>

                      <div className="ticket-content">

                        <h3 className="ticket-name">
                          {detail.productName}
                        </h3>

                        <div className="ticket-details">

                          <div className="detail-row">
                            <strong>Loại vé:</strong> {detail.type}
                          </div>

                          <div className="detail-row">
                            <strong>Số lượng:</strong> {detail.quantities}
                          </div>

                        </div>

                      </div>

                    </div>

                  </section>

                  <Divider />

                  <section className="details-section">

                    <div className="section-header">
                      <DollarOutlined />
                      <h4>Thông tin thanh toán</h4>
                    </div>

                    <div className="payment-breakdown">

                      <div className="breakdown-item">
                        <span>Trạng thái:</span>

                        <Tag
                          color={
                            detail.status === "SUCCESS"
                              ? "green"
                              : "orange"
                          }
                        >
                          {detail.status}
                        </Tag>
                      </div>

                      <div className="breakdown-item">
                        <span>Mã thanh toán:</span>
                        <span>{detail.paymentCode || "Chưa có"}</span>
                      </div>

                      <div className="breakdown-item">
                        <span>Ngày tạo:</span>

                        <span>
                          {detail.createTime
                            ? new Date(detail.createTime).toLocaleString()
                            : "Không có"}
                        </span>
                      </div>

                      <div className="breakdown-item">
                        <span>Ngày thanh toán:</span>

                        <span>
                          {detail.paidAt
                            ? new Date(detail.paidAt).toLocaleString()
                            : "Chưa thanh toán"}
                        </span>
                      </div>

                      <div className="breakdown-item total">

                        <span>Tổng tiền:</span>

                        <span className="total-amount">
                          {detail.totalAmount?.toLocaleString()} đ
                        </span>

                      </div>

                    </div>

                  </section>

                </div>

              </BgWhiteBorder>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default MyTicket;