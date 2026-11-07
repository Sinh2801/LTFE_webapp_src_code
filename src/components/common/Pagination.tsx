interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

type PageItem = number | { type: 'ellipsis'; key: string }

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
    const visiblePages = [...new Set([
        1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages,
    ])]
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b)

    const items: PageItem[] = []

    visiblePages.forEach((page, index) => {
        const previousPage = visiblePages[index - 1]

        if (previousPage !== undefined && page - previousPage > 1) {
            items.push(
                page - previousPage === 2
                    ? previousPage + 1
                    : { type: 'ellipsis', key: `ellipsis-${index}` },
            )
        }

        items.push(page)
    })

    return items
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = getPageItems(currentPage, totalPages)
    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    return (
        <nav className="pagination" aria-label="Phân trang">
            <button
                className="pagination__button"
                type="button"
                aria-label="Trang trước"
                disabled={currentPage <= 1}
                onClick={() => changePage(currentPage - 1)}
            >
                ‹
            </button>

            {pages.map((item) =>
                typeof item === 'number' ? (
                    <button
                        key={item}
                        className="pagination__button"
                        type="button"
                        aria-current={item === currentPage ? 'page' : undefined}
                        aria-label={`Trang ${item}`}
                        onClick={() => changePage(item)}
                    >
                        {item}
                    </button>
                ) : (
                    <span key={item.key} className="pagination__ellipsis" aria-hidden="true">
                        …
                    </span>
                ),
            )}

            <button
                className="pagination__button"
                type="button"
                aria-label="Trang sau"
                disabled={currentPage >= totalPages}
                onClick={() => changePage(currentPage + 1)}
            >
                ›
            </button>
        </nav>
    )
}

export default Pagination
