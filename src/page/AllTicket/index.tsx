import { useEffect, useState } from "react";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import OrderCard from "../../components/custom/cardCustom";
import { orderTicket, viewProduct, searchProduct, addCart } from "../../api/api";
import ModalCustom from "../../components/custom/modal";
import ButtonCustom from "../../components/custom/button";
import { Empty, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface Product {
    id: number;
    img: string | null;
    productName: string;
    serviceType: string;
    createdAt: string;
    Type: string;
    price: string;
    refundable: number;
    status: any;
    additionalService: string;
    merchantId: number;
}

const AllTicket = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);

    const [productName, setProductName] = useState("");
    const [address, setAddress] = useState("");
    const [priceTK, setPriceTK] = useState("")
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await viewProduct();
            setProducts(res.data || res);
        } catch (error) {
            console.error("Lỗi khi gọi viewProduct:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCart = async () => {
        const body = {
            productId: selectedProduct?.id,
            quantity: quantity
        }
        try {
            await addCart(body)
            message.success('Thêm vào giỏ hàng thành công!')
            window.location.href = "/my-cart";
        } catch (error) {
            message.error('Thêm vào giỏ hàng thất bại!')
        }
    }

    const handleSearch = async () => {
        try {
            setLoading(true);

            if (!productName && !address && !priceTK) {
                fetchProducts();
                return;
            }

            const res = await searchProduct(productName, address, priceTK);
            setProducts(res.data || res);

        } catch (error) {
            message.error("Lỗi tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (id: number) => {
        const product = products.find((p) => p.id === id);
        if (product) {
            setSelectedProduct(product);
            setQuantity(1);
            setOpen(true);
        }
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {

        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleOrder = async () => {

        if (!selectedProduct) return;

        const body = {
            merchantId: selectedProduct.merchantId,
            items: [
                {
                    productId: selectedProduct.id,
                    quantity: quantity,
                },
            ],
        };

        try {
            await orderTicket(body);
            setOpen(false);
            setQuantity(1);
            message.success("Đặt hàng thành công");
            window.location.href = "/orders";
        } catch (error) {
            message.error("Đặt hàng thất bại");
        }
    };

    const totalPrice =
        selectedProduct && quantity
            ? Number(selectedProduct.price) * quantity
            : 0;

    return (
        <div className="quanLiDonHang">
            <BgWhiteBorder className="bg">

                <div className="search-QLDH-container">

                    <input
                        className="search-input-product"
                        type="text"
                        placeholder="Tìm tên vé"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />

                    <input
                        className="search-input-address"
                        type="text"
                        placeholder="Tìm địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <input
                        className="search-input-address"
                        type="text"
                        placeholder="Mức giá"
                        value={priceTK}
                        onChange={(e) => setPriceTK(e.target.value)}
                    />

                    <ButtonCustom
                        className="btn-search-QLDH"
                        text={<SearchOutlined />}
                        onClick={handleSearch}
                    />

                </div>

                {loading && <Empty description="Đang tải..." />}

                {!loading && products.length === 0 && (
                    <Empty description="Không có dữ liệu" />
                )}

                {!loading &&
                    products.map((item) => (
                        <OrderCard
                            viewProduct={true}
                            key={item.id}
                            id={item.id}
                            img={item.img}
                            productName={item.productName}
                            serviceType={item.serviceType}
                            createdAt={item.createdAt}
                            Type={item.Type}
                            price={item.price}
                            refundable={item.refundable}
                            status={item.status}
                            additionalService={item.additionalService}
                            onOrder={handleOpenModal}
                        />
                    ))}
            </BgWhiteBorder>

            <ModalCustom open={open} onClose={() => setOpen(false)} width={600}>
                {selectedProduct && (
                    <div className="modal-order">

                        <h3 className="product-name">
                            {selectedProduct.productName}
                        </h3>

                        <div className="modal-middle">

                            <div className="price">
                                Giá: {Number(selectedProduct.price).toLocaleString()} đ
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
                            <ButtonCustom text="Thêm vào giỏ hàng" onClick={handleAddCart} />
                            <ButtonCustom text="Đặt hàng" onClick={handleOrder} />
                        </div>

                    </div>
                )}
            </ModalCustom>
        </div>
    );
};

export default AllTicket;