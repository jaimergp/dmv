// Globals
var stage;
var widget;
document.addEventListener('DOMContentLoaded', function(){
  stage = new NGL.Stage();
  widget = NGL.StageWidget(stage);
  if (typeof google != 'undefined') {
    onLoadRouterGoogle();
  } else {
    onLoadRouterNGL();
  }
}, false);


// Functions
function onLoadRouterNGL(){
  var fileid = NGL.getQuery('fileid');
  var provider = NGL.getQuery('provider');
  fetchFile(fileid, provider);
}
function onLoadRouterGoogle(){
  google.script.url.getLocation(function(location) {
    var fileid = location.parameter.fileid;
    var provider = location.parameter.provider;
    fetchFile(fileid, provider);
  });
}
function fetchFile(fileid, provider){
  if (!fileid){
    return;
  }
  if (provider == 'drive') {
    console.log('Opening from' + provider)
    google.script.run.withSuccessHandler(LoadNGLMolecule).getFileById(fileid);
  } else if (provider == 'onedrive') {
    console.log('Opening from' + provider)
    alert('Microsoft OneDrive support is under development.')
  } else if (provider == 'pdb') {
    console.log('Opening from' + provider)
    LoadNGLMolecule({url: 'rcsb://' + fileid});
  } else {
    console.log('Opening from' + provider)
    LoadNGLMolecule({url: fileid});
  }
}
/*
 * Parses a response dict which can contain:
 * - blob: Blob object with molecular data
 * - filename: name of the molecule
 * - url: direct URL to molecule file
 *
 * If blob is provided, url is ignored.
 */
function LoadNGLMolecule(response) {
  if (!response) {
    return;
  }
  var filename = response.filename;
  var filenameinfo = NGL.getFileInfo(filename);
  if (!NGL.ParserRegistry.isStructure(filenameinfo.ext)){
    return;
  }
  if (response.blob) {
    console.log('Opening BLOB...')
    var molecule = new Blob([response.blob], {type: 'text/plain'});
  } else {
    var molecule = response.url;
  }
  stage.loadFile(molecule, {ext: filenameinfo.ext, name: filename})
    .then(function (component) {
      var sele = 'not (_C or _H or _N or _O)';
      component.addRepresentation("cartoon");  // for proteins
      component.addRepresentation("licorice", { multipleBond: "symmetric", sele: 'ligand' }); // for ligands
      component.addRepresentation("ball+stick", { sele: sele, aspectRatio: 3.0 }); // for metals
      // add labels to non-CHON atoms
      var labelText = {}
      var selectionObject = new NGL.Selection(sele);
      component.structure.eachAtom(function (AtomProxy) {
      var elem = AtomProxy.element
      labelText[AtomProxy.index] = elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase();
      }, selectionObject);
      component.addRepresentation(
        'label', {
          sele: sele,
          color: '#222222',
          name: 'non-CHON element',
          labelType: 'text',
          labelText: labelText,
          xOffset: 0.5,
          showBorder: true,
          borderColor: '#FFFFFF',
          borderWidth: 0.05,
          sdf: true
      }
    );
  // provide a "good" view of the structure
  component.autoView();
});
};
