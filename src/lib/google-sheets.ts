import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Khởi tạo Auth
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const serviceAccountPrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const sheetId = process.env.GOOGLE_SHEET_ID;

const auth = new JWT({
  email: serviceAccountEmail,
  key: serviceAccountPrivateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

/**
 * Ghi một dòng giao dịch mới vào Google Sheets
 */
export async function syncTransactionToSheet(data: {
  timestamp: string;
  user: string;
  type: string;
  productName: string;
  barcode: string;
  quantity: number;
  note: string;
}) {
  if (!sheetId || !serviceAccountEmail || !serviceAccountPrivateKey) {
    console.warn('Google Sheets integration is not configured. Skipping sync.');
    return;
  }

  try {
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    
    // Tìm hoặc tạo sheet "Transactions"
    let sheet = doc.sheetsByTitle['Transactions'];
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: 'Transactions', 
        headerValues: ['Thời gian', 'Người thực hiện', 'Loại', 'Sản phẩm', 'Mã vạch', 'Số lượng', 'Ghi chú'] 
      });
    }

    await sheet.addRow({
      'Thời gian': data.timestamp,
      'Người thực hiện': data.user,
      'Loại': data.type === 'IN' ? 'NHẬP' : 'XUẤT',
      'Sản phẩm': data.productName,
      'Mã vạch': data.barcode,
      'Số lượng': data.quantity,
      'Ghi chú': data.note || ''
    });

    console.log('Successfully synced transaction to Google Sheets');
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
  }
}
