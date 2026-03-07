import React, { useEffect, useState } from "react";
import { Checkbox, Empty, message } from "antd";
import OrderCard from "../../components/custom/cardCustom";
import { addCart, deleteCart, orderTicket, viewCard } from "../../api/api";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ModalCustom from "../../components/custom/modal";
import ButtonCustom from "../../components/custom/button";

interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  img: string;
  merchantId: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  const getCart = async () => {
    const res = await viewCard();
    setCart(res?.data  || []);
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
    setOpenModal(true);
  };

  const handleSaveQuantity = async () => {
    if (!currentItem) return;

    const newCart = cart.map((item) =>
      item.cartItemId === currentItem.cartItemId
        ? { ...item, quantity }
        : item
    );

    setCart(newCart);
    setOpenModal(false);

    const body = {
      productId: currentItem.productId,
      quantity: quantity
    };

    try {
      await addCart(body);
      message.success("Cập nhật giỏ hàng thành công!");
    } catch (error) {
      message.error("Cập nhật giỏ hàng thất bại!");
    }
  };

  const handleOrder = async () => {
    if (selected.length === 0) {
      message.warning("Vui lòng chọn sản phẩm");
      return;
    }

    const selectedItems = cart.filter((item) =>
      selected.includes(item.cartItemId)
    );

    const body = {
      merchantId: selectedItems[0].merchantId,
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    try {
      await orderTicket(body);

      message.success("Đặt hàng thành công");

      // window.location.href = "/orders";

    } catch (error) {
      message.error("Đặt hàng thất bại");
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      message.warning("Vui lòng chọn sản phẩm cần xoá");
      return;
    }

    try {

      for (const id of selected) {
        await deleteCart(id);
      }

      const newCart = cart.filter(
        (item) => !selected.includes(item.cartItemId)
      );

      setCart(newCart);
      setSelected([]);

      message.success("Xoá sản phẩm thành công");

    } catch (error) {
      message.error("Xoá sản phẩm thất bại");
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const totalPrice =
    currentItem ? Number(currentItem.price) * quantity : 0;

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <BgWhiteBorder>
            <div className="header-content">
              <h3>Giỏ hàng của tôi</h3>

              {!editMode ? (
                <ButtonCustom
                  text="Chỉnh sửa"
                  onClick={() => setEditMode(true)}
                />
              ) : (
                <div className="edit-actions">
                  <Checkbox
                    onChange={(e) =>
                      handleSelectAll(e.target.checked)
                    }
                  >
                    Chọn tất cả
                  </Checkbox>

                  <ButtonCustom text="Xoá" onClick={handleDelete} />

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
                      onPay={() => openEditModal(item)}
                      onOrder={handleOrder}
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

              <h3 className="product-name">
                {currentItem.productName}
              </h3>

              <div className="modal-middle">

                <div className="price">
                  Giá: {Number(currentItem.price).toLocaleString()} đ
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
                <ButtonCustom
                  text="Lưu"
                  onClick={handleSaveQuantity}
                />
              </div>

            </div>
          )}
        </ModalCustom>

      </div>
    </div>
  );
};

export default Index;