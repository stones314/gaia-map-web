import { GoogleSpreadsheet } from "google-spreadsheet";
import { hexMap, HexMap } from './calc/HexMap';

const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

export const mapTypes = ["10", "9A", "9B", "8", "7A", "7B", "7C", "7D", "7E"];

export function mapType(numSec, secOpt) {
    if (numSec === 10) return "10";
    if (numSec === 9) {
        if (secOpt === 0) return "9A";
        if (secOpt === 1) return "9B";
    }
    if (numSec === 8) return "8";
    if (numSec === 7) {
        if (secOpt === 0) return "7A";
        if (secOpt === 1) return "7B";
        if (secOpt === 2) return "7C";
        if (secOpt === 3) return "7D";
        if (secOpt === 4) return "7E";
    }
    return "10";
}

export async function loadMaps() {
    var out = {
        "Error": "",
        "10": null,
        "9A": null,
        "9B": null,
        "8": null,
        "7A": null,
        "7B": null,
        "7C": null,
        "7D": null,
        "7E": null,
        "Meta": null,
    }

    try {

        await doc.useApiKey("AIzaSyDDBUDDkWmwrWEcS8kz2dpPVTg6bRZGMIA");
        //await doc.useServiceAccountAuth({
        //    client_email: process.env.REACT_APP_CLIENT_EMAIL,
        //    private_key: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
        //});

        // loads document properties and worksheets
        await doc.loadInfo();

        const sM = doc.sheetsByTitle["Meta"];
        out["Meta"] = await sM.getRows();

        for (const [i, m] of mapTypes.entries()) {
            const sheet = doc.sheetsByTitle[m];
            out[m] = await sheet.getRows();
        }

    } catch (e) {
        console.error('Error: ', e);
        out.error = e;
    }
    return out;
}

export async function reEvaluateMaps() {
    var error = "";
    try {

        //await doc.useApiKey("AIzaSyDDBUDDkWmwrWEcS8kz2dpPVTg6bRZGMIA");
        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_CLIENT_EMAIL,
            private_key: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
        });

        // loads document properties and worksheets
        await doc.loadInfo();
        const keyCol = 0;
        const eqCol = 1;
        const clCol = 2;
        const edCol = 3;
        const myMapTypes = ["7A", "10"];
        var hexMap = new HexMap();
        hexMap.criteria.maxEdgeCount = 1;
        var mapKey = "";

        for (const [i, m] of myMapTypes.entries()) {
            const sheet = doc.sheetsByTitle[m];
            await sheet.loadCells({ startRowIndex: 1 });
            const maxRow = sheet.rowCount;
            for (var r = 1; r < maxRow; r++) {
                mapKey = sheet.getCell(r, keyCol).value;
                if (!mapKey) continue;
                const out = hexMap.setFromString(mapKey);
                if (!out.valid) continue;
                const eqCell = sheet.getCell(r, eqCol);
                eqCell.value = hexMap.getMinEqDist();
                const clCell = sheet.getCell(r, clCol);
                clCell.value = hexMap.biggestCluster;
                const edCell = sheet.getCell(r, edCol);
                edCell.value = hexMap.highestEdgeCount[1];
            }
            await sheet.saveUpdatedCells();
        }

    } catch (e) {
        console.error('Error: ', e);
        error = e + " for map " + mapKey;
    }
    return error + hexMap.nbrMat["Bl"]["No"][0];
}
