import { ScheduleOutlined } from "@ant-design/icons";
import ButtonCustom from "../../components/custom/button";

export type OrderStatus =
  | "PENDING"
  | "PENDING_PAYMENT"
  | "CONFIRM"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REFUNDED";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  PENDING_PAYMENT: "Chờ thanh toán",
  CONFIRM: "Đã xác nhận",
  PAID: "Đã thanh toán",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  REFUND_REQUESTED: "Yêu cầu hoàn vé",
  REFUNDED: "Đã hoàn tiền",
};

type OrderCardProps = {
  id?: number;
  img?: string | null;
  productName?: string;
  serviceType?: string;
  createdAt?: string;
  Type?: string;
  price?: number | string;
  refundable?: number;
  status?: OrderStatus;
  viewProduct?: boolean;
  viewCart?: boolean;
  additionalService?: string;
  orderCode?: string;
  quantities?: number | string;
  onCancel?: () => void;
  onPay?: () => void;
  onOrder?: (id: number) => void;
};

const OrderCard = ({
  id,
  img,
  productName,
  serviceType,
  createdAt,
  Type,
  price,
  refundable,
  status,
  additionalService,
  quantities,
  viewProduct = false,
  viewCart = false,
  orderCode,
  onCancel,
  onPay,
  onOrder,
}: OrderCardProps) => {
  return (
    <div className="order-card">
      {img && (
        <div className="order-left">
          <img src={img} alt={productName || "product"} />
        </div>
      )}

      <div className="order-center">
        {productName && <h4>{productName}</h4>}

        {serviceType && <span className="tag">{serviceType}</span>}

        {createdAt && (
          <div className="meta">
            <span>
              <ScheduleOutlined />{" "}
              {new Date(createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        )}

        {Type && <p className="desc">{Type}</p>}

        {additionalService && (
          <p className="desc">
            Dịch vụ đi kèm: {additionalService}
          </p>
        )}

        {refundable !== undefined && (
          <p className="extra">
            <span>Hoàn huỷ: </span>
            {refundable === 0
              ? "Có thể hoàn tiền"
              : "Không hỗ trợ hoàn tiền"}
          </p>
        )}
      </div>

      <div className="order-right">
        {!viewProduct && status && (
          <div className="top">
            <span className={`status-${status}`}>
              {STATUS_LABEL[status]}
            </span>

            {orderCode && (
              <span className="code">
                MĐH: {orderCode}
              </span>
            )}
          </div>
        )}

        {(price || quantities) && (
          <div className="price">
            {quantities && (
              <span>Số lượng: {quantities}</span>
            )}
            <br />
            {price && (
              <>
                <span>Tổng thanh toán:</span>
                <strong>
                  {Number(price).toLocaleString("vi-VN")} đ
                </strong>
              </>
            )}
          </div>
        )}

        <div className="actions">
          {viewCart && (
            <ButtonCustom
              className="btn-pay"
              text="Chỉnh sửa"
              onClick={onPay}
            />
          )
          }
          {viewProduct && (
            id && (
              <ButtonCustom
                className="btn-pay"
                text="Đặt hàng"
                onClick={() => onOrder?.(id)}
              />
            )
          )}

          {!viewProduct && status === "PENDING" && (
            <ButtonCustom
              className="btn-pay"
              text="Thanh toán"
              onClick={onPay}
            />
          )}

          {!viewProduct && status === "CONFIRM" && null}

          {!viewProduct && status === "PAID" && null}

          {!viewProduct && status === "COMPLETED" && null}

          {!viewProduct && status === "CANCELLED" && null}

          {!viewProduct && status === "REFUND_REQUESTED" && null}

          {!viewProduct && status === "REFUNDED" && null}

        </div>
      </div>
    </div>
  );
};

export default OrderCard;