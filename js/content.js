var OBJECTIF;
var POURCENTAGE_AVANCEMENT;

//------------ Géstion des ressource Open/Copy ------------
var linkModel = /lancement de la ressource si web\n\s+window\.open\("([^"]+)"\)/i;
var match = document.documentElement.outerHTML.match(linkModel);


/*---------------------------------------------------------------------------- */

function annimOpen_Ressource(){

}


function annimClose_Ressource(){
  
}

let isEventEnabled = true; // Variable pour activer/désactiver les événements

// Fonction pour activer les événements
function enableEvents() {
  window.addEventListener('blur', handleBlur);
  window.addEventListener('focus', handleFocus);
  isEventEnabled = true;
}

// Fonction pour désactiver les événements
function disableEvents() {
  window.removeEventListener('blur', handleBlur);
  window.removeEventListener('focus', handleFocus);
  isEventEnabled = false;
}

// Fonction à exécuter lorsque la fenêtre perd le focus
function handleBlur() {
  console.log('La fenêtre a perdu le focus');
}

// Fonction à exécuter lorsque la fenêtre regagne le focus
function handleFocus() {
  console.log('La fenêtre a regagné le focus');
  disableEvents(); // Désactiver les événements (à appeler quand vous ne voulez plus les surveiller)
  annimClose_Ressource();
}


/*---------------------------------------------------------------------------- */

//ouvre la ressource dans un nouvelle onglet

function openRessource() {
  if (match) {
    let resourceLink = match[1];
    //afficheRessource(resourceLink);
    //window.open(resourceLink, 'Votre ressource', 'width=' + screen.width + ',height=' + screen.height);//'_blank'
    
    enableEvents(); // Activer les événements (à appeler quand vous le souhaitez)
    annimOpen_Ressource();
    
    const widthPercentage = 60;
    const heightPercentage = 70;

    const screenWidth = screen.width;
    const screenHeight = screen.height;

    const windowWidth = (widthPercentage / 100) * screenWidth;
    const windowHeight = (heightPercentage / 100) * screenHeight;

    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;

    const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`;

    window.open(resourceLink, '_blank', windowFeatures);
    
    
  }
}




//copie la ressource si cliqué, et affiche un check pendant 2sec
function copyRessource() {
  if (match) {
    let resourceLink = match[1];
    let copyButton = document.getElementById("copyResourceButton");
    let originalText = copyButton.innerText;

    navigator.clipboard.writeText(resourceLink).then(function () {
      copyButton.innerText = '✔';
      setTimeout(function () {
        copyButton.innerText = originalText;
      }, 2000);
    }, function () {
      console.error('Failed to copy link to clipboard!');
    });
  }
}







//------------ récupération du temps passé et affichage ------------

//recupere le temps de travail, si il n'existe pas ont initialise de force en ce rendant sur le carnet de bords
function getTimework(callback) {
  chrome.storage.local.get(['timeWork'], function (result) {
    if (result.timeWork == null) {

      window.open("https://calao.univ-littoral.fr/carnet-de-bord/voir/19788", "_self");


      console.log("ok");

      callback(null);
    } else {
      const timeWork = result.timeWork;
      if (timeWork) {
        console.log("Heure :", timeWork[0]);
        console.log("Minute :", timeWork[1]);
      }
      callback(timeWork);
    }
  });
}




//affiche le temps de travail actuelement fait sous un bonne affichage
function UpdateTimeWork(Heure, Minute) {
  let H = 'h';
  if (Minute < 10) {//pour avoir 5h09 au lieu de 5h9 
    H += '0';
  }
  document.getElementById('TimeWork').textContent = Heure + H + Minute;
}




//actualise le graphique de progression par rapport au pourcentage (un pourcentage de l'état actuel peut etre transmis pour ne par re-commencer l'annimation à 0, mais la continuer)
function UpdateGraph(pourcentage, pourcentageDep = null) {//poucentageDep permet de continuer sans retourner au debut
  var cercle = document.getElementById('cerclePourcent');
  document.getElementById("pourcent").textContent = pourcentage + "%";
  var i = 0;
  if (pourcentageDep != null) { i = pourcentageDep; }
  function changeCouleurLoop() {
    if (i <= pourcentage) {
      cercle.style.background = `conic-gradient(orange 0%, orange ${i}%, #333335 ${i}%)`;
      i++;
      setTimeout(changeCouleurLoop, 9); // Pause de 5 millisecondes avant la prochaine itération
    }
  }
  changeCouleurLoop(); // Démarre la boucle

}


//calcul la progression en pourcentage
function calculProgression(Heure, Minute, obj_TimeWork) {
  temps_utilisateur_minutes = Heure * 60 + Minute;
  objectif_minutes = obj_TimeWork * 60;
  progression = (temps_utilisateur_minutes / objectif_minutes) * 100;
  progression = progression.toFixed(1);
  return progression;

}


//fonction test pour vérifier le bon fonctionnement de la récupération du temps de travail
//non utilisé
function deleteTimeWork() {
  chrome.storage.local.remove('timeWork', function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Valeur supprimée avec succès.');
    }
  });
}








//------------ Fonction OBJ ------------
var Minute;
var Heure;
var ObjHeure;

//affiche l'objectif sur l'affichage principal
function updateObjHeure(obj) {
  document.getElementById("nbHeureObj").textContent = obj + "h";
}

//affiche dans les paramètre le nombre d'heure d'objectif enregistré 
function updateObjHeureParam(obj) {
  document.getElementById("choixObjHeure").value = obj;
}

//enregistre le nouveau temps de travail séléctionné, et actualise tout ce qui est en rapport
function setObjHeure(OBJ = null) {
  console.log(Heure, ":", Minute)
  let obj = document.getElementById("choixObjHeure").value;
  if (OBJ != null) {
    obj = OBJ;
  }
  chrome.storage.local.set({ 'objHeure': obj }, function () { });
  OBJECTIF = obj;
  updateObjHeureParam(obj);
  updateObjHeure(obj);
  POURCENTAGE_AVANCEMENT = calculProgression(Heure, Minute, obj);
  UpdateGraph(POURCENTAGE_AVANCEMENT);
}


//appel main qui récupère l'objectif enregistrer , et sinon le fixe à 20
function getObjHeure(callback) {
  chrome.storage.local.get(['objHeure'], function (result) {
    if (result.objHeure == null) {
      setObjHeure(20);
      callback(20);
    } else {
      OBJECTIF = result.objHeure;

      updateObjHeureParam(OBJECTIF);
      updateObjHeure(OBJECTIF);
      POURCENTAGE_AVANCEMENT = calculProgression(Heure, Minute, OBJECTIF);
      UpdateGraph(POURCENTAGE_AVANCEMENT);
      callback(ObjHeure);
    }
  });
}
//------------ Fonction Date -----------
var today
var date;
var regexDate = /^\d{4}-\d{2}-\d{2}$/;

//calcul la date minium (aujourd'hui)
function setMinDate(minDate) {
  document.getElementById("dateObj").setAttribute('min', minDate);
}

//afuche le nombre de jours avant la date objectif
function updateNbjour(Nbjour) {
  let text = " ";
  if (Nbjour != null && Nbjour> -1000 && Nbjour < 1000) {
    if (Nbjour != 0) {
      text = Nbjour + " jours";

    }
    else {
      text = "Aujourd'hui"
    }
  }
  document.getElementById("Nbjour").textContent = text;

}

//affiche la date enregistrer dans les paramètre
function updateDateParam(date) {
  document.getElementById("dateObj").value = date;
}



//calcul le nombre de jour qui sépare today et date de l'objectif
function calculerNombreJoursAvant(today, dateObj) {
  // Convertissez les dates au format "aaaa-mm-dd" en objets Date
  var todayDate = new Date(today);
  var dateObjDate = new Date(dateObj);

  // Définissez l'heure à midi pour les deux dates (pour éviter les problèmes de fuseau horaire)
  todayDate.setHours(12, 0, 0, 0);
  dateObjDate.setHours(12, 0, 0, 0);

  // Calculez la différence entre les deux dates en millisecondes
  var differenceEnMillisecondes = dateObjDate - todayDate;

  // Convertissez la différence en jours
  var differenceEnJours = Math.floor(differenceEnMillisecondes / (1000 * 60 * 60 * 24));
  updateNbjour(differenceEnJours);
  return differenceEnJours;
}



//récupere la date d'aujourd'hui
function getToday() {
  today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  today = `${year}-${month}-${day}`;
  setMinDate(today);
  return today;
}


//regarde si une date et au bon format aaaa-mm-jj (si l'utilisateur rentre une date seulement à moitié par exemple)
function testDate(date){
  if (regexDate.test(date)) {
    return true;
  }
  return false;
}

//enregistre la date
function setDate(date) {

  chrome.storage.local.set({ 'date': date }, function () { });
  if(testDate(date)){
  calculerNombreJoursAvant(today, date);}
}



//recupere la date de l'objectif, et si elle n'existe pas, l'enregistre à null
function getDate(callback) {
  chrome.storage.local.get(['date'], function (result) {
    if (result.date == null) {
      setDate(null);
      callback(null);
    } else {
      date = result.date;
      updateDateParam(date);
      callback(date);
    }
  });
}




//------------ appel main ------------


//appel principal qui va permetre , de récuperer le temps de travail / de récuperer l'objectif / de recuperer la date actuel et de faire les calcul en question
getTimework(function (result) {//appel main
  if (result != null) {
    Heure = result[0];
    Minute = result[1];
    UpdateTimeWork(Heure, Minute);
    getObjHeure(function (resultOBJ) {
      ObjHeure = resultOBJ;
    });
    var today = getToday();
    getDate(function (resultDate) {
      date = resultDate;
      if(testDate(date)){
      calculerNombreJoursAvant(today, date);}
    });


  }
});


//------------ Partie timer ------------
/*
function timerT(){//crée un chronometre pour savoir combien de temps on a passer sur la ressource
  var elt = document.getElementById('timeId');


  var sec = 0;
  var min = 0;
  var hrs = 0;
  var t;

  function tick() {
    sec++;
    if (sec >= 60) {
      
      sec = 0;
      min++;
      UpdateTimeWork(Heure+hrs,Minute+min);
      p = calculProgression(Heure+hrs,Minute+min, OBJECTIF);
      UpdateGraph(p,POURCENTAGE_AVANCEMENT);
      POURCENTAGE_AVANCEMENT = p;
      if (min >= 60) {
        min = 0;
        hrs++;
      }
    }
  }
  function add() {
    tick();
    elt.textContent = (hrs > 9 ? hrs : '0' + hrs) + ':' +
    (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
    timer();
  }
  function timer() {
    t = setTimeout(add, 1000);
  }
  document.getElementById('contenerMinuteur').style.display = "block";
  timer();

}
*/
function timerT() {
  var elt = document.getElementById('timeId');
  var sec = 0;
  var min = 0;
  var hrs = 0;
  var t;

  function tick() {
    sec++;
    if (sec >= 60) {
      sec = 0;
      min++;
      UpdateTimeWork(Heure + hrs, Minute + min);
      p = calculProgression(Heure + hrs, Minute + min, OBJECTIF);
      UpdateGraph(p, POURCENTAGE_AVANCEMENT);
      POURCENTAGE_AVANCEMENT = p;
      if (min >= 60) {
        min = 0;
        hrs++;
      }
    }
  }

  function add() {
    tick();
    elt.textContent = (hrs > 9 ? hrs : '0' + hrs) + ':' +
      (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
    t = setTimeout(add, 1000); // Exécution asynchrone avec setTimeout
  }

  function startTimer() {
    document.getElementById('contenerMinuteur').style.display = "block";
    add(); // Démarre le chronomètre
  }

  startTimer(); // Démarre le chronomètre initial
}


/*
//crée un ecouteur d'evenement sur le bouton de lancement de la ressource pour lancer chrono lors de l'appuie
const buttons = document.querySelectorAll('a[title="Lancer la ressource"]');
// Vérifiez s'il y a un bouton trouvé
console.log("buttons:",buttons);
if (buttons.length > 0) {
    
  buttonsLancementRessource = buttons[0];
  console.log("bouton id",buttonsLancementRessource.id);
  //document.getElementById(buttonsLancementRessource.id).style.backgroundColor = "red";
  document.getElementById(buttonsLancementRessource.id).addEventListener("mouseover", function(event) {
    console.log("chrono");
    timerT();
    });

}


  
const buttonLancementRessource = document.querySelector('a[title="Lancer la ressource"]');

if (buttonLancementRessource) {
  console.log("ok1");
  buttonLancementRessource.addEventListener("mouseover", function(event) {
    console.log("ok2");
    timerT();
  });
}
*/

/*----------------------------------------------------- */



/*----------------------------------------------------- */

//var f = `(function() {var elt = document.getElementById('timeId');var sec = 0;var min = 0;var hrs = 0;var t;function tick() {sec++;if (sec >= 60) {sec = 0;min++;if (min >= 60) {min = 0;hrs++;}}}function add() {tick();elt.textContent = (hrs > 9 ? hrs : '0' + hrs) + ':' +(min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);t = setTimeout(add, 1000);}function startTimer() {document.getElementById('contenerMinuteur').style.display = 'block';add();}startTimer();})(); `

var f = `(function () {
  var elt = document.getElementById('timeId');
  var sec = 0;
  var min = 0;
  var hrs = 0;
  var t;

  //initialisation de la date de départ
  var heure_debut, minute_debut, seconde_debut, temps_debut;
  temps_debut = new Date();
  heure_debut = temps_debut.getHours();
  minute_debut = temps_debut.getMinutes();
  seconde_debut = temps_debut.getSeconds();

  function startTimer() {

      // Calculer le temps écoulé depuis l'heure de départ en secondes
      var temps_actuel = new Date();
      var temps_ecoule = Math.floor((temps_actuel - temps_debut) / 1000);

      // Calculer les heures, minutes et secondes
      hrs = Math.floor(temps_ecoule / 3600);
      min = Math.floor((temps_ecoule % 3600) / 60);
      sec = temps_ecoule % 60;

      // Afficher le temps écoulé
      elt.textContent = (hrs > 9 ? hrs : '0' + hrs) + ':' +
          (min > 9 ? min : '0' + min) + ':' +
          (sec > 9 ? sec : '0' + sec);

      // Répéter l'appel à startTimer() toutes les secondes
      t = setTimeout(startTimer, 1000);
  }

  startTimer();
  document.getElementById('contenerMinuteur').style.display = 'block';

})();`




var c = "(function() {console.log('Ça marche')})();";
const buttonLancementRessource = document.querySelector('a[title="Lancer la ressource"]');
var id = buttonLancementRessource.id;
console.log("id",id);
var element = document.getElementById(id);

// Obtenez la valeur actuelle de l'attribut "onclick"
var currentOnclick = element.getAttribute("onclick");
// Ajoutez "timeT();" à la fin de l'attribut "onclick"
element.setAttribute("onclick", f +  currentOnclick);









//------------ création des élément sur la page ------------



document.body.innerHTML += `
<div class="contener_principal" id="contener_principal" style="display:none">

<div class="accueil" id="accueil">
    <button id="openWidgetbutton">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256"
            width="32px" height="32px">
            <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                font-family="none" font-weight="none" font-size="none" text-anchor="none"
                style="mix-blend-mode: normal">
                <g transform="scale(5.33333,5.33333)">
                    <path
                        d="M40.96094,4.98047c-0.07387,0.00243 -0.14755,0.00895 -0.2207,0.01953h-12.74023c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h8.17188l-13.58594,13.58594c-0.52248,0.50163 -0.73295,1.24653 -0.55024,1.94742c0.18271,0.70088 0.73006,1.24823 1.43094,1.43094c0.70088,0.18271 1.44578,-0.02776 1.94742,-0.55024l13.58594,-13.58594v8.17188c-0.0102,0.72127 0.36875,1.39216 0.99175,1.75578c0.623,0.36361 1.39351,0.36361 2.01651,0c0.623,-0.36361 1.00195,-1.0345 0.99175,-1.75578v-12.75391c0.0781,-0.58158 -0.10312,-1.16812 -0.49567,-1.60429c-0.39255,-0.43617 -0.95683,-0.67796 -1.5434,-0.66133zM12.5,8c-4.11731,0 -7.5,3.38269 -7.5,7.5v20c0,4.11731 3.38269,7.5 7.5,7.5h20c4.11731,0 7.5,-3.38269 7.5,-7.5v-9.5c0.0102,-0.72127 -0.36875,-1.39216 -0.99175,-1.75578c-0.623,-0.36361 -1.39351,-0.36361 -2.01651,0c-0.623,0.36361 -1.00195,1.0345 -0.99175,1.75578v9.5c0,1.94669 -1.55331,3.5 -3.5,3.5h-20c-1.94669,0 -3.5,-1.55331 -3.5,-3.5v-20c0,-1.94669 1.55331,-3.5 3.5,-3.5h9.5c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175z">
                    </path>
                </g>
            </g>
        </svg>
    </button>
    <h2 class="title" id="titreWidget">UniTools</h2>
    <div class="contener_buttonLink">
        <button class="buttonOpenLink" id="openResourceButton">Ouvrir la ressource</button>
        <button class="buttonCopyLink" id="copyResourceButton">Copié la ressource</button>
    </div>


    <div class="contener_info_progres">
        <div class="cercles">
            <div id="cerclePourcent"></div>
            <div id="cercleCache"></div>
        </div>
        <div class="contener_stat">
            <span id="Nbjour"> </span>
            <div class="contener_heure">
                <span id="TimeWork">18h37</span><span>/</span><span id="nbHeureObj">05h</span>
            </div>
            <span id="pourcent">52%</span>
        </div>
    </div>


    <div class="contenerButtonClose">
        <button id="closeWidgetbutton">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32px" height="32px">
                <path
                    d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z" />
            </svg>
        </button>
    </div>
    <div class="contenerButtonSettings">
        <button id="openSettingsbutton">
            <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px"
                height="30px">
                <path
                    d="M 15 2 C 14.448 2 14 2.448 14 3 L 14 3.171875 C 14 3.649875 13.663406 4.0763437 13.191406 4.1523438 C 12.962406 4.1893437 12.735719 4.2322031 12.511719 4.2832031 C 12.047719 4.3892031 11.578484 4.1265 11.396484 3.6875 L 11.330078 3.53125 C 11.119078 3.02125 10.534437 2.7782344 10.023438 2.9902344 C 9.5134375 3.2012344 9.2704219 3.785875 9.4824219 4.296875 L 9.5488281 4.4570312 C 9.7328281 4.8970313 9.5856875 5.4179219 9.1796875 5.6699219 C 8.9836875 5.7919219 8.7924688 5.9197344 8.6054688 6.0527344 C 8.2174688 6.3297344 7.68075 6.2666875 7.34375 5.9296875 L 7.2226562 5.8085938 C 6.8316562 5.4175937 6.1985937 5.4175938 5.8085938 5.8085938 C 5.4185938 6.1995938 5.4185938 6.8326563 5.8085938 7.2226562 L 5.9296875 7.34375 C 6.2666875 7.68075 6.3297344 8.2164688 6.0527344 8.6054688 C 5.9197344 8.7924687 5.7919219 8.9836875 5.6699219 9.1796875 C 5.4179219 9.5856875 4.8960781 9.7337812 4.4550781 9.5507812 L 4.296875 9.484375 C 3.786875 9.273375 3.2002813 9.5153906 2.9882812 10.025391 C 2.7772813 10.535391 3.0192969 11.120031 3.5292969 11.332031 L 3.6855469 11.396484 C 4.1245469 11.578484 4.3892031 12.047719 4.2832031 12.511719 C 4.2322031 12.735719 4.1873906 12.962406 4.1503906 13.191406 C 4.0753906 13.662406 3.649875 14 3.171875 14 L 3 14 C 2.448 14 2 14.448 2 15 C 2 15.552 2.448 16 3 16 L 3.171875 16 C 3.649875 16 4.0763437 16.336594 4.1523438 16.808594 C 4.1893437 17.037594 4.2322031 17.264281 4.2832031 17.488281 C 4.3892031 17.952281 4.1265 18.421516 3.6875 18.603516 L 3.53125 18.669922 C 3.02125 18.880922 2.7782344 19.465563 2.9902344 19.976562 C 3.2012344 20.486563 3.785875 20.729578 4.296875 20.517578 L 4.4570312 20.451172 C 4.8980312 20.268172 5.418875 20.415312 5.671875 20.820312 C 5.793875 21.016313 5.9206875 21.208484 6.0546875 21.396484 C 6.3316875 21.784484 6.2686406 22.321203 5.9316406 22.658203 L 5.8085938 22.779297 C 5.4175937 23.170297 5.4175938 23.803359 5.8085938 24.193359 C 6.1995938 24.583359 6.8326562 24.584359 7.2226562 24.193359 L 7.3457031 24.072266 C 7.6827031 23.735266 8.2174688 23.670266 8.6054688 23.947266 C 8.7934688 24.081266 8.9856406 24.210031 9.1816406 24.332031 C 9.5866406 24.584031 9.7357344 25.105875 9.5527344 25.546875 L 9.4863281 25.705078 C 9.2753281 26.215078 9.5173438 26.801672 10.027344 27.013672 C 10.537344 27.224672 11.121984 26.982656 11.333984 26.472656 L 11.398438 26.316406 C 11.580438 25.877406 12.049672 25.61275 12.513672 25.71875 C 12.737672 25.76975 12.964359 25.814562 13.193359 25.851562 C 13.662359 25.924562 14 26.350125 14 26.828125 L 14 27 C 14 27.552 14.448 28 15 28 C 15.552 28 16 27.552 16 27 L 16 26.828125 C 16 26.350125 16.336594 25.923656 16.808594 25.847656 C 17.037594 25.810656 17.264281 25.767797 17.488281 25.716797 C 17.952281 25.610797 18.421516 25.8735 18.603516 26.3125 L 18.669922 26.46875 C 18.880922 26.97875 19.465563 27.221766 19.976562 27.009766 C 20.486563 26.798766 20.729578 26.214125 20.517578 25.703125 L 20.451172 25.542969 C 20.268172 25.101969 20.415312 24.581125 20.820312 24.328125 C 21.016313 24.206125 21.208484 24.079312 21.396484 23.945312 C 21.784484 23.668312 22.321203 23.731359 22.658203 24.068359 L 22.779297 24.191406 C 23.170297 24.582406 23.803359 24.582406 24.193359 24.191406 C 24.583359 23.800406 24.584359 23.167344 24.193359 22.777344 L 24.072266 22.654297 C 23.735266 22.317297 23.670266 21.782531 23.947266 21.394531 C 24.081266 21.206531 24.210031 21.014359 24.332031 20.818359 C 24.584031 20.413359 25.105875 20.264266 25.546875 20.447266 L 25.705078 20.513672 C 26.215078 20.724672 26.801672 20.482656 27.013672 19.972656 C 27.224672 19.462656 26.982656 18.878016 26.472656 18.666016 L 26.316406 18.601562 C 25.877406 18.419563 25.61275 17.950328 25.71875 17.486328 C 25.76975 17.262328 25.814562 17.035641 25.851562 16.806641 C 25.924562 16.337641 26.350125 16 26.828125 16 L 27 16 C 27.552 16 28 15.552 28 15 C 28 14.448 27.552 14 27 14 L 26.828125 14 C 26.350125 14 25.923656 13.663406 25.847656 13.191406 C 25.810656 12.962406 25.767797 12.735719 25.716797 12.511719 C 25.610797 12.047719 25.8735 11.578484 26.3125 11.396484 L 26.46875 11.330078 C 26.97875 11.119078 27.221766 10.534437 27.009766 10.023438 C 26.798766 9.5134375 26.214125 9.2704219 25.703125 9.4824219 L 25.542969 9.5488281 C 25.101969 9.7318281 24.581125 9.5846875 24.328125 9.1796875 C 24.206125 8.9836875 24.079312 8.7915156 23.945312 8.6035156 C 23.668312 8.2155156 23.731359 7.6787969 24.068359 7.3417969 L 24.191406 7.2207031 C 24.582406 6.8297031 24.582406 6.1966406 24.191406 5.8066406 C 23.800406 5.4156406 23.167344 5.4156406 22.777344 5.8066406 L 22.65625 5.9296875 C 22.31925 6.2666875 21.782531 6.3316875 21.394531 6.0546875 C 21.206531 5.9206875 21.014359 5.7919219 20.818359 5.6699219 C 20.413359 5.4179219 20.266219 4.8960781 20.449219 4.4550781 L 20.515625 4.296875 C 20.726625 3.786875 20.484609 3.2002812 19.974609 2.9882812 C 19.464609 2.7772813 18.879969 3.0192969 18.667969 3.5292969 L 18.601562 3.6855469 C 18.419563 4.1245469 17.950328 4.3892031 17.486328 4.2832031 C 17.262328 4.2322031 17.035641 4.1873906 16.806641 4.1503906 C 16.336641 4.0753906 16 3.649875 16 3.171875 L 16 3 C 16 2.448 15.552 2 15 2 z M 15 7 C 19.078645 7 22.438586 10.054876 22.931641 14 L 16.728516 14 A 2 2 0 0 0 15 13 A 2 2 0 0 0 14.998047 13 L 11.896484 7.625 C 12.850999 7.222729 13.899211 7 15 7 z M 10.169922 8.6328125 L 13.269531 14 A 2 2 0 0 0 13 15 A 2 2 0 0 0 13.269531 15.996094 L 10.167969 21.365234 C 8.2464258 19.903996 7 17.600071 7 15 C 7 12.398945 8.2471371 10.093961 10.169922 8.6328125 z M 16.730469 16 L 22.931641 16 C 22.438586 19.945124 19.078645 23 15 23 C 13.899211 23 12.850999 22.777271 11.896484 22.375 L 14.998047 17 A 2 2 0 0 0 15 17 A 2 2 0 0 0 16.730469 16 z" />
            </svg>
        </button>
    </div>
</div>
<div class="parametre" id="parametre">
    <h2 class="title">Paramètre</h2>

    <span id="titleChoixObjHeure">Votre objectif</span>
    <form>
        <select id="choixObjHeure">
            <option value="5">5 heures</option>
            <option value="10">10 heures</option>
            <option value="15">15 heures</option>
            <option value="20">20 heures</option>
        </select>
    </form>
    <span id="titleDateObj">Date de rendu</span>
    <input type="date" id="dateObj">

    <span id="titleSwitch">Widget fermé par defaut</span>
    <label class="switch">
        <input type="checkbox" id="widgetCloseByDefault">
        <span class="slider round"></span>
    </label>


    <div class="contenerButtonCloseSettings">
        <button id="closeSettingsbutton">Fermé</button>
    </div>
</div>



</div>
<div class="contenerMinuteur" id="contenerMinuteur">
<span>Temps passé sur la ressource</span>
<br>
<strong><time id="timeId">00:00:00</time></strong>
</div>


`;


document.getElementById("openResourceButton").addEventListener("click", function () {
  openRessource();
});

document.getElementById("copyResourceButton").addEventListener("click", function () {
  copyRessource();
});



document.getElementById("choixObjHeure").addEventListener("change", function () {
  setObjHeure();
});

document.getElementById("dateObj").addEventListener("change", function () {

  let date = document.getElementById("dateObj").value;
  if (testDate(date)) {
    setDate(date);
  }
  else {
    setDate(null);
    updateNbjour(null);
  }


});

