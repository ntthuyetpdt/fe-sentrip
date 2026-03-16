import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { viewProStatus, diDonProStatus } from "../../../api/api";

import { SendOutlined } from "@ant-design/icons";
import { Space, message, Popconfirm, Tag, Image } from "antd";

export interface ProStatus {
    bankAccount: string;
    bankName: string;
    billFileUrl: string;
    id: number;
    merchantId: number;
    merchantName: string;
    orderAmount: number;
    orderCode: string;
    payoutAmount: number;
    processedAt: string;
    requestedAt: string;
    status: string;
}

const STATUS_COLOR: Record<string, string> = {
    SUCCESS: "green",
    PENDING: "orange",
    PROCESSING: "blue",
    REJECTED: "red",
    PAID: "cyan",
};

const STATUS_LABEL: Record<string, string> = {
    SUCCESS: "Thành công",
    PENDING: "Chờ xử lý",
    PROCESSING: "Đang xử lý",
    REJECTED: "Từ chối",
    PAID: "Đã thanh toán",
};

const KiemTraTrangThaiDon = () => {

    const [data, setData] = useState<ProStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [dispatchingCode, setDispatchingCode] = useState<string | null>(null);

    const handleDiTien = async (orderCode: string) => {
        try {
            setDispatchingCode(orderCode);

            await diDonProStatus(orderCode);

            message.success(`Đã đi tiền đơn ${orderCode} thành công!`);

            setData((prev) =>
                prev.map((item) =>
                    item.orderCode === orderCode
                        ? { ...item, status: "SUCCESS" }
                        : item
                )
            );

        } catch (err) {
            console.log(err);
            message.error("Đi tiền thất bại!");
        } finally {
            setDispatchingCode(null);
        }
    };

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "orderCode",
        },
        {
            title: "Người nhận",
            dataIndex: "merchantName",
            render: (val: string, record: ProStatus) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{val}</div>
                    {/* <div style={{ fontSize: 12, color: "#888" }}>ID: {record.merchantId}</div> */}
                </div>
            ),
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
            render: (val: string, record: ProStatus) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{val}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{record.bankAccount}</div>
                </div>
            ),
        },
        {
            title: "Tiền đơn hàng",
            dataIndex: "orderAmount",
            render: (val: number) =>
                val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Tiền thanh toán",
            dataIndex: "payoutAmount",
            render: (val: number) =>
                val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        },
        {
            title: "Ảnh bill",
            dataIndex: "billFileUrl",
            render: (url: string) =>
                url ? (
                    <Image
                        src={url}
                        alt="bill"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                ) : (
                    <span style={{ color: "#ccc" }}>—</span>
                ),
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: "requestedAt",
            render: (date: string) =>
                date ? new Date(date).toLocaleString("vi-VN") : "—",
        },
        {
            title: "Ngày xử lý",
            dataIndex: "processedAt",
            render: (date: string) =>
                date ? new Date(date).toLocaleString("vi-VN") : "—",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={STATUS_COLOR[status] || "default"}>
                    {STATUS_LABEL[status] || status}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            render: (_: any, record: ProStatus) => {

                const canPay = record.status !== "SUCCESS";
                const isDispatching = dispatchingCode === record.orderCode;

                return (
                    <Space>
                        <Popconfirm
                            title="Xác nhận đi tiền?"
                            description={`Yêu cầu đi tiền đến kế toán`}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            disabled={!canPay || isDispatching}
                            onConfirm={() => handleDiTien(record.orderCode)}
                        >
                            <SendOutlined
                                style={{
                                    fontSize: 17,
                                    color: canPay && !isDispatching ? "#1677ff" : "#d9d9d9",
                                    cursor: canPay && !isDispatching ? "pointer" : "not-allowed",
                                    opacity: isDispatching ? 0.5 : 1,
                                }}
                                title={canPay ? "Đi tiền" : "Đã hoàn thành"}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await viewProStatus();

            if (res?.data) {
                setData(res.data);
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <CommonTable<ProStatus>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKeyField="id"
                hideSearch
            />
        </div>
    );
};

export default KiemTraTrangThaiDon;