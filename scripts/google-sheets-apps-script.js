/**
 * Google Apps Script — grava inscrições do formulário na planilha.
 *
 * COMO CONFIGURAR:
 * 1. Crie uma planilha no Google Sheets (ex.: "Inscrições Jantar GESCA").
 * 2. Extensões → Apps Script.
 * 3. Apague o código padrão e cole TODO este arquivo.
 * 4. Salve e clique em Implantar → Nova implantação.
 * 5. Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 6. Copie a URL da implantação.
 * 7. No projeto, crie um arquivo .env com:
 *      GOOGLE_SHEETS_WEBHOOK_URL=cole_a_url_aqui
 * 8. Reinicie o servidor (`npm run dev`).
 *
 * A primeira linha da aba "Inscricoes" será preenchida automaticamente com os cabeçalhos.
 */

var SHEET_NAME = "Inscricoes";

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet_();
    ensureHeaders_(sheet, body.headers || []);

    if (body.row && body.row.length) {
      sheet.appendRow(body.row);
    } else {
      throw new Error("Payload sem linha (row).");
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  return json_({
    ok: true,
    message: "Webhook do formulário GESCA ativo. Use POST para enviar inscrições.",
  });
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  if (!headers || !headers.length) return;
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }
  var firstCell = sheet.getRange(1, 1).getValue();
  if (!firstCell) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
