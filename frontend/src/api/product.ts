import api from "./index";

export const ProductSearch = (data: {
    productTypeId?: string | null;
    name?: string | null;
    minPrice?: string | null;
    maxPrice?: string | null;
    status?: string | null;
    categoryId?: string | null;
    orderBy?: string | null;
    priceOrder?: string | null;
    page?: number | null;
    size?: number | null;
    quantitySold?: string | null;
    numberOfVisits?: string | null;
    evaluate?: string | null;
}) => api.get("/products/search", { params: data });


export const ProductCreateOrUpdate = (data: FormData) => {
    return api.post("/products/admin/createOrUpdate", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const GetProductById = (productId?: number | null | string) => {
    return api.get(`/products/getProduct/${productId}`);
};

export const DeleteProductById = (productId: number) => {
    return api.post(`/products/admin/deleteProduct/${productId}`);
}

export const getDiscountedPrice = (productId: string) => {
    return api.get(`/products/getDiscountedPrice/${productId}`);
}