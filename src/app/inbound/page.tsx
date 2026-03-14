'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ScanBarcode, Loader2, ArrowDownLeft } from 'lucide-react'
import { BarcodeScanner } from '@/components/BarcodeScanner'
import { processTransaction, getProductByBarcode } from '@/app/products/new/actions'
import { useEffect } from 'react'
import { playNotificationSound, triggerVibration } from '@/lib/audio'

export default function InboundPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [foundProduct, setFoundProduct] = useState<any>(null)
  const [existsInSystem, setExistsInSystem] = useState(false)
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
          // TRUNG MA = co it nhat 1 san pham trong DB co barcode nay VÀ còn tồn > 0
          // Nếu tồn = 0 (hàng đã xuất/khách trả) → cho phép nhập lại
          const found = res.data.existsInSystem === true && res.data.product.stock > 0
          setExistsInSystem(found)
          if (found) {
            playNotificationSound('error')
            triggerVibration([200, 100, 200])
          } else {
            playNotificationSound('beep')
          }
        } else {
          setFoundProduct(null)
          setExistsInSystem(false)
        }
        setIsValidating(false)
      } else {
        setFoundProduct(null)
        setExistsInSystem(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [formData.barcode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')
    
    if (existsInSystem) {
      setErrorMsg('TRUNG MA - KHONG THE NHAP KHO!')
      playNotificationSound('error')
      triggerVibration([300, 100, 300])
      setIsSubmitting(false)
      return
    }

    try {
      const res = await processTransaction(
        formData.barcode, 
        'IN', 
        Number(formData.quantity), 
        formData.note
      )
      
      if (res.success && res.data) {
        const { product, oldStock, newStock, quantity } = res.data
        setSuccessMsg(`OK NHAP KHO THANH CONG: ${product.name} | Ton cu: ${oldStock} + Nhap: ${quantity} = Ton moi: ${newStock} ${product.unit}`)
        playNotificationSound('beep')
        triggerVibration(100)
        setFormData(f => ({...f, barcode: '', quantity: '1', note: ''}))
        setFoundProduct(null)
        setExistsInSystem(false)
        router.refresh()
      } else {
        if ((res as any).existsInSystem) setExistsInSystem(true)
        setErrorMsg(res.error || "Co loi xay ra")
        playNotificationSound('error')
        triggerVibration([200, 100, 200])
      }
    } catch (error: any) {
      setErrorMsg("Loi ket noi may chu")
      playNotificationSound('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-blue-600 text-white shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="p-2 -ml-2 text-blue-100 active:bg-blue-700 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-2 font-semibold text-sm uppercase tracking-tight">Nhập Kho (Inbound)</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex justify-center py-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <div className="text-center">
            <div className="p-4 mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-3 flex items-center justify-center">
              <ArrowDownLeft className="w-8 h-8" />
            </div>
            <p className="font-medium text-gray-900">Quét mã để nhập kho</p>
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

        <form onSubmit={handleSubmit} className={`space-y-4 ${existsInSystem ? 'animate-shake' : ''}`}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mã vạch</label>
            <div className="flex gap-2">
              <input 
                required 
                type="text" 
                className="flex-1 px-4 py-3 text-sm font-mono bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Nhập mã hoặc quét"
                value={formData.barcode}
                onChange={e => setFormData(f => ({...f, barcode: e.target.value}))}
              />
              <button 
                type="button"
                onClick={() => setIsScanning(true)}
                className="flex items-center justify-center p-3 text-blue-600 bg-blue-50 rounded-xl border border-blue-100 active:scale-95 transition-all"
              >
                <ScanBarcode className="w-5 h-5" />
              </button>
            </div>
            
            {isValidating && (
               <div className="flex items-center gap-2 mt-2 px-2">
                 <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                 <span className="text-xs text-gray-500 font-medium italic">Đang kiểm tra kho...</span>
               </div>
            )}
            
            {/* EXTREME COLLISION OVERLAY */}
            {existsInSystem && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-red-600/90 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl border-4 border-red-500 animate-shake">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-5 bg-red-100 rounded-full animate-bounce">
                      <ScanBarcode className="w-16 h-16 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter leading-none mb-2">TRÙNG MÃ RỒI!</h2>
                      <p className="text-gray-600 font-medium px-4">Mã vạch này đang dùng cho 1 vài sản phẩm khác. Vui lòng kiểm tra lại ngay!</p>
                    </div>
                    <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                       <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Sản phẩm bị ảnh hưởng:</p>
                       <p className="font-bold text-gray-900">{foundProduct?.name}</p>
                       <p className="text-xs text-red-500 font-medium mt-1">Và những sản phẩm khác có cùng mã vạch này.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setFormData(f => ({...f, barcode: ''}))
                        setExistsInSystem(false)
                        setFoundProduct(null)
                      }}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-lg hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
                    >
                      ĐÃ HIỂU & QUAY LẠI
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NORMAL FOUND PRODUCT (UPGRADED UI) */}
            {foundProduct && !existsInSystem && (
              <div className="mt-4 p-5 bg-amber-50 border-2 border-amber-200 rounded-[1.5rem] flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500 shadow-md">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest">SẢN PHẨM HIỆN CÓ:</p>
                    </div>
                    <p className="text-xl font-black text-gray-900 leading-tight tracking-tight">{foundProduct.name}</p>
                 </div>
                 <div className="text-right pl-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Tồn kho</p>
                    <p className="text-2xl font-black text-amber-600 leading-none">{foundProduct.stock}</p>
                    <p className="text-[10px] text-amber-500 font-bold">{foundProduct.unit}</p>
                 </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Số lượng nhập</label>
              <input 
                type="number" 
                min="1"
                required
                className="w-full px-4 py-3 text-sm font-bold bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                value={formData.quantity}
                onChange={e => setFormData(f => ({...f, quantity: e.target.value}))}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              placeholder="Nhập từ nhà cung cấp nào..."
              value={formData.note}
              onChange={e => setFormData(f => ({...f, note: e.target.value}))}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !formData.barcode || existsInSystem}
            className="flex items-center justify-center w-full py-3.5 mt-8 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (existsInSystem ? "Khong the nhap (Trung ma)" : "Xac nhan Nhap Kho")}
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
