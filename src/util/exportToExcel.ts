import * as XLSX from 'xlsx';
export const exportToExcel = (data: any[], fileName: string = 'ExportedData', sheetName: string = 'Sheet1') => {
  try {
    const workbook = XLSX.utils.book_new();
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};
