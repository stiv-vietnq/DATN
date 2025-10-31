import api from "./index";

export const ProductSearch = (data: {
    productTypeId?: string | null;
    name?: string;
    minPrice?: string;
    maxPrice?: string;
    status?: string | null;
    categoryId?: string | null;
    orderBy?: string;
    priceOrder?: string;
    page?: number;
    size?: number;
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