// chartjs-setup.ts
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { getProductTypeByStatus } from "../../../api/brand";
import { getCategorysByProductTypeId } from "../../../api/category";
import { getProductStats } from "../../../api/dashboard";
import { ProductSearch } from "../../../api/product";
import DateRangePicker from "../../../components/common/dateRangePicker/DateRangePicker";
import MultiDropdown from "../../../components/common/dropdown/MultiDropdown";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ProductStatsData {
  labels: string[];
  quantitySold: number[];
  stock: number[];
}

interface Option {
  label: string;
  value: string;
}

const ProductStatistics = () => {
  const [revenueDB, setRevenueDB] = useState<ProductStatsData>({
    quantitySold: [],
    stock: [],
    labels: [],
  });
  const [selected, setSelected] = useState<string | null>("2");
  const [year, setYear] = useState<number | null>(2025);
  const [month, setMonth] = useState<number | null>(11);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [brandOptions, setBrandOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<Option[]>([]);

  useEffect(() => {
    handleChartRevenue();
    getAllBrands();
  }, []);

  const handleChartRevenue = () => {
    getProductStats({
      type: Number(selected) || 3,
      year: year || 2025,
      month: month || 11,
      startDate: fromDate || "",
      endDate: toDate || "",
      productIds: selectedValues,
    })
      .then((response) => {
        setRevenueDB(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching product stats:", error);
      });
  };

  const data = {
    labels: revenueDB?.labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Số lượng bán ra",
        backgroundColor: "#2fb323ff",
        data: revenueDB?.quantitySold,
        borderRadius: 6,
      },
      {
        type: "bar" as const,
        label: "Số lượng trong kho",
        backgroundColor: "#4e79a7",
        data: revenueDB?.stock,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Số lượng sản phẩm" },
      },
    },
  };

  const getAllBrands = () => {
    setLoading(true);
    getProductTypeByStatus({ status: null })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setBrandOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thương hiệu:", error);
      })
      .finally(() => setLoading(false));
  };

  const fetchCategoriesByProductTypeId = (value: string | null) => {
    getCategorysByProductTypeId({
      productTypeId: value,
      status: null,
    })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setCategoryOptions(mappedOptions);
        handleGetProducts();
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  };

  const handleGetProducts = () => {
    setLoading(true);
    ProductSearch({
      productTypeId: selectedBrandId,
      categoryId: selectedCategoryId,
      name: null,
      minPrice: null,
      maxPrice: null,
      status: null,
      orderBy: null,
      priceOrder: null,
      page: null,
      size: null,
      quantitySold: null,
      numberOfVisits: null,
      evaluate: null,
    })
      .then((response) => {
        const data = response?.data || [];
        const mappedOptions: Option[] = data.map((item: any) => ({
          label: item.productName,
          value: item.id,
        }));
        setProductOptions(mappedOptions);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      }).finally(() => setLoading(false));
  };

  if (loading) return <Loading />;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "100%", margin: "0 auto" }}>
        <div className="dashboard-header">
          <div className="dashboard-header-content-product">
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              {selected === "1" && (
                <div>
                  <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onChangeFrom={setFromDate}
                    onChangeTo={setToDate}
                    error={
                      fromDate &&
                        toDate &&
                        new Date(fromDate) > new Date(toDate)
                        ? "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
                        : undefined
                    }
                  />
                </div>
              )}

              {selected === "2" && (
                <>
                  <div>
                    <Input
                      value={month ? month.toString() : ""}
                      onChange={(e) =>
                        setMonth(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="Nhập tháng..."
                      style={{ width: "100%", marginBottom: "-28px" }}
                    />
                  </div>
                  <div>
                    <Input
                      value={year ? year.toString() : ""}
                      onChange={(e) =>
                        setYear(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="Nhập năm..."
                      style={{ width: "100%", marginBottom: "-28px" }}
                    />
                  </div>
                </>
              )}
              {selected === "3" && (
                <div>
                  <Input
                    value={year ? year.toString() : ""}
                    onChange={(e) =>
                      setYear(e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="Nhập năm..."
                    style={{ width: "100%", marginBottom: "-28px" }}
                  />
                </div>
              )}
              <div>
                <StringDropdown
                  value={selected}
                  onChange={setSelected}
                  options={[
                    { label: "Năm", value: "3" },
                    { label: "Tháng", value: "2" },
                    { label: "Khoảng ngày", value: "1" },
                  ]}
                  placeholder={null}
                  error={undefined}
                  style={{ marginBottom: "-28px" }}
                />
              </div>
              <div>
                <MultiDropdown
                  value={selectedValues}
                  onChange={setSelectedValues}
                  options={productOptions}
                />
              </div>
              <div style={{ marginBottom: "-28px" }}>
                <StringDropdown
                  value={selectedCategoryId}
                  onChange={setSelectedCategoryId}
                  options={categoryOptions}
                  placeholder="--Chọn danh mục--"
                  error={undefined}
                />
              </div>
              <div style={{ marginBottom: "-28px" }}>
                <StringDropdown
                  value={selectedBrandId}
                  onChange={(value: string | null) => {
                    setSelectedBrandId(value);
                    if (value) {
                      fetchCategoriesByProductTypeId(value);
                    } else {
                      setSelectedCategoryId(null);
                      setCategoryOptions([]);
                    }
                  }}
                  options={brandOptions}
                  placeholder="--Chọn thương hiệu--"
                  error={undefined}
                />
              </div>
              <div></div>
              <div>
                <button
                  className="btn-chart-purchase"
                  onClick={handleChartRevenue}
                >
                  Thống kê
                </button>
              </div>
            </div>
          </div>
        </div>
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default ProductStatistics;
