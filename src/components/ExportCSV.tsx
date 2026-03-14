'use client'

import { FolderOpen } from 'lucide-react'

interface Transaction {
  id: string
  createdAt: any
  type: string
  quantity: number
  note?: string
  product: {
    name: string
    barcode: string
    unit: string
  }
  user?: {
    name: string
  }
}

export function ExportCSV({ data }: { data: any[] }) {
  const handleExport = () => {
    // Header
    let csv = '\uFEFF' // BOM for Excel UTF-8 support
    csv += 'Thời gian,Sản phẩm,Mã vạch,Loại,Số lượng,Đơn vị,Người thực hiện,Ghi chú\n'

    // Rows
    data.forEach((tx: any) => {
      const date = new Date(tx.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
      const typeLabel = tx.type === 'IN' ? 'NHẬP' : 'XUẤT'
      const line = [
        `"${date}"`,
        `"${tx.product.name}"`,
        `"${tx.product.barcode}"`,
        `"${typeLabel}"`,
        tx.quantity,
        `"${tx.product.unit}"`,
        `"${tx.user?.name || 'Hệ thống'}"`,
        `"${tx.note || ''}"`
      ].join(',')
      csv += line + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const fileName = `bao-cao-kho-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={handleExport}
      className="flex flex-col items-center justify-center p-2 bg-yellow-400 text-blue-900 rounded-xl font-bold shadow-lg"
      style={{ minWidth: '80px', minHeight: '40px', zIndex: 9999 }}
    >
      <FolderOpen size={20} className="mb-1" />
      <span className="text-[10px] uppercase">XUẤT CSV</span>
    </button>
  )
}
