import React, { useEffect, useState } from "react";
import { Space, Tag, Upload, Modal, message, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import CommonTable from "../../../components/custom/table";
import BtnCustom from "../../../components/custom/button";
import { viewInvoiceMerchant } from "../../../api/api";

export interface MerchantPayout {
    id: number;
    orderCode: string;
    merchantId: number;
    merchantName: string;
    bankName: string;
    bankAccount: string;
    orderAmount: number;
    payoutAmount: number;
    status: string;
    billFileUrl: string;
    requestedAt: string;
    processedAt: string;
}

const DOMAIN = process.env.REACT_APP_API_URL;

const GetMerchantDiTien: React.FC = () => {
    const [data, setData] = useState<MerchantPayout[]>([]);
    const [loading, setLoading] = useState(false);

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await viewInvoiceMerchant();
            setData(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const openUploadModal = (id: number) => {
        setSelectedId(id);
        setUploadModalOpen(true);
    };

    const handleUploadOk = async () => {
        if (!selectedFile || !selectedId) {
            message.warning("Vui lòng chọn ảnh");
            return;
        }

        try {
            setUploadLoading(true);

            const formData = new FormData();
            formData.append("img", selectedFile);

            const res = await fetch(`${DOMAIN}/payout/process/${selectedId}?img`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();

            message.success(data?.message || "Đi đơn thành công");

            setUploadModalOpen(false);
            setSelectedFile(null);
            setPreview(null);

            fetchData();
        } catch (err) {
            message.error("Đi đơn thất bại");
        } finally {
            setUploadLoading(false);
        }
    };

    const columns: ColumnsType<MerchantPayout> = [
        {
            title: "Mã đơn",
            dataIndex: "orderCode",
        },
        {
            title: "Merchant",
            dataIndex: "merchantName",
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
        },
        {
            title: "Số tài khoản",
            dataIndex: "bankAccount",
        },
        {
            title: "Ảnh bill",
            dataIndex: "billFileUrl",
            render: (url: string) =>
                url ? (
                    <Image
                        src={url}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                ) : (
                    "Chưa có"
                ),
        },
        {
            title: "Số tiền đơn",
            dataIndex: "orderAmount",
            render: (amount: number) =>
                amount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }),
        },
        {
            title: "Số tiền payout",
            dataIndex: "payoutAmount",
            render: (amount: number) =>
                amount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={status === "PAID" ? "green" : "orange"}>{status}</Tag>
            ),
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: "requestedAt",
            render: (date: string) => new Date(date).toLocaleString("vi-VN"),
        },
        {
            title: "Thao tác",
            render: (_: unknown, record: MerchantPayout) => (
                <Space>
                    <BtnCustom
                        text="Đi đơn"
                        disabled={record.status !== "PAID"}
                        onClick={() => openUploadModal(record.id)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <CommonTable<MerchantPayout>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKeyField="id"
            />

            <Modal
                title="Upload ảnh xác nhận"
                open={uploadModalOpen}
                onCancel={() => setUploadModalOpen(false)}
                footer={null}
            >
                <Upload
                    beforeUpload={(file) => {
                        setSelectedFile(file);
                        const previewUrl = URL.createObjectURL(file);
                        setPreview(previewUrl);
                        return false;
                    }}
                    maxCount={1}
                >
                    <BtnCustom text="Chọn ảnh" />
                </Upload>

                {preview && (
                    <div style={{ marginTop: 16 }}>
                        <Image src={preview} width={200} style={{ borderRadius: 8 }} />
                    </div>
                )}

                <div
                    style={{
                        marginTop: 20,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                    }}
                >
                    <BtnCustom text="Hủy" onClick={() => setUploadModalOpen(false)} />

                    <BtnCustom
                        text="OK"


                        onClick={handleUploadOk}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default GetMerchantDiTien;