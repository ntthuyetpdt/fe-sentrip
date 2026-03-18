import { Divider, Tag, Spin, message, Empty } from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    IdcardOutlined,
    MailOutlined,
    DollarOutlined,
    CreditCardOutlined
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ButtonCustom from "../../components/custom/button";
import { confirmPay, getDetails, getQr } from "../../api/api";
import ModalCustom from "../../components/custom/modal";

const getQrImage = async (lastUrl: any, token: any) => {
    try {
        const res = await fetch(lastUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Lỗi khi gọi API QR");
        }

        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);

        return imageUrl;
    } catch (err) {
        console.error(err);
        return null;
    }
};
const DetailsVe = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loadingQr, setLoadingQr] = useState(false);
    const [qrParam, setQrParam] = useState();

    const fetchDetail = async () => {
        try {
            setLoading(true);

            const res = await getDetails(id);

            if (res?.status === "ok") {
                setDetail(res.data[0]);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const confirmPayment = async () => {
        try {
            await confirmPay(qrParam);

            setOpenModal(false);

            message.success("Thanh toán thành công!", 0.3, () => {
                window.location.reload();
            });

        } catch (error) {
            message.error("Thanh toán thất bại!");
        }
    };
    const fixUrl = (url: string) => {
        return url.replace(/https?:\/\/\s+/g, (match) => match.replace(/\s+/g, ""));
    };

    const getQrt = async () => {
        setOpenModal(true);

        try {
            setLoadingQr(true);

            const body = {
                orderCode: id,
            };

            const request = await getQr(body);
            const res = request.data;

            setQrParam(res.paymentUrl);

            const lastUrl = fixUrl(res.qrUrl);
            const token = localStorage.getItem("access_token");
            const imageUrl = await getQrImage(lastUrl, token);
            setQrImage(imageUrl);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQr(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 120 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!detail) return <div><Empty /></div>;
    console.log();

    return (
        <div className="details-ve">
            <BgWhiteBorder>

                <div className="pdDetail" style={{ padding: "10px 20px" }}>

                    <div className="details-header">
                        <h2 className="page-title">Chi tiết đơn hàng vé</h2>
                        <Tag color="blue" className="order-tag">
                            {detail.orderCode}
                        </Tag>
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
                                    <IdcardOutlined /> CCCD/CMND
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
                                    {detail.gmail}
                                </span>
                            </div>

                        </div>

                    </section>

                    <Divider className="custom-divider" />

                    <section className="details-section">

                        <div className="section-header">
                            <CreditCardOutlined className="section-icon" />
                            <h4 className="section-title">Thông tin vé</h4>
                        </div>

                        <div className="ticket-card">

                            <div className="ticket-image-container">
                                <img
                                    className="ticket-image"
                                    src={detail.img}
                                    alt="Vé"
                                />
                                <Tag color="gold" className="ticket-badge">
                                    {detail.serviceType}
                                </Tag>
                            </div>

                            <div className="ticket-content">

                                <h3 className="ticket-name">
                                    {detail.productNames}
                                </h3>

                                <div className="ticket-details">

                                    <div className="detail-row">
                                        <span>
                                            <strong>Loại vé:</strong> {detail.Type}
                                        </span>
                                    </div>

                                    <div className="detail-row">
                                        <span>
                                            <strong>Dịch vụ thêm:</strong> {detail.additionalService}
                                        </span>
                                    </div>

                                    <div className="detail-row">
                                        <span>
                                            <strong>Số lượng:</strong> {detail.quantities}
                                        </span>
                                    </div>

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

                            <div className="payment-breakdown">

                                <div className="breakdown-item">
                                    <span>Trạng thái đơn:</span>
                                    <Tag color="orange">
                                        {detail.orderStatus}
                                    </Tag>
                                </div>

                                <div className="breakdown-item">
                                    <span>Trạng thái thanh toán:</span>
                                    <Tag color={detail.paymentStatus === "PAID" ? "green" : "red"}>
                                        {detail.paymentStatus || "Chưa thanh toán"}
                                    </Tag>
                                </div>

                                <div className="breakdown-item">
                                    <span>Mã thanh toán:</span>
                                    <span>
                                        {detail.paymentCode || "Chưa có"}
                                    </span>
                                </div>

                                <div className="breakdown-item">
                                    <span>Ngày tạo đơn:</span>
                                    <span>
                                        {detail.createdAt
                                            ? new Date(detail.createdAt).toLocaleString()
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
                                    <span>Tổng thanh toán:</span>

                                    <span className="total-amount">
                                        {detail.totalAmount?.toLocaleString()} đ
                                    </span>

                                </div>

                            </div>

                        </div>

                        {detail.paymentStatus != "SUCCESS" && (
                            <div className="payment-actions">
                                <ButtonCustom text="Thanh toán" onClick={() => getQrt()} />
                            </div>
                        )}

                    </section>

                </div>

            </BgWhiteBorder>

            <ModalCustom
                open={openModal}
                onClose={() => setOpenModal(false)}
            >

                <div style={{ textAlign: "center" }}>

                    {loadingQr ? (
                        <Spin />
                    ) : (
                        qrImage && (
                            <img
                                src={qrImage}
                                alt="QR Payment"
                                style={{
                                    width: 250,
                                    marginBottom: 20
                                }}
                            />
                        )
                    )}

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonCustom
                            text="Huỷ"
                            onClick={() => setOpenModal(false)}
                        />
                        <ButtonCustom
                            text="Xác nhận đã thanh toán"
                            onClick={confirmPayment}
                        />
                    </div>

                </div>

            </ModalCustom>
        </div>
    );
};

export default DetailsVe;