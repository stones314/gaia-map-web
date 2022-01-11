import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

export async function loadMaps() {
    var out = {
        error: "",
        rows: null,
        meta: null,
    }

    try {

        await doc.useApiKey("AIzaSyDDBUDDkWmwrWEcS8kz2dpPVTg6bRZGMIA");
        //await doc.useServiceAccountAuth({
        //    client_email: process.env.REACT_APP_CLIENT_EMAIL,
        //    private_key: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
        //});

        // loads document properties and worksheets
        await doc.loadInfo();

        const sheet = doc.sheetsByTitle["Meta"];
        const rows = await sheet.getRows()
        out.meta = rows;

    } catch (e) {
        console.error('Error: ', e);
        out.error = e;
    }
    return out;
}

export class SheetMaps {
    constructor() {

    }


}