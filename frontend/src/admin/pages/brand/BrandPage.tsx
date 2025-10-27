import { useState } from "react";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";

interface Product {
  id: number;
  name: string;
  price: number;
}

const BrandPage = () => {
  const totalItems = 137;
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const products: Product[] = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
    name: `Sản phẩm ${i + 1}`,
    price: Math.round(Math.random() * 1000),
  }));

  const currentItems = products.slice(start, end);

  const columns: BaseColumn<Product>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "name", label: "Tên sản phẩm", width: "60%" },
    { key: "price", label: "Giá", width: "20%" },
    {
      key: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item: { name: any }) => (
        <button onClick={() => alert(`Xem ${item.name}`)}>Chi tiết</button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={setPage}
        onItemsPerPageChange={setItemsPerPage}
        showPageSizeSelector
        headerContent={
          <div className="headerContent">
            <div>Tổng {totalItems} sản phẩm</div>
            <div className="headerActions">
              <button>+ Thêm mới</button>
              <button>Xuất Excel</button>
            </div>
          </div>
        }
      >
        <BaseTable
          columns={columns}
          data={currentItems}
          showCheckbox
          onSelect={(ids: any) => console.log("Chọn:", ids)}
        />
      </Pagination>
    </div>
  );
};

export default BrandPage;
