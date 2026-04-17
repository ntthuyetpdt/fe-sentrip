import React, { useEffect, useState } from "react";
import { Checkbox, DatePicker, Empty, message } from "antd";
import OrderCard from "../../components/custom/cardCustom";
import { addCart, deleteCart, orderTicket, updateCart, viewCard } from "../../api/api";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ModalCustom from "../../components/custom/modal";
import ButtonCustom from "../../components/custom/button";
import dayjs, { Dayjs } from "dayjs";

interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  img: string;
  merchantId: number;
  NSD: string;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const getCart = async () => {
    const res = await viewCard();
    setCart(res?.data || []);
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(cart.map((i) => i.cartItemId));
    } else {
      setSelected([]);
    }
  };

  const openEditModal = (item: CartItem) => {
    setCurrentItem(item);
    setQuantity(item.quantity);
    // Nếu item có NSD thì dùng, không thì dùng ngày hiện tại
    setSelectedDate(item.NSD ? dayjs(item.NSD) : dayjs());
    setOpenModal(true);
  };

  // Disable những ngày đã qua
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  // Chỉnh sửa số lượng + ngày - dùng updateCart
  const handleSaveQuantity = async () => {
    if (!currentItem) return;

    const newCart = cart.map((item) =>
      item.cartItemId === currentItem.cartItemId
        ? { ...item, quantity, NSD: selectedDate.format("YYYY-MM-DD") }
        : item
    );

    setCart(newCart);
    setOpenModal(false);

    try {
      await updateCart(currentItem.cartItemId, {
        quantity: quantity,
        NSD: selectedDate.format("YYYY-MM-DD"),
      });
      message.success("Cập nhật giỏ hàng thành công!");
    } catch (error) {
      message.error("Cập nhật giỏ hàng thất bại!");
    }
  };

  // Đặt 1 đơn riêng lẻ
  const handleOrderSingle = async (item: CartItem) => {
    try {
      await orderTicket({
        merchantId: item.merchantId,
        items: [{ productId: item.productId, quantity: item.quantity }],
        NSD: dayjs(item.NSD).format("YYYY-MM-DD"),
      });
      message.success("Đặt hàng thành công");
      window.location.href = "/orders";
    } catch {
      message.error("Đặt hàng thất bại");
    }
  };

  // Đặt nhiều đơn khi ở edit mode
  const handleOrderMultiple = async () => {
    if (selected.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 dịch vụ");
      return;
    }

    const selectedItems = cart.filter((item) =>
      selected.includes(item.cartItemId)
    );

    try {
      for (const item of selectedItems) {
        await orderTicket({
          merchantId: item.merchantId,
          items: [{ productId: item.productId, quantity: item.quantity }],
          NSD: dayjs(item.NSD).format("YYYY-MM-DD"),
        });
      }
      message.success(`Đặt hàng thành công ${selectedItems.length} đơn`);
      window.location.href = "/orders";
    } catch {
      message.error("Đặt hàng thất bại");
    }
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      message.warning("Vui lòng chọn dịch vụ cần xoá");
      return;
    }

    try {
      for (const id of selected) {
        await deleteCart(id);
      }
      setCart(cart.filter((item) => !selected.includes(item.cartItemId)));
      setSelected([]);
      message.success("Xoá dịch vụ thành công");
    } catch (error) {
      message.error("Xoá dịch vụ thất bại");
    }
  };

  const totalPrice = currentItem ? Number(currentItem.price) * quantity : 0;

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <BgWhiteBorder>
            <div className="header-content">
              <h3>Giỏ hàng</h3>

              {!editMode ? (
                <ButtonCustom text="Chọn" onClick={() => setEditMode(true)} />
              ) : (
                <div className="edit-actions">
                  <Checkbox onChange={(e) => handleSelectAll(e.target.checked)}>
                    Chọn tất cả
                  </Checkbox>

                  <ButtonCustom text="Xoá" onClick={handleDelete} />
                  <ButtonCustom text="Đặt hàng" onClick={handleOrderMultiple} />

                  <ButtonCustom
                    text="Xong"
                    onClick={() => {
                      setEditMode(false);
                      setSelected([]);
                    }}
                  />
                </div>
              )}
            </div>
          </BgWhiteBorder>
        </div>

        <BgWhiteBorder>
          <div className="cart-body">

            {cart?.length === 0 ? (
              <Empty description="Giỏ hàng của bạn đang trống" />
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="cart-item">

                  {editMode && (
                    <Checkbox
                      className="checkbox"
                      checked={selected.includes(item.cartItemId)}
                      onChange={() => handleSelect(item.cartItemId)}
                    />
                  )}

                  <div className="card-wrapper">
                    <OrderCard
                      id={item.productId}
                      img={item.img}
                      productName={item.productName}
                      quantities={item.quantity}
                      price={Number(item.price) * item.quantity}
                      viewProduct
                      viewCart
                      NSD={item.NSD}
                      onPay={() => openEditModal(item)}
                      onOrder={() => handleOrderSingle(item)}
                    />
                  </div>

                </div>
              ))
            )}

          </div>
        </BgWhiteBorder>

        <ModalCustom
          open={openModal}
          onClose={() => setOpenModal(false)}
          width={600}
        >
          {currentItem && (
            <div className="modal-order">

              <h3 className="product-name">{currentItem.productName}</h3>

              <div className="modal-middle" style={{ display: 'flex', flexDirection: "column" }}>

                <div className="price">
                  Giá: {Number(currentItem.price).toLocaleString()} đ
                </div>

                {/* Chỉnh sửa ngày - disable ngày đã qua */}
                <div className="date-picker-box" style={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: "20px", fontWeight: "600" }}>Ngày sử dụng:</span>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => {
                      if (date) setSelectedDate(date);
                    }}
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                    allowClear={false}
                  />
                </div>

                <div className="quantity-box">
                  <button onClick={handleDecrease}>-</button>
                  <span>{quantity}</span>
                  <button onClick={handleIncrease}>+</button>
                </div>

                <div className="total">
                  Tổng tiền: {totalPrice.toLocaleString()} đ
                </div>

              </div>

              <div className="modal-actions">
                <ButtonCustom text="Lưu" onClick={handleSaveQuantity} />
              </div>

            </div>
          )}
        </ModalCustom>

      </div>
    </div>
  );
};

export default Index;