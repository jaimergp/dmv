
function doGet() {
  var h = HtmlService.createHtmlOutputFromFile('index');
  h.setTitle('DMV - Drive Molecule Viewer');
  return h
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