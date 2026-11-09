const DB_NAME = 'source-code-files'
const STORE_NAME = 'files'
const previewUrls = new Map<string, string>()

export interface StoredProductFile {
    id: string
    productId: string
    kind: 'preview' | 'source'
    name: string
    type: string
    size: number
    blob: Blob
}

function openFileDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)

        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

function makeId(): string {
    return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export async function saveProductFile(
    productId: string,
    kind: StoredProductFile['kind'],
    file: File,
): Promise<StoredProductFile> {
    const db = await openFileDb()
    const storedFile: StoredProductFile = {
        id: makeId(),
        productId,
        kind,
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file,
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        transaction.objectStore(STORE_NAME).put(storedFile)
        transaction.oncomplete = () => {
            db.close()
            resolve(storedFile)
        }
        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}

export async function getProductFile(id: string): Promise<StoredProductFile | undefined> {
    const db = await openFileDb()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const request = transaction.objectStore(STORE_NAME).get(id)
        request.onsuccess = () => resolve(request.result as StoredProductFile | undefined)
        request.onerror = () => reject(request.error)
        transaction.oncomplete = () => db.close()
        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}

export async function deleteProductFile(id: string | undefined): Promise<void> {
    if (!id) return
    const previewUrl = previewUrls.get(id)
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        previewUrls.delete(id)
    }
    const db = await openFileDb()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        transaction.objectStore(STORE_NAME).delete(id)
        transaction.oncomplete = () => {
            db.close()
            resolve()
        }
        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}

export async function productPreviewUrl(id: string): Promise<string | undefined> {
    const existingUrl = previewUrls.get(id)
    if (existingUrl) return existingUrl

    const file = await getProductFile(id)
    if (!file) return undefined

    const url = URL.createObjectURL(file.blob)
    previewUrls.set(id, url)
    return url
}
