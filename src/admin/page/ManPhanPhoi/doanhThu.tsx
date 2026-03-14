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

    const pieOptions = {
        chart: {
            type: "pie"
        },
        title: {
            text: "Tỷ lệ đơn hàng"
        },
        series: [
            {
                name: "Orders",
                data: [
                    { name: "Thành công", y: data.successOrders },
                    { name: "Đã huỷ", y: data.cancelledOrders }
                ]
            }
        ]
    };

    return (
        <div>

            <div style={{ marginBottom: 20, width: "100%", display: 'flex', justifyContent: 'end' }}>
                <MonthPicker
                    value={month}
                    onChange={handleChangeMonth}
                    placeholder="Chọn tháng"
                />
            </div>

            <Row gutter={16} className="row-cards">
                <Col span={8}>
                    <Card className="card-revenue">
                        <h3>Tổng doanh thu</h3>
                        <h2>{data.totalRevenue.toLocaleString()} đ</h2>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card className="card-customers">
                        <h3>Tổng khách hàng</h3>
                        <h2>{data.totalCustomers}</h2>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card className="card-orders">
                        <h3>Tổng đơn hàng</h3>
                        <h2>{data.totalOrders}</h2>
                    </Card>
                </Col>
            </Row>

            <Card>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={pieOptions}
                />
            </Card>

        </div>
    );
};

export default DoanhThu;