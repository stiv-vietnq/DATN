import api from "./index";
import qs from "qs";

export const getChartWidgets = (type: number) => {
  return api.get("/dashboards/getChartWidgets", {
    params: { type },
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

export interface ProductStatsParams {
  type: number;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  productIds?: string[];
}

export const getProductStats = (params: ProductStatsParams) => {
  return api.get("/dashboards/stats", {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });
};

export interface GetProductDetailStats {
  type: number;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  productId?: string;
}

export const getProductDetailStats = (params: GetProductDetailStats) => {
  return api.get("/dashboards/getProductDetailStats", {
    params,
  });
};
