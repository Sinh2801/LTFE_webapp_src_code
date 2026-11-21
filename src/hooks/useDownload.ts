import { useState } from 'react'
import { useAppDispatch } from '../app/hook'
import { recordDownload } from '../app/slices/librarySlice'
import { useToast } from '../components/common/Toast'
import { getErrorMessage } from '../libs/apiClient'
import { saveBlob } from '../libs/download'
import { libraryService } from '../libs/services'

export function useDownload() {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const [busyId, setBusyId] = useState<string | null>(null)

    async function download(productId: string): Promise<void> {
        if (busyId) return
        setBusyId(productId)
        try {
            const { blob, filename } = await libraryService.download(productId)
            saveBlob(blob, filename)
            dispatch(recordDownload(productId))
            showToast(`Đã tải ${filename}`, 'success')
        } catch (error) {
            showToast(getErrorMessage(error), 'error')
        } finally {
            setBusyId(null)
        }
    }

    return { download, busyId }
}
