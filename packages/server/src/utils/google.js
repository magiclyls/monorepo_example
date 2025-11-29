const fs = require("fs");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const path = require("path");

// 生成文件阅读调式
// const logStream = fs.createWriteStream('./log.js', { flags: 'a' });
// console.log = (...args) => {
//   const msg = args.join(' ') + '\n';
//   process.stdout.write(msg);
//   logStream.write(msg);
// };


const options = {
  excelProjectID: "19d8VD3111cvpvxWRd-7gnXv5XBgOVqUE5dZGgo7YgVQ",
  useApiKey: "AIzaSyATJfm-iZ90GhxBukRupBK71r0E6G8jjr4",
  sheets:[0]  //选择捉取的sheets Index 如0 彩票
};

// getGoogleExcelData()

async function getGoogleExcelData(option = options) {
  const doc = new GoogleSpreadsheet(option.excelProjectID);
  doc.useApiKey(option.useApiKey);
  await doc.loadInfo();
  console.log(doc.title, "💪🤗🤗文档捉取完成...");
  const { output } = await parseExcel(doc, option.sheets);
  // console.log(JSON.stringify(output));
  return output;
}

async function parseExcel(doc, sheets = []) {
  const output = {};
  const firstSheet = doc.sheetsByIndex[0];
  await firstSheet.loadHeaderRow();

  firstSheet.headerValues.filter((text) => text !== "key").map(async (langKey) => (output[langKey] = {}));
  await Promise.all(
    doc.sheetsByIndex.map(async (sheet, sheetIndex) => {
      //sheet单个表  //sheet.title  //sheetsByIndex表数组
      await sheet.loadHeaderRow();
      if (sheets.length === 0) {
        await Promise.all(
          sheet.headerValues
          .filter((text) => text !== "key")
          .map(async (langKey, index1) => {
            output[langKey][sheet.title] = {};
            const sheetData = await sheet.getRows();
            sheetData.forEach((sheetVal) => {
              if(output[langKey][sheet.title][sheetVal.key]) throw new Error(`${sheet.title}KEY ${sheetVal.key} 已存在`)
              output[langKey][sheet.title][sheetVal.key] = sheetVal[langKey]
            });
          })
      );
      } else if (sheets.includes(sheetIndex)) {
        await Promise.all(
          sheet.headerValues
            .filter((text) => text !== "key")
            .map(async (langKey, index1) => {
              output[langKey] = {};
              const sheetData = await sheet.getRows();
              sheetData.forEach((sheetVal) => {
                if(output[langKey][sheetVal.key]) throw new Error(`KEY ${sheetVal.key} 已存在`)
                output[langKey][sheetVal.key] = sheetVal[langKey]
              });
            })
        );
      }
    })
  );
  return { output };
}

module.exports = {
  getGoogleExcelData,
  options
}


