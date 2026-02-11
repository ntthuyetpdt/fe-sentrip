import { SearchOutlined } from "@ant-design/icons"
import BgWhiteBorder from "../../components/custom/bgWhiteBoder"
import CardUser from "../../components/custom/cardUser"
import MenuCustom from "../../components/custom/menu"
import ButtonCustom from "../../components/custom/button"
import { Tabs } from "antd"
import OrderCard from "../../components/custom/cardCustom"
const items = [
    {
        key: "all",
        label: "Tất cả",
        children: <div>Nội dung tất cả đơn hàng</div>,
    },
    {
        key: "pending",
        label: "Chờ xác nhận",
        children: <div>Nội dung chờ xác nhận</div>,
    },
    {
        key: "confirmed",
        label: "Đã xác nhận",
        children: <div>Nội dung đã xác nhận</div>,
    },
    {
        key: "cancel",
        label: "Đã hủy",
        children: <div>Nội dung đã hủy</div>,
    },
    {
        key: "invoice",
        label: "Đã xuất hóa đơn",
        children: <div>Nội dung đã xuất hóa đơn</div>,
    },
];
const QuanLiDonHang = () => {
    return (
        <div className="quanLiDonHang">
            <BgWhiteBorder className="bg">
                <div className="top-content-QLDH">
                    <h3>Đơn hàng của tôi</h3>
                    <div className="search-QLDH">
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng"
                        />
                        <ButtonCustom className="btn-search-QLDH" text={<SearchOutlined />} />
                    </div>
                </div>
                <div className="tab-menu">
                    <Tabs
                        items={items}
                        defaultActiveKey="all"
                    />
                </div>
                <div className="card-list">
                    <OrderCard
                        image="https://nads.1cdn.vn/2024/11/22/74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png"
                        title="VinWonder Nha Trang"
                        type="Vé"
                        date="15/10/2025"
                        quantity={10}
                        description="Vé Show Kiss of the Sea, Vé Show Kiss..."
                        extraService="Bữa trưa, Xe đưa đón"
                        status="waiting_invoice"
                        orderCode="MDH001"
                        totalPrice="1.820.000 VND"
                        onCancel={() => console.log("Hủy đơn")}
                        onPay={() => console.log("Thanh toán")}
                    />

                </div>
            </BgWhiteBorder>
        </div>
    )
}
export default QuanLiDonHang