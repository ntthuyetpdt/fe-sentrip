import React, { useEffect, useState } from "react";
import { Card, DatePicker, Row, Col } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs, { Dayjs } from "dayjs";

import { viewMerchanTotal } from "../../../api/api";

const { MonthPicker } = DatePicker;

const DoanhThu = () => {
    const [data, setData] = useState({
        totalRevenue: 0,
        totalCustomers: 0,
        totalOrders: 0,
        successOrders: 0,
        cancelledOrders: 0
    });

    const [month, setMonth] = useState(dayjs());

    const loadData = async (selectedMonth: Dayjs) => {
        const startDate = selectedMonth.startOf("month").hour(0).minute(0).second(0);
        const endDate = selectedMonth.endOf("month").hour(0).minute(0).second(0);

        const body = {
            startDate: startDate.format("YYYY-MM-DDTHH:mm:ss"),
            endDate: endDate.format("YYYY-MM-DDTHH:mm:ss")
        };

        const res = await viewMerchanTotal(body);
        setData(res);
    };

    useEffect(() => {
        loadData(month);
    }, []);

    const handleChangeMonth = (value: Dayjs | null) => {
        if (!value) return;
        setMonth(value);
        loadData(value);
    };

    const pieOptions: Highcharts.Options = {
        chart: {
            type: "pie",
            height: 520,
            animation: false,
            reflow: false,
            backgroundColor: "transparent",
        },
        title: {
            text: "Tỷ lệ đơn hàng",
        },
        series: [
            {
                type: "pie",
                name: "Orders",
                data: [
                    { name: "Thành công", y: data.successOrders, color: "#3b82f6" },
                    { name: "Đã huỷ", y: data.cancelledOrders, color: "#ef4444" }
                ],
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.percentage:.1f}%",
                }
            }
        ],
        tooltip: {
            pointFormat: "{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)"
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                showInLegend: true,
                innerSize: "0%",
            }
        },
        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
        },
        credits: {
            enabled: false
        }
    };

    return (
        <div className="doanh-thu-container">
            <div className="dt-header">
                <h1 className="dt-title">Thống kê doanh thu</h1>
                <MonthPicker
                    className="dt-month-picker"
                    value={month}
                    onChange={handleChangeMonth}
                    placeholder="Chọn tháng"
                    format="MM/YYYY"
                />
            </div>

            <Row gutter={[20, 20]} className="dt-stats-row">
                {/* FIX: className đặt trên <Col>, Card nhận class qua prop className */}
                <Col xs={24} sm={24} md={8}>
                    {/* FIX: class màu đặt trên wrapper div thay vì trực tiếp lên Card */}
                    <div className="dt-stat-card dt-stat-card--revenue">
                        <Card>
                            <div className="dt-stat-icon">
                                <i className="fas fa-chart-line" />
                            </div>
                            <div className="dt-stat-content">
                                <h3 className="dt-stat-label">Tổng doanh thu</h3>
                                <h2 className="dt-stat-value">{data.totalRevenue.toLocaleString()} đ</h2>
                            </div>
                        </Card>
                    </div>
                </Col>

                <Col xs={24} sm={24} md={8}>
                    <div className="dt-stat-card dt-stat-card--customers">
                        <Card>
                            <div className="dt-stat-icon">
                                <i className="fas fa-users" />
                            </div>
                            <div className="dt-stat-content">
                                <h3 className="dt-stat-label">Tổng khách hàng</h3>
                                <h2 className="dt-stat-value">{data.totalCustomers}</h2>
                            </div>
                        </Card>
                    </div>
                </Col>

                <Col xs={24} sm={24} md={8}>
                    <div className="dt-stat-card dt-stat-card--orders">
                        <Card>
                            <div className="dt-stat-icon">
                                <i className="fas fa-shopping-cart" />
                            </div>
                            <div className="dt-stat-content">
                                <h3 className="dt-stat-label">Tổng đơn hàng</h3>
                                <h2 className="dt-stat-value">{data.totalOrders}</h2>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>

            <Row gutter={[20, 20]}>
                <Col xs={24} lg={24}>
                    <Card className="dt-chart-card">
                        <div className="dt-chart-header">
                            <h3 className="dt-chart-title">Phân tích đơn hàng</h3>
                            <div className="dt-chart-legend">
                                <span className="dt-legend-item dt-legend-item--success">
                                    <span className="dt-legend-dot" />
                                    Thành công: {data.successOrders}
                                </span>
                                <span className="dt-legend-item dt-legend-item--cancelled">
                                    <span className="dt-legend-dot" />
                                    Đã huỷ: {data.cancelledOrders}
                                </span>
                            </div>
                        </div>
                    
                        <div className="dt-chart-wrapper">
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={pieOptions}
                                immutable={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DoanhThu;