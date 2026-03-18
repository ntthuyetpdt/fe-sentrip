import { useEffect, useRef, useState } from "react";
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

const MAX_PRICE = 20_000_000;

function formatPrice(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1) + " Tr";
    if (v >= 1_000) return Math.round(v / 1_000) + "K";
    return "0";
}

const AllTicket = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);

    const [productName, setProductName] = useState("");
    const [address, setAddress] = useState("");
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(MAX_PRICE);

    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        applyFilter(allProducts, productName, address, priceMin, priceMax);
    }, [priceMin, priceMax, allProducts]);

    useEffect(() => {
        if (fillRef.current) {
            fillRef.current.style.left = `${(priceMin / MAX_PRICE) * 100}%`;
            fillRef.current.style.width = `${((priceMax - priceMin) / MAX_PRICE) * 100}%`;
        }
    }, [priceMin, priceMax]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await viewProduct();
            const data = res.data || res;
            setAllProducts(data);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi gọi viewProduct:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (
        source: Product[],
        name: string,
        addr: string,
        min: number,
        max: number
    ) => {
        let filtered = source;
        if (name) filtered = filtered.filter((p) =>
            p.productName.toLowerCase().includes(name.toLowerCase())
        );
        if (addr) filtered = filtered.filter((p) =>
            p.additionalService?.toLowerCase().includes(addr.toLowerCase())
        );
        filtered = filtered.filter((p) => {
            const n = Number(p.price);
            return n >= min && n <= max;
        });
        setProducts(filtered);
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), priceMax - 50_000);
        setPriceMin(val);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), priceMin + 50_000);
        setPriceMax(val);
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            if (productName || address) {
                const res = await searchProduct(productName, address, "");
                const data = res.data || res;
                applyFilter(data, productName, address, priceMin, priceMax);
            } else {
                applyFilter(allProducts, productName, address, priceMin, priceMax);
            }
        } catch {
            message.error("Lỗi tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleAddCart = async () => {
        try {
            await addCart({ productId: selectedProduct?.id, quantity });
            message.success("Thêm vào giỏ hàng thành công!");
            window.location.href = "/my-cart";
        } catch {
            message.error("Thêm vào giỏ hàng thất bại!");
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

    const handleOrder = async () => {
        if (!selectedProduct) return;
        try {
            await orderTicket({
                merchantId: selectedProduct.merchantId,
                items: [{ productId: selectedProduct.id, quantity }],
            });
            setOpen(false);
            setQuantity(1);
            message.success("Đặt hàng thành công");
            window.location.href = "/orders";
        } catch {
            message.error("Đặt hàng thất bại");
        }
    };

    const totalPrice = selectedProduct ? Number(selectedProduct.price) * quantity : 0;

    return (
        <div className="quanLiDonHang">
            <BgWhiteBorder className="bg">

                <div className="search-QLDH-container">

                    <input
                        className="search-input-product"
                        type="text"
                        placeholder="Tìm tên vé"
                        value={productName}
                        onChange={(e) => {
                            setProductName(e.target.value);
                            applyFilter(allProducts, e.target.value, address, priceMin, priceMax);
                        }}
                        onKeyDown={handleKeyDown}
                    />

                    <input
                        className="search-input-address"
                        type="text"
                        placeholder="Tìm địa chỉ"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            applyFilter(allProducts, productName, e.target.value, priceMin, priceMax);
                        }}
                        onKeyDown={handleKeyDown}
                    />

                    {/* Double range slider */}
                    <div className="price-range-slider">
                        <div className="price-range-slider__values">
                            <span>{formatPrice(priceMin)}</span>
                            <span>{formatPrice(priceMax)}</span>
                        </div>
                        <div className="price-range-slider__track-wrap">
                            <div className="price-range-slider__track-bg" />
                            <div className="price-range-slider__track-fill" ref={fillRef} />
                            <input
                                type="range"
                                className="price-range-slider__input"
                                min={0}
                                max={MAX_PRICE}
                                step={50_000}
                                value={priceMin}
                                onChange={handleMinChange}
                            />
                            <input
                                type="range"
                                className="price-range-slider__input"
                                min={0}
                                max={MAX_PRICE}
                                step={50_000}
                                value={priceMax}
                                onChange={handleMaxChange}
                            />
                        </div>
                    </div>

                    <ButtonCustom
                        className="btn-search-QLDH"
                        text={<SearchOutlined />}
                        onClick={handleSearch}
                    />

                </div>

                {loading && <Empty description="Đang tải..." />}
                {!loading && products.length === 0 && <Empty description="Không có dữ liệu" />}

                {!loading && products.map((item) => (
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
                        <h3 className="product-name">{selectedProduct.productName}</h3>
                        <div className="modal-middle">
                            <div className="price">
                                Giá: {Number(selectedProduct.price).toLocaleString()} đ
                            </div>
                            <div className="quantity-box">
                                <button onClick={() => quantity > 1 && setQuantity(q => q - 1)}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
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