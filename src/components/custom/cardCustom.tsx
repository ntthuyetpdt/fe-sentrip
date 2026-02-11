import { ScheduleOutlined, UserOutlined } from "@ant-design/icons";
import ButtonCustom from "../../components/custom/button";

export type OrderStatus =
  | "pending"
  | "waiting_invoice"
  | "confirmed"
  | "invoiced"
  | "cancel";

type OrderCardProps = {
  image: string;
  title: string;
  type: string; // Ví dụ: Vé
  date: string;
  quantity: number;
  description: string;
  extraService?: string;
  status: OrderStatus;
  orderCode: string;
  totalPrice: string;
  onCancel?: () => void;
  onPay?: () => void;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  waiting_invoice: "Chờ xuất hoá đơn",
  confirmed: "Đã xác nhận",
  invoiced: "Đã xuất hoá đơn",
  cancel: "Đã huỷ",
};

const OrderCard = ({
  image,
  title,
  type,
  date,
  quantity,
  description,
  extraService,
  status,
  orderCode,
  totalPrice,
  onCancel,
  onPay,
}: OrderCardProps) => {
  return (
    <div className="order-card">

      <div className="order-left">
        <img src={image} alt={title} />
      </div>

      <div className="order-center">
        <h4>{title}</h4>

        <span className="tag">{type}</span>

        <div className="meta">
          <span><ScheduleOutlined/> {date}</span>
          <span><UserOutlined/> {quantity}</span>
        </div>

        <p className="desc">{description}</p>

        {extraService && (
          <p className="extra">
            <strong>Dịch vụ đi kèm:</strong> {extraService}
          </p>
        )}
      </div>


      <div className="order-right">
        <div className="top">
          <span className={`status ${status}`}>
            {STATUS_LABEL[status]}
          </span>

          <span className="code">MĐH : {orderCode}</span>
        </div>

        <div className="price">
          <span>Tổng thanh toán</span>
          <strong>{totalPrice}</strong>
        </div>

        <div className="actions">
          {status !== "cancel" && status !== "confirmed" && status !== "invoiced" && (
            <ButtonCustom
              className="btn-cancel"
              text="Hủy đơn hàng"
              onClick={onCancel}
            />
          )}

          {status !== "cancel" && status !== "invoiced" && (
            <ButtonCustom
              className="btn-pay"
              text="Thanh toán"
              onClick={onPay}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
