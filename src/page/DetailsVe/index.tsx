import { Divider, Tag } from "antd";
import { CalendarOutlined, UserOutlined, PhoneOutlined, IdcardOutlined, MailOutlined, DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, EnvironmentOutlined, CreditCardOutlined } from "@ant-design/icons";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ButtonCustom from "../../components/custom/button";

const DetailsVe = () => {
    // Dữ liệu mẫu
    const contactInfo = {
        name: "Nguyễn Văn A",
        phone: "0123 456 789",
        cccd: "123456789012",
        email: "nguyenvana.example@gmail.com",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM"
    };

    const orderInfo = {
        ticketName: "Vé VIP Tiệc Âm Nhạc Mùa Hè",
        eventName: "Lễ hội âm nhạc Sunshine Festival 2024",
        date: "20/02/2026",
        time: "18:00 - 23:00",
        venue: "Sân vận động Quân khu 7, TP.HCM",
        quantity: 2,
        ticketType: "Người lớn",
        seat: "Khu A - Hàng 5 - Ghế 12, 13",
        description: "Vé vào cổng khu VIP bao gồm: 01 đồ uống cao cấp, khu vực ăn uống riêng, toilet riêng và chỗ ngồi ưu tiên",
        orderCode: "#DH123456",
        bookingTime: "10:30 09/02/2026",
        expiryDate: "19/02/2026 23:59"
    };

    const paymentInfo = {
        status: "success",
        statusText: "Đã thanh toán",
        transactionCode: "TXN123456789",
        method: "Chuyển khoản ngân hàng",
        bank: "Vietcombank - Chi nhánh TP.HCM ",
        total: "2.400.000đ",
        subtotal: "2.200.000đ",
        fee: "200.000đ",
        discount: "0đ",
        paymentTime: "10:45 09/02/2026"
    };

    return (
        <div className="details-ve">
            <BgWhiteBorder>
                <div className="pdDetail" style={{padding:'10px 20px'}}>
                    <div className="details-header">
                        <h2 className="page-title">Chi tiết đơn hàng vé</h2>
                        <Tag color="blue" className="order-tag">Đơn hàng #{orderInfo.orderCode}</Tag>
                    </div>

                    <section className="details-section">
                        <div className="section-header">
                            <UserOutlined className="section-icon" />
                            <h4 className="section-title">Thông tin liên hệ</h4>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">
                                    <UserOutlined /> Tên khách hàng
                                </span>
                                <span className="value">{contactInfo.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">
                                    <PhoneOutlined /> Số điện thoại
                                </span>
                                <span className="value">{contactInfo.phone}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">
                                    <IdcardOutlined /> CCCD/CMND
                                </span>
                                <span className="value">{contactInfo.cccd}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">
                                    <MailOutlined /> Email
                                </span>
                                <span className="value">{contactInfo.email}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="label"><EnvironmentOutlined /> Địa chỉ</span>
                                <span className="value">{contactInfo.address}</span>
                            </div>
                        </div>
                    </section>

                    <Divider className="custom-divider" />

                    {/* Thông tin vé */}
                    <section className="details-section">
                        <div className="section-header">
                            <CreditCardOutlined className="section-icon" />
                            <h4 className="section-title">Thông tin vé</h4>
                        </div>

                        <div className="ticket-card">
                            <div className="ticket-image-container">
                                <img
                                    className="ticket-image"
                                    src="https://nads.1cdn.vn/2024/11/22/74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png"
                                    alt="Vé VIP"
                                />
                                <Tag color="gold" className="ticket-badge">VIP</Tag>
                            </div>

                            <div className="ticket-content">
                                <h3 className="ticket-name">{orderInfo.ticketName}</h3>
                                <p className="event-name">{orderInfo.eventName}</p>

                                <div className="ticket-details">
                                    <div className="detail-row">
                                        <CalendarOutlined />
                                        <span><strong>Ngày:</strong> {orderInfo.date}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span><strong>Loại vé:</strong> {orderInfo.ticketType}</span>
                                    </div>
                                    <div className="detail-row">
                                        <EnvironmentOutlined />
                                        <span><strong>Địa điểm:</strong> {orderInfo.venue}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span><strong>Số lượng:</strong> {orderInfo.quantity} vé</span>
                                    </div>

                                    <div className="detail-row">
                                        <ClockCircleOutlined />
                                        <span><strong>Giờ:</strong> {orderInfo.time}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span><strong>Vị trí ghế:</strong> {orderInfo.seat}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="additional-info">
                            <div className="info-block">
                                <h5>Mô tả vé</h5>
                                <p>{orderInfo.description}</p>
                            </div>

                            <div className="order-meta">
                                <div className="meta-item">
                                    <span>Mã đơn hàng:</span>
                                    <strong>{orderInfo.orderCode}</strong>
                                </div>
                                <div className="meta-item">
                                    <span>Thời gian đặt:</span>
                                    <strong>{orderInfo.bookingTime}</strong>
                                </div>
                                <div className="meta-item">
                                    <span>Hạn sử dụng:</span>
                                    <strong>{orderInfo.expiryDate}</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Divider className="custom-divider" />

                    <section className="details-section payment-section">
                        <div className="section-header">
                            <DollarOutlined className="section-icon" />
                            <h4 className="section-title">Thông tin thanh toán</h4>
                        </div>

                        <div className="payment-info">
                            <div className="payment-status">
                                <span className="status-label">Trạng thái:</span>
                                <Tag color="success" className="status-tag">
                                    <CheckCircleOutlined /> {paymentInfo.statusText}
                                </Tag>
                            </div>

                            <div className="payment-details">
                                <div className="detail-item">
                                    <span>Mã giao dịch:</span>
                                    <strong>{paymentInfo.transactionCode}</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Phương thức:</span>
                                    <strong>{paymentInfo.method}</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Ngân hàng:</span>
                                    <strong>{paymentInfo.bank}</strong>
                                </div>
                                <div className="detail-item">
                                    <span>Thời gian thanh toán:</span>
                                    <strong>{paymentInfo.paymentTime}</strong>
                                </div>
                            </div>

                            <div className="payment-breakdown">
                                <div className="breakdown-item">
                                    <span>Tổng tiền vé:</span>
                                    <span>{paymentInfo.subtotal}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span>Phí dịch vụ:</span>
                                    <span>{paymentInfo.fee}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span>Giảm giá:</span>
                                    <span className="discount">{paymentInfo.discount}</span>
                                </div>
                                <div className="breakdown-item total">
                                    <span>Tổng thanh toán:</span>
                                    <strong className="total-amount">{paymentInfo.total}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="payment-actions">
                            <ButtonCustom text="Thanh toán" />
                        </div>
                    </section>
                </div>

            </BgWhiteBorder>
        </div>
    );
};

export default DetailsVe;