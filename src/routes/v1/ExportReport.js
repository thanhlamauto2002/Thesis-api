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
      console.log(dataToExport)
      const dataToExportLength = dataToExport.length
      const workbook = await XlsxPopulate.fromFileAsync('E:/HK232/LVTN/FormReport.xlsx');

      // 3. Lấy sheet trong workbook
      const sheet = workbook.sheet('Sheet1'); // Thay 'Sheet1' bằng tên sheet của bạn

      // 4. Điền dữ liệu vào workbook
      const startRow = 6; // Dòng bắt đầu của bảng
      let lastRowIndex = null;
      if (option === 'allgas') {
        lastRowIndex = startRow + dataToExportLength * 6;
      }
      else {
        lastRowIndex = startRow + dataToExportLength;
      }
      console.log(dataToExportLength)
      console.log(lastRowIndex)
      const executorCell = sheet.cell(`E${lastRowIndex + 2}`);
      const creationDateCell = sheet.cell(`E${lastRowIndex + 3}`);
      const createPeopleCell = sheet.cell(`F${lastRowIndex + 2}`);
      const createTimeCell = sheet.cell(`F${lastRowIndex + 3}`);
      let rowIndex = 0;

      dataToExport.forEach((item, index) => {
        const lengthPoint = item.Parameter.length
        if (index === 0) {
          rowIndex = startRow + index;
        } else {
          rowIndex = rowIndex + lengthPoint;
        }
        // Duyệt qua các phần tử của mảng Parameter
        item.Parameter.forEach((param, paramIndex) => {
          const item1 = { StatusStation: 'Connected' }; // Ví dụ giá trị
          const statusStation = item.StatusStation.trim();
          if (paramIndex === 0) {
            sheet.cell(`A${rowIndex + paramIndex}`).value(item.Date); // Cột A: Ngày
          }
          sheet.cell(`B${rowIndex + paramIndex}`).value(param);      // Cột B: Tham số
          sheet.cell(`C${rowIndex + paramIndex}`).value(item.Unit[paramIndex]);  // Cột C: Đơn vị
          sheet.cell(`D${rowIndex + paramIndex}`).value(item.Value[paramIndex]); // Cột D: Giá trị
          sheet.cell(`E${rowIndex + paramIndex}`).value(item.SignalStatus[paramIndex] || ''); // Cột E: Tình trạng tín hiệu
          sheet.cell(`F${rowIndex + paramIndex}`).value(item.Station); // Cột F: Trạm đo
          sheet.cell(`G${rowIndex + paramIndex}`).value(statusStation);

        });

        sheet.cell('E2').value(item.StartDate);
        sheet.cell('E3').value(item.EndDate);
        sheet.cell('E4').value(item.Area);
        sheet.cell(`F${lastRowIndex + 2}`).value(item.UserName);
        sheet.cell(`F${lastRowIndex + 3}`).value(item.CurrentTime);
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

    catch (error) {
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