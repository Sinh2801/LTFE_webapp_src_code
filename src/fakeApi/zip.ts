const encoder = new TextEncoder()

const CRC_TABLE: number[] = (() => {
    const table: number[] = []
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        table.push(c >>> 0)
    }
    return table
})()

function crc32(data: Uint8Array): number {
    let crc = 0xffffffff
    for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
    return (crc ^ 0xffffffff) >>> 0
}

export interface ZipEntry {
    name: string
    content: string
}

export function createZip(files: ZipEntry[]): Blob {
    const chunks: Uint8Array[] = []
    const central: Uint8Array[] = []
    let offset = 0
    const date = new Date()
    const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1)
    const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()

    for (const file of files) {
        const name = encoder.encode(file.name)
        const data = encoder.encode(file.content)
        const crc = crc32(data)

        const local = new Uint8Array(30 + name.length)
        const lv = new DataView(local.buffer)
        lv.setUint32(0, 0x04034b50, true)
        lv.setUint16(4, 20, true)
        lv.setUint16(6, 0x0800, true) // tên file UTF-8
        lv.setUint16(8, 0, true) // không nén
        lv.setUint16(10, dosTime, true)
        lv.setUint16(12, dosDate, true)
        lv.setUint32(14, crc, true)
        lv.setUint32(18, data.length, true)
        lv.setUint32(22, data.length, true)
        lv.setUint16(26, name.length, true)
        local.set(name, 30)
        chunks.push(local, data)

        const entry = new Uint8Array(46 + name.length)
        const ev = new DataView(entry.buffer)
        ev.setUint32(0, 0x02014b50, true)
        ev.setUint16(4, 20, true)
        ev.setUint16(6, 20, true)
        ev.setUint16(8, 0x0800, true)
        ev.setUint16(12, dosTime, true)
        ev.setUint16(14, dosDate, true)
        ev.setUint32(16, crc, true)
        ev.setUint32(20, data.length, true)
        ev.setUint32(24, data.length, true)
        ev.setUint16(28, name.length, true)
        ev.setUint32(42, offset, true)
        entry.set(name, 46)
        central.push(entry)

        offset += local.length + data.length
    }

    const centralSize = central.reduce((sum, c) => sum + c.length, 0)
    const end = new Uint8Array(22)
    const dv = new DataView(end.buffer)
    dv.setUint32(0, 0x06054b50, true)
    dv.setUint16(8, files.length, true)
    dv.setUint16(10, files.length, true)
    dv.setUint32(12, centralSize, true)
    dv.setUint32(16, offset, true)

    return new Blob([...chunks, ...central, end] as BlobPart[], { type: 'application/zip' })
}
