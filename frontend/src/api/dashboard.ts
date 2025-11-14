import api from "./index";

export const getChartWidgets = (type: number) => {
    return api.get("/dashboards/getChartWidgets", {
        params: { type }
    });
};

interface ChartPurchaseParams {
    type: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
}

export const getChartPurchase = (params: ChartPurchaseParams) => {
  return api.get("/dashboards/getChartPurchase", { params });
};

interface RevenueParams {
    type: number;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
}

export const getChartRevenue = (params: RevenueParams) => {
  return api.get("/dashboards/revenue", { params });
};
