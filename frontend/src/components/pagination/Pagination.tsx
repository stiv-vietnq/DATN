import React, { useMemo } from "react";
import "./Pagination.css";

type PaginationProps = {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  pageSizes?: number[];
  siblingCount?: number;
  boundaryCount?: number;
  showPageSizeSelector?: boolean;
  className?: string;
  hideIfSinglePage?: boolean;
  headerContent?: React.ReactNode;
  children?: React.ReactNode; // ⬅️ Thêm dòng này
};

const range = (from: number, to: number) => {
  const res: number[] = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
};

export default function Pagination({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  onItemsPerPageChange,
  pageSizes = [10, 20, 50, 100],
  siblingCount = 1,
  boundaryCount = 1,
  showPageSizeSelector = false,
  className = "",
  hideIfSinglePage = true,
  headerContent,
  children, // ⬅️ thêm children vào destructuring
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (hideIfSinglePage && totalPages <= 1) return <>{children}</>;

  const createPagination = () => {
    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    if (totalPages <= totalPageNumbers) return range(1, totalPages);

    const pages: Array<number | "DOTS"> = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > boundaryCount + 2;
    const showRightDots = rightSiblingIndex < totalPages - (boundaryCount + 1);

    const leftRange = range(1, Math.min(boundaryCount, totalPages));
    const rightRange = range(
      Math.max(totalPages - boundaryCount + 1, 1),
      totalPages
    );

    if (!showLeftDots && showRightDots) {
      const leftItemCount = siblingCount * 2 + boundaryCount + 2;
      const leftRangeEnd = Math.min(leftItemCount, totalPages - 2);
      pages.push(...range(1, leftRangeEnd));
      pages.push("DOTS");
      pages.push(...rightRange);
    } else if (showLeftDots && !showRightDots) {
      pages.push(...leftRange);
      pages.push("DOTS");
      const rightItemCount = siblingCount * 2 + boundaryCount + 2;
      const rightRangeStart = Math.max(totalPages - rightItemCount + 1, 3);
      pages.push(...range(rightRangeStart, totalPages));
    } else if (showLeftDots && showRightDots) {
      pages.push(...leftRange);
      pages.push("DOTS");
      pages.push(...range(leftSiblingIndex, rightSiblingIndex));
      pages.push("DOTS");
      pages.push(...rightRange);
    } else {
      pages.push(...range(1, totalPages));
    }

    return pages;
  };

  const paginationRange = useMemo(() => createPagination(), [
    totalPages,
    currentPage,
    siblingCount,
    boundaryCount,
  ]);

  const safeOnPageChange = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p));
    if (next !== currentPage && onPageChange) onPageChange(next);
  };

  return (
    <div className={`pagination-wrapper ${className}`}>
      {headerContent && <div className="pagination-header">{headerContent}</div>}

      {/* ✅ HIỂN THỊ DATA Ở ĐÂY */}
      <div className="pagination-content">{children}</div>

      {/* THANH PHÂN TRANG */}
      <nav className="pagination-container" aria-label="Pagination Navigation">
        <button
          className="pagination-button"
          disabled={currentPage <= 1}
          onClick={() => safeOnPageChange(currentPage - 1)}
        >
          ‹ Prev
        </button>

        <ul className="pagination-list">
          {paginationRange.map((p, idx) =>
            p === "DOTS" ? (
              <li key={`dots-${idx}`} className="pagination-dots">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  className={`pagination-page ${
                    p === currentPage ? "active" : ""
                  }`}
                  onClick={() => safeOnPageChange(p as number)}
                >
                  {p}
                </button>
              </li>
            )
          )}
        </ul>

        <button
          className="pagination-button"
          disabled={currentPage >= totalPages}
          onClick={() => safeOnPageChange(currentPage + 1)}
        >
          Next ›
        </button>

        {showPageSizeSelector && (
          <div className="pagination-size">
            <label>Hiển thị:</label>
            <select
              value={itemsPerPage}
              onChange={(e) =>
                onItemsPerPageChange &&
                onItemsPerPageChange(Number(e.target.value))
              }
            >
              {pageSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pagination-summary">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
        </div>
      </nav>
    </div>
  );
}
