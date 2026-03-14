'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { canManageUsers, canDeleteProducts, canInbound, canOutbound } from '@/lib/auth-utils'

export async function createUser(data: { name: string; pin: string; role: string }) {
  const user = await getCurrentUser()
  if (!user || !canManageUsers(user)) {
    throw new Error('Bạn không có quyền quản lý tài khoản.')
  }
  const existing = await (prisma as any).user.findFirst({ where: { pin: data.pin } })
  if (existing) throw new Error('Mã PIN này đã được sử dụng.')
  return (prisma as any).user.create({ data })
}

export async function deleteUser(id: string) {
  const user = await getCurrentUser()
  if (!user || !user.canManageUsers) throw new Error('Không có quyền.')
  if (user.id === id) throw new Error('Không thể xóa chính mình.')
  await (prisma as any).user.delete({ where: { id } })
  revalidatePath('/users')
}

export async function createProduct(data: {
  name: string
  barcode: string
  price: number
  unit: string
  stock: number
  allowDuplicate?: boolean
}) {
  try {
    const isDuplicateAllowedForNew = data.allowDuplicate ?? false
    // LOGIC CHỈNH SỬA: KIỂM TRA TRÙNG LẶP TUYỆT ĐỐI
    const existingProduct = await (prisma as any).product.findFirst({
      where: { barcode: data.barcode }
    })

    if (existingProduct) {
      if (!existingProduct.allowDuplicate) {
        return { 
          success: false, 
          error: `Mã vạch này đang thuộc về sản phẩm duy nhất: '${existingProduct.name}'. Không thể tạo thêm.` 
        }
      }
      if (!isDuplicateAllowedForNew) {
        return { 
          success: false, 
          error: `Sản phẩm '${existingProduct.name}' đã dùng mã này. Bạn phải tích 'Cho phép trùng mã' nếu muốn tiếp tục.` 
        }
      }
    }

    const product = await (prisma as any).product.create({ data: {
      name: data.name,
      barcode: data.barcode,
      price: data.price,
      unit: data.unit,
      stock: data.stock,
      allowDuplicate: isDuplicateAllowedForNew
    }})

    if (data.stock > 0) {
      await prisma.transaction.create({ data: {
        productId: product.id, type: 'IN', quantity: data.stock, note: 'Tồn kho ban đầu'
      }})
    }

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true, data: product }
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi khi tạo sản phẩm" }
  }
}

export async function getProductByBarcode(barcode: string) {
  try {
    if (!barcode) return { success: true, data: null }
    const products = await prisma.product.findMany({
      where: { barcode },
      orderBy: { updatedAt: 'desc' }
    })

    if (products.length === 0) return { success: true, data: null }
    return {
      success: true,
      data: {
        product: products[0],
        existsInSystem: true, // Barcode đã có trong hệ thống (>= 1 sản phẩm)
        isAmbiguous: products.length > 1, // Trùng nhiều sản phẩm cùng lúc
        count: products.length
      }
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi khi tìm sản phẩm" }
  }
}

import { syncTransactionToSheet } from '@/lib/google-sheets'

export async function processTransaction(barcode: string, type: 'IN' | 'OUT', quantity: number, note: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Cần đăng nhập.' }
    
    if (type === 'IN' && !canInbound(user)) return { success: false, error: 'Bạn không có quyền Nhập kho.' }
    if (type === 'OUT' && !canOutbound(user)) return { success: false, error: 'Bạn không có quyền Xuất kho.' }

    const products = await prisma.product.findMany({ 
      where: { barcode },
      orderBy: { updatedAt: 'desc' }
    })
    
    if (products.length === 0) return { success: false, error: 'Không tìm thấy sản phẩm với mã vạch này.' }
    
    // CHẶN NHẬP KHO: Nếu sản phẩm đã có trong kho VÀ còn tồn > 0
    if (type === 'IN') {
      const inStockProducts = products.filter(p => p.stock > 0)
      if (inStockProducts.length > 0) {
        const p = inStockProducts[0]
        return { 
          success: false, 
          existsInSystem: true,
          error: `MÃ VẠCH TRÙNG: Sản phẩm '${p.name}' đang có trong kho (Tồn: ${p.stock}). Nếu là SP mới vui lòng dùng mã khác!` 
        }
      }
    }

    const product = products[0]
    const oldStock = product.stock
    
    if (type === 'OUT' && product.stock < quantity) {
      return { success: false, error: `Kho không đủ hàng. Tồn hiện tại: ${product.stock} ${product.unit}` }
    }

    const newStock = type === 'IN' ? oldStock + quantity : oldStock - quantity

    await prisma.$transaction([
      prisma.product.update({ 
        where: { id: product.id }, 
        data: { stock: type === 'IN' ? { increment: quantity } : { decrement: quantity } }
      }),
      prisma.transaction.create({ data: { 
        productId: product.id, 
        type, 
        quantity,
        note,
        // @ts-ignore
        userId: user.id 
      } })
    ])

    // Đồng bộ lên Google Sheets (Không đợi)
    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    syncTransactionToSheet({
      timestamp: now,
      user: user.name,
      type,
      productName: product.name,
      barcode: product.barcode,
      quantity,
      note: note || ''
    }).catch(err => console.error('Sync failure:', err))

    revalidatePath('/')
    revalidatePath('/products')
    return { 
      success: true, 
      data: { product, oldStock, newStock, quantity, type } 
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi xử lý giao dịch" }
  }
}
