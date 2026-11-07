interface LoadingProps {
    label?: string
}

function Loading({ label = 'Đang tải...' }: LoadingProps) {
    return (
        <div className="loading" role="status" aria-live="polite">
            <span className="loading__spinner" aria-hidden="true" />
            <span>{label}</span>
        </div>
    )
}

export default Loading
