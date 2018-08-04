
function doGet(e) {
  var t = HtmlService.createTemplateFromFile('index');
  var html = t.evaluate();
  html.setTitle('DMV - Drive Molecule Viewer');
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getFileById(fileid) {
  if(!fileid){
    return null;
  }
  var file = DriveApp.getFileById(fileid.split(' ').join(''));
  var response = {blob: file.getBlob().getDataAsString(),
                  filename: file.getName()}
  return response;
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}

/**
 * Displays an HTML-service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showPicker() {
  return include('picker');
}

