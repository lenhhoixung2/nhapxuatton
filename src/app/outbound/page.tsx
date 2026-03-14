'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ScanBarcode, Loader2, ArrowUpRight } from 'lucide-react'
import { BarcodeScanner } from '@/components/BarcodeScanner'
import { processTransaction, getProductByBarcode } from '@/app/products/new/actions'
import { useEffect } from 'react'
import { playNotificationSound, triggerVibration } from '@/lib/audio'

export default function OutboundPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [foundProduct, setFoundProduct] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  
  const [formData, setFormData] = useState({
    barcode: '',
    quantity: '1',
    note: ''
  })

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.barcode.length >= 3) {
        setIsValidating(true)
        const res = await getProductByBarcode(formData.barcode)
        if (res.success && res.data) {
          setFoundProduct(res.data.product)
        } else {
          setFoundProduct(null)
        }
        setIsValidating(false)
      } else {
        setFoundProduct(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [formData.barcode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')
    
    try {
      const res = await processTransaction(
        formData.barcode, 
        'OUT', 
        Number(formData.quantity), 
        formData.note
      )
      
      if (res.success && res.data) {
        const { product, oldStock, newStock, quantity } = res.data
        setSuccessMsg(`✅ XUẤT KHO THÀNH CÔNG: ${product.name} | Tồn cũ: ${oldStock} - Xuất: ${quantity} = Tồn mới: ${newStock} ${product.unit}`)
        playNotificationSound('beep')
        triggerVibration(100)
        setFormData(f => ({...f, barcode: '', quantity: '1', note: ''}))
        router.refresh()
      } else {
        setErrorMsg(res.error || "Có lỗi xảy ra")
        playNotificationSound('error')
        triggerVibration([200, 100, 200])
      }
    } catch (error: any) {
      setErrorMsg("Lỗi kết nối máy chủ")
      playNotificationSound('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-rose-600 text-white shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="p-2 -ml-2 text-rose-100 active:bg-rose-700 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-2 font-semibold text-sm uppercase tracking-tight">Xuất Kho (Outbound)</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex justify-center py-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <div className="text-center">
            <div className="p-4 mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-full mb-3 flex items-center justify-center">
              <ArrowUpRight className="w-8 h-8" />
            </div>
            <p className="font-medium text-gray-900">Quét mã để xuất kho</p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 text-sm font-medium text-emerald-800 bg-emerald-100 rounded-xl">
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="p-4 text-sm font-medium text-rose-800 bg-rose-100 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mã vạch</label>
            <div className="flex gap-2">
              <input 
                required 
                type="text" 
                className="flex-1 px-4 py-3 text-sm font-mono bg-white border border-gray-200 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                placeholder="Nhập mã hoặc quét"
                value={formData.barcode}
                onChange={e => setFormData(f => ({...f, barcode: e.target.value}))}
              />
              <button 
                type="button"
                onClick={() => setIsScanning(true)}
                className="flex items-center justify-center p-3 text-rose-600 bg-rose-50 rounded-xl border border-rose-100 active:scale-95 transition-all"
              >
                <ScanBarcode className="w-5 h-5" />
              </button>
            </div>

            {isValidating && <p className="mt-1 text-xs text-gray-400 italic">Đang tìm sản phẩm...</p>}
            
            {foundProduct && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                 <div>
                    <p className="text-[10px] text-rose-600 font-bold uppercase">Sản phẩm tìm thấy:</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{foundProduct.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-medium">Tồn kho</p>
                    <p className="text-sm font-bold text-rose-600">{foundProduct.stock} {foundProduct.unit}</p>
                 </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Số lượng xuất</label>
              <input 
                type="number" 
                min="1"
                required
                className="w-full px-4 py-3 text-sm font-bold bg-white border border-gray-200 rounded-xl focus:border-rose-500 outline-none"
                value={formData.quantity}
                onChange={e => setFormData(f => ({...f, quantity: e.target.value}))}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Lý do xuất (Tùy chọn)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:border-rose-500 outline-none"
              placeholder="Xuất bán, trả lại..."
              value={formData.note}
              onChange={e => setFormData(f => ({...f, note: e.target.value}))}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !formData.barcode}
            className="flex items-center justify-center w-full py-3.5 mt-8 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-rose-200"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận Xuất Kho"}
          </button>
        </form>
      </div>

      {isScanning && (
        <BarcodeScanner 
          onScan={(code) => {
            setFormData(f => ({...f, barcode: code}))
            setIsScanning(false)
          }}
          onClose={() => setIsScanning(false)}
        />
      )}
    </div>
  )
}
