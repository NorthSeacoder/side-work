import * as XLSX from 'xlsx';

interface Options {
    headers?: string;
    skipHeader?: boolean;
}
export default (data: any, filename = '导出数据.xlsx') => {
    const wb = XLSX.utils.book_new();
    wb.Props = {
        Title: filename,
        Subject: '@nsea/xlsxExport',
        Author: 'nsc',
        CreatedDate:new Date()
    };
    if (Array.isArray(data)) {
        data = {sheet1: data};
    }
    for (let sheet_name in data) {
        if (!data.hasOwnProperty(sheet_name)) {
            continue;
        }
        const content = data[sheet_name];
        wb.SheetNames.push(sheet_name);
        let is_aoa = false;
        let ws;
        if (content.length && content[0] && Array.isArray(content[0])) {
            is_aoa = true;
        }
        if (is_aoa) {
            ws = XLSX.utils.aoa_to_sheet(content);
        } else {
            const option: Options = {};
            if (content.length) {
                option.headers = content.unshift(); 
                option.skipHeader = true;
            }
            ws = XLSX.utils.json_to_sheet(content, option);
        }
        wb.Sheets[sheet_name] = ws;
    }
    XLSX.writeFile(wb, filename);
};
