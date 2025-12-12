import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath
    }
    return `${basePath}?page=${page}`
  }

  // ページ番号の配列を生成（現在のページを中心に最大5ページ）
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxPagesToShow = 5
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const end = Math.min(totalPages, start + maxPagesToShow - 1)

    // 開始ページを調整
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      data-testid="pagination"
      className="mt-8 flex items-center justify-center"
      aria-label="ページネーション"
    >
      <div className="flex items-center space-x-2">
        {/* 前のページ */}
        {hasPreviousPage ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            data-testid="pagination-prev"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            前へ
          </Link>
        ) : (
          <span
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed"
          >
            前へ
          </span>
        )}

        {/* ページ番号 */}
        <div className="flex items-center space-x-1">
          {pageNumbers[0] > 1 && (
            <>
              <Link
                href={getPageUrl(1)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                1
              </Link>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <Link
              key={page}
              href={getPageUrl(page)}
              data-testid={`pagination-page-${page}`}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                page === currentPage
                  ? 'bg-indigo-600 text-white border border-indigo-600'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <Link
                href={getPageUrl(totalPages)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>

        {/* 次のページ */}
        {hasNextPage ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            data-testid="pagination-next"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            次へ
          </Link>
        ) : (
          <span
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed"
          >
            次へ
          </span>
        )}
      </div>
    </nav>
  )
}
