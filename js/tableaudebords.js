var linkModel = /(\d{2}h \d{2})/g;
var match = document.documentElement.outerHTML.match(linkModel);




function setTimeWork(){
    let timeWork  = match[match.length -1];
    let heureWork = parseInt(timeWork[0]*10) + parseInt(timeWork[1]);
    let MinuteWork = parseInt(timeWork[4]*10) + parseInt(timeWork[5]);
    let tabTime = [heureWork,MinuteWork];
    chrome.storage.local.set({ 'timeWork':tabTime }, function() {
        if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        } else {
        console.log("Temps de travail enregistré : " + tabTime);
        }
    });
}


function getTimework(callback){
    chrome.storage.local.get(['timeWork'], function(result) {
        if (result.timeWork == null) {

          callback(null);
        } else {
        const timeWork = result.timeWork;
        callback(timeWork);
        
      }
    });
    return null;
  }

function deleteTimeWork(){
chrome.storage.local.remove('timeWork', function() {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Valeur supprimée avec succès.');
    }
  });
}


getTimework(function(result) {//appel main
  if(result == null){//si aucune url à était enregistrer jusqu'à present
    setTimeWork();
    var urlPagePrecedente = document.referrer;
    var pattern = /^https:\/\/calao.univ-littoral.fr\/ressource\/voir\/\d{2,5}$/;
    if(pattern.test(urlPagePrecedente)){
      alert("UniTools:\nL'extension a été initialisée avec succès.\nVous allez être redirigés vers la ressource  précédente.");
      window.history.back();
    }   
  }
  else{
    setTimeWork();
  }
});


