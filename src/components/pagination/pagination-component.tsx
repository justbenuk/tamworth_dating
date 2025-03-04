'use client'
import usePaginationStore from "@/hooks/use-pagination-store";
import { Pagination } from "@heroui/pagination";
import clsx from "clsx";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function PaginationComponent({ totalCount }: { totalCount: number }) {

  const { setPage, setPageSize, setPagination, pagination } = usePaginationStore(
    useShallow(state => ({
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      setPagination: state.setPagination,
      pagination: state.pagination
    })
    ))

  const { pageNumber, pageSize, totalPages } = pagination

  const start = (pageNumber - 1) * pageSize + 1
  const end = Math.min(pageNumber * pageSize, totalCount)

  useEffect(() => {
    setPagination(totalCount)
  }, [setPagination, totalCount])

  return (
    <div className="border-t-2 w-full mt-5">
      <div className="flex flex-row justify-between items-center py-5">
        <div>Showing {start}-{end} of {totalCount} results</div>
        <Pagination
          total={totalPages}
          classNames={{
            cursor: 'bg-red-500'
          }}
          initialPage={pageNumber}
          variant="bordered"
          onChange={setPage}
        />
        <div className="flex flex-row gap-1 items-center">
          Page size:
          {[3, 6, 12].map(size => (
            <div
              key={size}
              onClick={() => setPageSize(size)}
              className={clsx('page-size-box', {
                'bg-red-500 text-white hover:bg-red-500 hover:text-white': pageSize === size
              })}
            >{size}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
