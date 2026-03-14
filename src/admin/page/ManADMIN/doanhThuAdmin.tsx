import React, { useEffect, useState } from "react";
import { Card, DatePicker, Row, Col, Spin, Empty } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs, { Dayjs } from "dayjs";
import { 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UserOutlined,
  TeamOutlined,
  ShopOutlined,
  LoadingOutlined 
} from '@ant-design/icons';

import { dashboardAdmin, dashboardAdminBD } from "../../../api/api";
const { RangePicker } = DatePicker;

interface DashboardData {
  getCancelledOrders: number;
  getSuccessOrders: number;
  getTotalCustomers: number;
  getTotalEmployees: number;
  getTotalMerchants: number;
  getTotalOrders: number;
}

interface RevenueMonth {
  month: string;
  revenue: number;
}

interface LoadingState {
  dashboard: boolean;
  chart: boolean;
}

const DoanhThuAdmin: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardData>({
    getCancelledOrders: 0,
    getSuccessOrders: 0,
    getTotalCustomers: 0,
    getTotalEmployees: 0,
    getTotalMerchants: 0,
    getTotalOrders: 0
  });

  const [chartData, setChartData] = useState<RevenueMonth[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    dashboard: false,
    chart: false
  });

  const [dashboardDate, setDashboardDate] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month")
  ]);

  const [chartDate, setChartDate] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("year"),
    dayjs().endOf("year")
  ]);

  const loadDashboard = async (start: Dayjs, end: Dayjs) => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    const body = {
      startDate: start.format("YYYY-MM-DDTHH:mm:ss"),
      endDate: end.format("YYYY-MM-DDTHH:mm:ss")
    };

    try {
      const res = await dashboardAdmin(body);
      if (res?.data) {
        setDashboard(res.data);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  const loadChart = async (start: Dayjs, end: Dayjs) => {
    setLoading(prev => ({ ...prev, chart: true }));
    const body = {
      startDate: start.format("YYYY-MM-DDTHH:mm:ss"),
      endDate: end.format("YYYY-MM-DDTHH:mm:ss")
    };

    try {
      const res = await dashboardAdminBD(body);
      if (res?.data) {
        setChartData(res.data);
      }
    } catch (err) {
      console.error("Error loading chart:", err);
    } finally {
      setLoading(prev => ({ ...prev, chart: false }));
    }
  };

  useEffect(() => {
    loadDashboard(dashboardDate[0], dashboardDate[1]);
    loadChart(chartDate[0], chartDate[1]);
  }, []);

  const handleDashboardDate = (value: any) => {
    if (!value) return;
    setDashboardDate(value);
    loadDashboard(value[0], value[1]);
  };

  const handleChartDate = (value: any) => {
    if (!value) return;
    setChartDate(value);
    loadChart(value[0], value[1]);
  };

  const calculateSuccessRate = () => {
    if (dashboard.getTotalOrders === 0) return 0;
    return ((dashboard.getSuccessOrders / dashboard.getTotalOrders) * 100).toFixed(1);
  };

  const calculateCancelledRate = () => {
    if (dashboard.getTotalOrders === 0) return 0;
    return ((dashboard.getCancelledOrders / dashboard.getTotalOrders) * 100).toFixed(1);
  };

  const lineOptions: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: 'transparent'
    },
    title: {
      text: "Biểu đồ doanh thu theo tháng",
      style: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937'
      }
    },
    subtitle: {
      text: `Từ ${chartDate[0].format("MM/YYYY")} đến ${chartDate[1].format("MM/YYYY")}`,
      style: {
        fontSize: '13px',
        color: '#6b7280'
      }
    },
    xAxis: {
      categories: chartData.map((item) => item.month),
      labels: {
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      }
    },
    yAxis: {
      title: {
        text: "Doanh thu (VNĐ)",
        style: {
          fontSize: '13px',
          color: '#6b7280'
        }
      },
      labels: {
        formatter: function () {
          return Number(this.value).toLocaleString() + " đ";
        },
        style: {
          fontSize: '11px',
          color: '#6b7280'
        }
      }
    },
    tooltip: {
      formatter: function() {
        return `<b>${this.x}</b><br/>Doanh thu: ${Number(this.y).toLocaleString()} đ`;
      }
    },
    series: [
      {
        type: "line",
        name: "Doanh thu",
        data: chartData.map((item) => item.revenue),
        color: '#3b82f6'
      }
    ],
    credits: {
      enabled: false
    }
  };

  const cardConfigs = [
    {
      key: 'totalOrders',
      title: 'Tổng đơn hàng',
      value: dashboard.getTotalOrders,
      icon: <ShoppingCartOutlined />,
      className: 'total-orders'
    },
    {
      key: 'successOrders',
      title: 'Đơn thành công',
      value: dashboard.getSuccessOrders,
      icon: <CheckCircleOutlined />,
      className: 'success-orders'
    },
    {
      key: 'cancelledOrders',
      title: 'Đơn bị huỷ',
      value: dashboard.getCancelledOrders,
      icon: <CloseCircleOutlined />,
      className: 'cancelled-orders'
    },
    {
      key: 'totalCustomers',
      title: 'Tổng khách hàng',
      value: dashboard.getTotalCustomers,
      icon: <UserOutlined />,
      className: 'total-customers'
    },
    {
      key: 'totalEmployees',
      title: 'Tổng nhân viên',
      value: dashboard.getTotalEmployees,
      icon: <TeamOutlined />,
      className: 'total-employees'
    },
    {
      key: 'totalMerchants',
      title: 'Tổng merchant',
      value: dashboard.getTotalMerchants,
      icon: <ShopOutlined />,
      className: 'total-merchants'
    }
  ];

  return (
    <div className="dashboard-admin">
      <div className="dashboard-header">
        <h1>Thống kê</h1>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Tỉ lệ thành công:</span>
            <span className={`stat-value success`}>
              {calculateSuccessRate()}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tỉ lệ huỷ:</span>
            <span className={`stat-value danger`}>
              {calculateCancelledRate()}%
            </span>
          </div>
        </div>
      </div>


      <div className="date-picker-section">
        <span className="label">
          <ShoppingCartOutlined /> Thống kê đơn hàng:
        </span>
        <RangePicker 
          value={dashboardDate} 
          onChange={handleDashboardDate}
          format="DD/MM/YYYY"
          allowClear={false}
          disabled={loading.dashboard}
        />
      </div>


      <Row gutter={[16, 16]} className="stats-grid">
        {cardConfigs.map((config) => (
          <Col xs={24} sm={12} lg={8} key={config.key}>
            <div className={`stat-card ${config.className}`}>
              <Card>
                <div className="card-content">
                  <div className="card-icon">
                    {config.icon}
                  </div>
                  <div className="card-info">
                    <h3>{config.title}</h3>
                    {loading.dashboard ? (
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                    ) : (
                      <h2>{config.value?.toLocaleString() || 0}</h2>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {/* Summary cards */}
      <Row gutter={[16, 16]} className="summary-grid">
        <Col xs={24} sm={12} lg={8}>
          <Card className="summary-card">
            <div className="summary-content">
              <div className="summary-label">Tổng doanh thu</div>
              <div className="summary-value">
                {chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} đ
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="summary-card">
            <div className="summary-content">
              <div className="summary-label">Doanh thu trung bình/tháng</div>
              <div className="summary-value">
                {chartData.length > 0 
                  ? Math.round(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString() 
                  : 0} đ
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="summary-card">
            <div className="summary-content">
              <div className="summary-label">Tháng cao nhất</div>
              <div className="summary-value">
                {chartData.length > 0 
                  ? chartData.reduce((max, item) => item.revenue > max.revenue ? item : max, chartData[0])?.month || 'N/A'
                  : 'N/A'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Chart section */}
      <div className="chart-section">
        <div className="chart-header">
          <div>
            <h2>Biểu đồ doanh thu</h2>
            <p className="chart-subtitle">
              Theo dõi xu hướng doanh thu theo thời gian
            </p>
          </div>
          <div className="chart-controls">
            <span className="label">
              Chọn khoảng thời gian:
            </span>
            <RangePicker 
              value={chartDate} 
              onChange={handleChartDate}
              format="MM/YYYY"
              picker="month"
              allowClear={false}
              disabled={loading.chart}
            />
          </div>
        </div>
        
        <div className="chart-container">
          {loading.chart ? (
            <div className="loading-container">
              <Spin 
                indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} 
                tip="Đang tải dữ liệu..."
              />
            </div>
          ) : chartData.length > 0 ? (
            <HighchartsReact 
              highcharts={Highcharts} 
              options={lineOptions}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có dữ liệu trong khoảng thời gian này"
            >
              <span className="empty-hint">
                Vui lòng chọn khoảng thời gian khác
              </span>
            </Empty>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>Cập nhật lần cuối: {dayjs().format('DD/MM/YYYY HH:mm:ss')}</p>
      </div>
    </div>
  );
};

export default DoanhThuAdmin;