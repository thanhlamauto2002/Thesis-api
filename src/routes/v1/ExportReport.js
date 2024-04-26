import express from 'express'
const Router = express.Router()
const XlsxPopulate = require('xlsx-populate');
const path = require('path');
const fs = require('fs');
Router.route('/')
  .post(async (req, res) => {
    try {
      const dataToExport = req.body.dataToExport;
      const option = req.body.option
      console.log(option)

      // 2. Tạo workbook mới từ một tệp Excel mẫu
      if (option === 'data') {
        const workbook = await XlsxPopulate.fromFileAsync('E:/HK232/LVTN/FormReport.xlsx');

        // 3. Lấy sheet trong workbook
        const sheet = workbook.sheet('Sheet1'); // Thay 'Sheet1' bằng tên sheet của bạn

        // 4. Điền dữ liệu vào workbook
        const startRow = 6; // Dòng bắt đầu của bảng
        const lastRowIndex = startRow + dataToExport.length; // Dòng cuối cùng của bảng
        const executorCell = sheet.cell(`F${lastRowIndex + 2}`);
        const creationDateCell = sheet.cell(`F${lastRowIndex + 3}`);
        const createPeopleCell = sheet.cell(`G${lastRowIndex + 2}`);
        const createTimeCell = sheet.cell(`G${lastRowIndex + 3}`);
        dataToExport.forEach((item, index) => {
          const rowIndex = startRow + index;
          sheet.cell(`A${rowIndex}`).value(item.SO2);
          sheet.cell(`B${rowIndex}`).value(item.NO);
          sheet.cell(`C${rowIndex}`).value(item.CO);
          sheet.cell(`D${rowIndex}`).value(item.O2);
          sheet.cell(`E${rowIndex}`).value(item.Temperature);
          sheet.cell(`F${rowIndex}`).value(item.Dust);
          sheet.cell(`G${rowIndex}`).value(item.Date);
          sheet.cell('E2').value(item.StartDate);
          sheet.cell('E3').value(item.EndDate);
          sheet.cell('E4').value(item.Station);
          sheet.cell(`G${lastRowIndex + 2}`).value(item.UserName);
          sheet.cell(`G${lastRowIndex + 3}`).value(item.CurrentTime);
        });
        executorCell.value('Creator:');
        creationDateCell.value('Created date:');
        executorCell.style({
          fill: '4F81BD', bold: true, horizontalAlignment: 'left', border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        });
        creationDateCell.style({
          fill: '4F81BD', bold: true, horizontalAlignment: 'left', border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        });
        createPeopleCell.style({
          border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        })
        createTimeCell.style({
          border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        })
        // Đường dẫn để lưu tệp Excel đã điền dữ liệu
        const outputPath = path.join(__dirname, 'output.xlsx');
        await workbook.toFileAsync(outputPath);

        const downloadUrl = 'http://localhost:8017/v1/export/download';

        res.status(200).json({ downloadUrl });
      }
      else {
        const workbook = await XlsxPopulate.fromFileAsync('E:/HK232/LVTN/FormReportAlarm.xlsx');

        // 3. Lấy sheet trong workbook
        const sheet = workbook.sheet('Sheet1'); // Thay 'Sheet1' bằng tên sheet của bạn

        // 4. Điền dữ liệu vào workbook
        const startRow = 6; // Dòng bắt đầu của bảng
        const lastRowIndex = startRow + dataToExport.length; // Dòng cuối cùng của bảng
        const executorCell = sheet.cell(`C${lastRowIndex + 2}`);
        const creationDateCell = sheet.cell(`C${lastRowIndex + 3}`);
        const createPeopleCell = sheet.cell(`D${lastRowIndex + 2}`);
        const createTimeCell = sheet.cell(`D${lastRowIndex + 3}`);
        dataToExport.forEach((item, index) => {
          const rowIndex = startRow + index;
          sheet.cell(`A${rowIndex}`).value(item.Value);
          sheet.cell(`B${rowIndex}`).value(item.Status);
          sheet.cell(`C${rowIndex}`).value(item.Area);
          sheet.cell(`D${rowIndex}`).value(item.Name);
          sheet.cell(`E${rowIndex}`).value(item.Date);
          sheet.cell('D2').value(item.StartDate);
          sheet.cell('D3').value(item.EndDate);
          sheet.cell('D4').value(item.Area);
          sheet.cell(`D${lastRowIndex + 2}`).value(item.UserName);
          sheet.cell(`D${lastRowIndex + 3}`).value(item.CurrentTime);
        });





        executorCell.value('Creator:');
        creationDateCell.value('Created date:');
        executorCell.style({
          fill: '4F81BD', bold: true, horizontalAlignment: 'left', border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        });
        creationDateCell.style({
          fill: '4F81BD', bold: true, horizontalAlignment: 'left', border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        });
        createPeopleCell.style({
          border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        })
        createTimeCell.style({
          border: {
            top: { style: 'medium', color: '000000' }, // Border trên (dày hơn, màu đen)
            bottom: { style: 'medium', color: '000000' }, // Border dưới (dày hơn, màu đen)
            left: { style: 'medium', color: '000000' }, // Border trái (dày hơn, màu đen)
            right: { style: 'medium', color: '000000' } // Border phải (dày hơn, màu đen)
          }
        })



        // Đường dẫn để lưu tệp Excel đã điền dữ liệu
        const outputPath = path.join(__dirname, 'output.xlsx');
        await workbook.toFileAsync(outputPath);

        const downloadUrl = 'http://localhost:8017/v1/export/download';

        res.status(200).json({ downloadUrl });
      }
    } catch (error) {
      console.error('Export to Excel failed:', error);
      res.status(500).json({ error: 'Export failed' });
    }
  })
Router.route('/download')
  .get((req, res) => {
    const filePath = path.join(__dirname, 'output.xlsx');
    res.download(filePath, 'output.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Download failed' });
      } else {
        // Clean up: delete the output file after download
        fs.unlinkSync(filePath);
      }
    });
  });


export const ExportReport = Router