'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ScanBarcode, Loader2 } from 'lucide-react'
import { BarcodeScanner } from '@/components/BarcodeScanner'
import { createProduct, getProductByBarcode } from './actions'
import { useEffect, useRef } from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { playNotificationSound, triggerVibration } from '@/lib/audio'

export default function NewProductPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCollision, setIsCollision] = useState(false)
  const [collidingProduct, setCollidingProduct] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    unit: 'cái',
    stock: '0',
    allowDuplicate: false
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.barcode.length >= 3) {
        setIsValidating(true)
        const res = await getProductByBarcode(formData.barcode)
        if (res.success && res.data) {
          setIsCollision(true)
          setCollidingProduct(res.data.product)
          // Cảnh báo âm thanh và rung ngay lập tức nếu không cho phép trùng
          if (!formData.allowDuplicate) {
            playNotificationSound('error')
            triggerVibration([200, 100, 200])
          }
        } else {
          setIsCollision(false)
          setCollidingProduct(null)
        }
        setIsValidating(false)
      } else {
        setIsCollision(false)
        setCollidingProduct(null)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [formData.barcode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)
    
    try {
      const res = await createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      })
      
      if (res.success) {
        setSuccess(true)
        playNotificationSound('beep')
        router.refresh()
        setTimeout(() => router.push('/products'), 1500)
      } else {
        setError(res.error || 'Có lỗi xảy ra khi tạo sản phẩm')
        playNotificationSound('error')
        triggerVibration([200, 100, 200])
      }
    } catch (err: any) {
      setError('Lỗi kết nối máy chủ')
      playNotificationSound('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 flex items-center px-4 h-14 bg-white border-b border-gray-200">
        <Link href="/products" className="p-2 -ml-2 text-gray-600 active:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="ml-2 font-semibold text-gray-900">Thêm sản phẩm mới</h1>
      </header>

      <div className={isCollision && !formData.allowDuplicate ? "animate-shake" : ""}>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* EXTREME COLLISION OVERLAY */}
          {isCollision && !formData.allowDuplicate && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-red-600/90 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl border-4 border-red-500 animate-shake">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-red-100 rounded-full animate-bounce">
                    <AlertTriangle className="w-16 h-16 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter leading-none mb-2">TRÙNG MÃ RỒI!</h2>
                    <p className="text-gray-600 font-medium px-4 leading-tight">Mã vạch này đã có sản phẩm sử dụng. Vui lòng kiểm tra lại!</p>
                  </div>
                  <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Sản phẩm hiện tại:</p>
                     <p className="font-bold text-gray-900 leading-tight">{collidingProduct?.name}</p>
                     <p className="text-xs text-red-500 font-medium mt-1 italic">Bạn phải tích "Cho phép trùng mã" nếu muốn tiếp tục.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(f => ({...f, barcode: ''}))
                      setIsCollision(false)
                      setCollidingProduct(null)
                    }}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-lg hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
                  >
                    ĐÃ HIỂU & QUAY LẠI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WARNING FOR ALLOWED DUPLICATES */}
          {isCollision && formData.allowDuplicate && (
            <div className="p-4 rounded-2xl border-2 bg-amber-50 border-amber-200 text-amber-700 flex flex-col items-center text-center gap-2 animate-in fade-in zoom-in duration-300">
               <AlertCircle className="w-10 h-10 animate-pulse text-amber-500" />
               <p className="font-black uppercase tracking-tight">Chú ý: Đã có sản phẩm trùng mã!</p>
               <p className="text-xs font-medium">Hệ thống sẽ cho phép lưu vì bạn đã tích "Cho phép trùng mã".</p>
               <p className="text-[10px] opacity-70 italic font-bold">({collidingProduct?.name})</p>
            </div>
          )}

          {/* Tên sản phẩm */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tên sản phẩm *</label>
            <input 
              required 
              type="text" 
              className={`w-full px-4 py-3 text-sm bg-white border rounded-xl focus:ring-1 outline-none transition-all ${isCollision && !formData.allowDuplicate ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'}`}
              placeholder="VD: Nước giải khát Coca Cola"
              value={formData.name}
              onChange={e => setFormData(f => ({...f, name: e.target.value}))}
            />
          </div>

          {/* Mã vạch */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mã vạch (Barcode) *</label>
            <div className="flex gap-2">
              <input 
                required 
                type="text" 
                className={`flex-1 px-4 py-3 text-sm font-mono bg-white border rounded-xl focus:ring-1 outline-none transition-all ${isCollision && !formData.allowDuplicate ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'}`}
                placeholder="Nhập mã hoặc quét camera"
                value={formData.barcode}
                onChange={e => setFormData(f => ({...f, barcode: e.target.value}))}
              />
              <button 
                type="button"
                onClick={() => setIsScanning(true)}
                className={`flex items-center justify-center p-3 rounded-xl border active:scale-95 transition-all ${isCollision && !formData.allowDuplicate ? 'text-red-600 bg-red-50 border-red-200' : 'text-blue-600 bg-blue-50 border-blue-100'}`}
              >
                <ScanBarcode className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Giá + Đơn vị */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
              <input 
                type="number" 
                min="0"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                placeholder="0"
                value={formData.price}
                onChange={e => setFormData(f => ({...f, price: e.target.value}))}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Đơn vị tính</label>
              <select 
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none appearance-none"
                value={formData.unit}
                onChange={e => setFormData(f => ({...f, unit: e.target.value}))}
              >
                <option>cái</option>
                <option>hộp</option>
                <option>thùng</option>
                <option>kg</option>
                <option>chai</option>
              </select>
            </div>
          </div>

          {/* Tồn kho đầu kỳ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Tồn kho ban đầu</label>
              <input 
                type="number" 
                min="0"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                placeholder="0"
                value={formData.stock}
                onChange={e => setFormData(f => ({...f, stock: e.target.value}))}
              />
            </div>
            <div className="flex flex-col justify-end pb-1">
               <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.allowDuplicate}
                    onChange={e => setFormData(f => ({...f, allowDuplicate: e.target.checked}))}
                  />
                  <span className="text-sm font-medium text-gray-700">Cho phép trùng mã</span>
               </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || isValidating || (isCollision && !formData.allowDuplicate)}
            className={`flex items-center justify-center w-full py-3.5 mt-8 text-sm font-bold text-white rounded-xl active:scale-95 transition-all disabled:opacity-50 ${isCollision && !formData.allowDuplicate ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             isValidating ? "Đang kiểm tra mã..." :
             (isCollision && !formData.allowDuplicate ? "Không thể lưu (Trùng mã)" : "Lưu Sản Phẩm")}
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
