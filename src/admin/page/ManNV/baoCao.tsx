import React, { useEffect, useState, useMemo } from "react";
import CommonTable from "../../../components/custom/table";
import { baoCaoNV, NVTK } from "../../../api/api";

import { Card, Row, Col, message } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import styles from "./NVBaoCao.module.scss";

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

    // ── Filter state ──────────────────────────────
    const [filterName, setFilterName] = useState("");
    const [revenueMin, setRevenueMin] = useState("");
    const [revenueMax, setRevenueMax] = useState("");

    // ── Filtered data ─────────────────────────────
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (
                filterName.trim() &&
                !item.productName.toLowerCase().includes(filterName.trim().toLowerCase())
            ) return false;

            if (revenueMin !== "" && !isNaN(Number(revenueMin))) {
                if (item.totalRevenue < Number(revenueMin)) return false;
            }

            if (revenueMax !== "" && !isNaN(Number(revenueMax))) {
                if (item.totalRevenue > Number(revenueMax)) return false;
            }

            return true;
        });
    }, [data, filterName, revenueMin, revenueMax]);

    const hasActiveFilters =
        filterName.trim() !== "" || revenueMin !== "" || revenueMax !== "";

    const handleReset = () => {
        setFilterName("");
        setRevenueMin("");
        setRevenueMax("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") handleReset();
    };

    const columns = [
        { title: "ID sản phẩm", dataIndex: "productId" },
        { title: "Tên dịch vụ", dataIndex: "productName" },
        { title: "Dịch vụ thêm", dataIndex: "additionalServices" },
        { title: "Tổng khách", dataIndex: "totalCustomers" },
        { title: "Tổng đơn", dataIndex: "totalOrders" },
        {
            title: "Doanh thu",
            dataIndex: "totalRevenue",
            render: (price: number) => price?.toLocaleString("vi-VN") + " đ",
        },
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resTongQuan, resProduct] = await Promise.all([NVTK(), baoCaoNV()]);
            if (resTongQuan?.data) setTongQuan(resTongQuan.data);
            if (resProduct?.data) setData(resProduct.data);
        } catch (err) {
            console.log(err);
            message.error("Không tải được báo cáo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div>
            {/* ── Stat cards ── */}
            <div className="nv-baocao-container">
                <Row gutter={16} className="nv-stats-row">
                    <Col span={12} className="nv-stat-card nv-stat-card--orders">
                        <Card>
                            <div className="nv-stat-icon"><ShoppingCartOutlined /></div>
                            <div className="nv-stat-content">
                                <p className="nv-stat-label">Tổng giao dịch</p>
                                <p className="nv-stat-value">{tongQuan?.totalTransactions || 0}</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12} className="nv-stat-card nv-stat-card--revenue">
                        <Card>
                            <div className="nv-stat-icon"><DollarOutlined /></div>
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

            {/* ── Filter bar ── */}
            <div className={styles.filterBar}>

                {/* Tên dịch vụ */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Tên dịch vụ</span>
                    <input
                        className={styles.filterInput}
                        type="text"
                        placeholder="Tìm tên dịch vụ..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={styles.filterDivider} />

                {/* Doanh thu */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Doanh thu (đ)</span>
                    <div className={styles.priceRangeBox}>
                        <input
                            className={styles.priceInput}
                            type="number"
                            placeholder="Từ"
                            value={revenueMin}
                            onChange={(e) => setRevenueMin(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span className={styles.priceSeparator}>—</span>
                        <input
                            className={styles.priceInput}
                            type="number"
                            placeholder="Đến"
                            value={revenueMax}
                            onChange={(e) => setRevenueMax(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.filterActions}>
                    {hasActiveFilters && (
                        <>
                            <span className={styles.resultCount}>
                                Hiển thị <b>{filteredData.length}</b> / {data.length} dịch vụ
                            </span>
                            <button className={styles.resetBtn} onClick={handleReset}>
                                ✕ Xóa bộ lọc
                            </button>
                        </>
                    )}
                </div>
            </div>

            <CommonTable<BaoCaoProduct>
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKeyField="productId"
                hideSearch
            />
        </div>
    );
};

export default NVBaoCao;