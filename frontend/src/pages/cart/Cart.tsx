import { useMemo, useState } from "react";
import "./Cart.css";

// ------------------- Types -------------------

interface Item {
    id: string;
    name: string;
    variant: string;
    image?: string;
    price: number;
    oldPrice?: number;
    qty: number;
    selected: boolean;
}

interface Shop {
    shopId: number;
    name: string;
    promo?: string | null;
    selected: boolean;
    items: Item[];
}

interface Totals {
    count: number;
    amount: number;
}

// ------------------- Helpers -------------------

const formatVND = (n: number): string =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// ------------------- Demo data -------------------

const initialShops: Shop[] = [
    {
        shopId: 1,
        name: "Archi Shop",
        promo: "Mua thêm 8 sản phẩm để giảm 2%",
        selected: false,
        items: [
            {
                id: "A1",
                name: "Hộp đựng tiền tiết kiệm bằng gỗ",
                variant: "HTK Mèo + bút",
                price: 39900,
                oldPrice: 60000,
                qty: 1,
                selected: false,
            },
        ],
    },
    {
        shopId: 2,
        name: "đồ da dụng(ngọc ánh)",
        promo: null,
        selected: false,
        items: [
            {
                id: "B1",
                name: "Máy xay thịt mini Inox 304 4 lưỡi",
                variant: "2l",
                price: 120450,
                oldPrice: 219000,
                qty: 1,
                selected: false,
            },
        ],
    },
];


export default function Cart() {
    const [shops, setShops] = useState<Shop[]>(initialShops);

    const allSelected = useMemo<boolean>(() => {
        if (shops.length === 0) return false;
        return shops.every((s) => s.items.every((it) => it.selected));
    }, [shops]);

    const totals = useMemo<Totals>(() => {
        let count = 0;
        let amount = 0;
        shops.forEach((s) =>
            s.items.forEach((it) => {
                if (it.selected) {
                    count += it.qty;
                    amount += it.price * it.qty;
                }
            })
        );
        return { count, amount };
    }, [shops]);

    const toggleSelectAll = (): void => {
        const target = !allSelected;
        setShops((prev) =>
            prev.map((s) => ({
                ...s,
                selected: target,
                items: s.items.map((it) => ({ ...it, selected: target })),
            }))
        );
    };

    const toggleShop = (shopId: number): void => {
        setShops((prev) =>
            prev.map((s) =>
                s.shopId === shopId
                    ? {
                        ...s,
                        selected: !s.selected,
                        items: s.items.map((it) => ({
                            ...it,
                            selected: !s.selected,
                        })),
                    }
                    : s
            )
        );
    };

    const toggleItem = (shopId: number, itemId: string): void => {
        setShops((prev) =>
            prev.map((s) =>
                s.shopId === shopId
                    ? {
                        ...s,
                        items: s.items.map((it) =>
                            it.id === itemId ? { ...it, selected: !it.selected } : it
                        ),
                    }
                    : s
            )
        );
    };

    const changeQty = (shopId: number, itemId: string, delta: number): void => {
        setShops((prev) =>
            prev.map((s) =>
                s.shopId === shopId
                    ? {
                        ...s,
                        items: s.items.map((it) =>
                            it.id === itemId
                                ? { ...it, qty: Math.max(1, it.qty + delta) }
                                : it
                        ),
                    }
                    : s
            )
        );
    };

    const removeItem = (shopId: number, itemId: string): void => {
        setShops((prev) =>
            prev
                .map((s) =>
                    s.shopId === shopId
                        ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
                        : s
                )
                .filter((s) => s.items.length > 0)
        );
    };

    const removeSelected = (): void => {
        setShops((prev) =>
            prev
                .map((s) => ({
                    ...s,
                    items: s.items.filter((it) => !it.selected),
                }))
                .filter((s) => s.items.length > 0)
        );
    };

    const isShopFullySelected = (shop: Shop): boolean =>
        shop.items.length > 0 && shop.items.every((it) => it.selected);

    return (
        <div className="main-content-cart">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="col-product">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                        />{" "}
                        <span style={{ marginLeft: 8 }}>Sản Phẩm</span>
                    </div>
                    <div className="col-price">Đơn Giá</div>
                    <div className="col-quantity">Số Lượng</div>
                    <div className="col-total">Số Tiền</div>
                    <div className="col-action">Thao Tác</div>
                </div>

                {shops.map((shop) => (
                    <div className="shop-section" key={shop.shopId}>
                        <div className="shop-header">
                            <input
                                type="checkbox"
                                checked={isShopFullySelected(shop)}
                                onChange={() => toggleShop(shop.shopId)}
                            />
                            <span className="shop-name">{shop.name}</span>
                            {shop.promo && <span className="shop-promo">{shop.promo}</span>}
                        </div>

                        {shop.items.map((it) => (
                            <div className="cart-item" key={it.id}>
                                <div className="item-left">
                                    <input
                                        type="checkbox"
                                        checked={it.selected}
                                        onChange={() => toggleItem(shop.shopId, it.id)}
                                    />
                                    <img
                                        className="item-image"
                                        src={
                                            it.image ||
                                            "https://via.placeholder.com/80x80.png?text=No+Image"
                                        }
                                        alt={it.name}
                                    />
                                    <div className="item-info">
                                        <div className="item-name">{it.name}</div>
                                        <div className="item-variant">{it.variant}</div>
                                    </div>
                                </div>

                                <div className="item-price">
                                    {it.oldPrice && (
                                        <div className="old-price">{formatVND(it.oldPrice)}</div>
                                    )}
                                    <div className="new-price">{formatVND(it.price)}</div>
                                </div>

                                <div className="item-quantity">
                                    <button onClick={() => changeQty(shop.shopId, it.id, -1)}>
                                        -
                                    </button>
                                    <input type="text" value={it.qty} readOnly />
                                    <button onClick={() => changeQty(shop.shopId, it.id, 1)}>
                                        +
                                    </button>
                                </div>

                                <div className="item-total">{formatVND(it.price * it.qty)}</div>

                                <div className="item-action">
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeItem(shop.shopId, it.id)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Summary */}
                <div className="cart-summary">
                    <div className="summary-left">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                        />
                        <span>
                            Chọn tất cả (
                            {shops.reduce((a, s) => a + s.items.length, 0)})
                        </span>
                        <button className="btn-remove" onClick={removeSelected}>
                            Xóa đã chọn
                        </button>
                    </div>

                    <div className="summary-right">
                        <div className="summary-total">
                            Tổng cộng ({totals.count} sản phẩm):{" "}
                            <span className="price">{formatVND(totals.amount)}</span>
                        </div>
                        <button
                            className="btn-buy"
                            onClick={() => {
                                if (totals.count === 0) {
                                    alert("Bạn chưa chọn sản phẩm nào.");
                                    return;
                                }
                                alert(`Checkout ${totals.count} sản phẩm, tổng ${formatVND(totals.amount)}`);
                            }}
                        >
                            Mua Hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};