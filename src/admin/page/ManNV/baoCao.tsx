import React, { useEffect, useState } from "react";
import CommonTable from "../../../components/custom/table";
import { baoCaoNV, NVTK } from "../../../api/api";

import { Card, Row, Col, Statistic, message } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";

export interface BaoCaoProduct {
    productId: number;
    productName: string;
    additionalServices: string;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
}

interface TongQuan {
    totalTransactions: number;
    totalRevenue: number;
}

const NVBaoCao = () => {
    const [data, setData] = useState<BaoCaoProduct[]>([]);
    const [tongQuan, setTongQuan] = useState<TongQuan | null>(null);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: "ID sản phẩm",
            dataIndex: "productId",
        },
        {
            title: "Tên dịch vụ",
            dataIndex: "productName",
        },
        {
            title: "Dịch vụ thêm",
            dataIndex: "additionalServices",
        },
        {
            title: "Tổng khách",
            dataIndex: "totalCustomers",
        },
        {
            title: "Tổng đơn",
            dataIndex: "totalOrders",
        },
        {
            title: "Doanh thu",
            dataIndex: "totalRevenue",
            render: (price: number) => price?.toLocaleString("vi-VN") + " đ",
        },
    ];

    const fetchData = async () => {
        try {
            setLoading(true);

            const resTongQuan = await NVTK();
            const resProduct = await baoCaoNV();

            if (resTongQuan?.data) {
                setTongQuan(resTongQuan.data);
            }

            if (resProduct?.data) {
                setData(resProduct.data);
            }
        } catch (err) {
            console.log(err);
            message.error("Không tải được báo cáo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>

            <div className="nv-baocao-container">
                <Row gutter={16} className="nv-stats-row">

                    <Col span={12} className="nv-stat-card nv-stat-card--orders">
                        <Card>
                            <div className="nv-stat-icon">
                                <ShoppingCartOutlined />
                            </div>

                            <div className="nv-stat-content">
                                <p className="nv-stat-label">Tổng giao dịch</p>
                                <p className="nv-stat-value">{tongQuan?.totalTransactions || 0}</p>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12} className="nv-stat-card nv-stat-card--revenue">
                        <Card>
                            <div className="nv-stat-icon">
                                <DollarOutlined />
                            </div>

                            <div className="nv-stat-content">
                                <p className="nv-stat-label">Tổng doanh thu</p>
                                <p className="nv-stat-value">
                                    {tongQuan?.totalRevenue?.toLocaleString("vi-VN")} đ
                                </p>
                            </div>
                        </Card>
                    </Col>

                </Row>
            </div>


            <CommonTable<BaoCaoProduct>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKeyField="productId"
                hideSearch
            />
        </div>
    );
};

export default NVBaoCao;