//------------ ouverture/fermeture paramètre ------------
//suite à des probleme d'annimation apres avoir ouvert/fermé les parametre puis fermé le widget
//cette fonction permet de resoudre le probleme en reinitialisant au valeur par défaut 
function resetStyleSettingsAnnim(){  // Réinitialisez les styles CSS à leur valeur par défaut
  document.getElementById('accueil').style.left = "";
  document.getElementById('parametre').style.width = "";
  document.getElementById('parametre').style.height = "";
  document.getElementById('parametre').style.opacity = "";
  }


function openSettings() {
    let i = 0;
    let j = 70;
    let opacity = 0;
    let x=0;
    function animate1() {
      if (i > -230) {
        x++;
        document.getElementById('accueil').style.left = i + "px";
        i -= 10;
        document.getElementById('parametre').style.width = j + "%";
        document.getElementById('parametre').style.height = j + "%";
        document.getElementById('parametre').style.opacity = opacity;
        opacity += 0.05;
        j += 1.2;
        requestAnimationFrame(animate1);
      }
    }
  
    animate1();
    
  }
  
  function closeSettings() {
    let i = -220;
    let j = 96.4;
    let opacity = 1;
  
    function animateClose() {
      if (i <= 0) {
        document.getElementById('accueil').style.left = i + "px";
        i += 10;
        document.getElementById('parametre').style.width = j + "%";
        document.getElementById('parametre').style.height = j + "%";
        document.getElementById('parametre').style.opacity = opacity;
        opacity -= 0.05;
        j -= 1;
        requestAnimationFrame(animateClose);
      } else {
        // Lorsque l'animation est terminée, réinitialisez les styles
        resetStyleSettingsAnnim();
      }
    }


    animateClose();
  }
  

//------------ ouverture/fermeture widget ------------

function closeWidget() {
  let hauteur = 280;
  let largeur = 220;
  let decaleTitre = 0;
  let hauteurTitre = 0;
  let posButtonOpen = -35;
  let opacityButtonOpen = 0;
  function animate() {
    if (hauteur > 35) {
      
      document.getElementById('contener_principal').style.height = hauteur + "px";
      hauteur -= 10;
      document.getElementById('contener_principal').style.width = largeur + "px";
      largeur -= 3;
      document.getElementById('titreWidget').style.paddingLeft = decaleTitre + "px";
      decaleTitre += 1.9;
      document.getElementById('titreWidget').style.top = hauteurTitre + "px";
      hauteurTitre -= 0.7;
      document.getElementById('openWidgetbutton').style.top = posButtonOpen + "px";
      posButtonOpen += 1.6;
      document.getElementById('openWidgetbutton').style.opacity = opacityButtonOpen;
      opacityButtonOpen += 0.04;
    } else {
      clearInterval(animationInterval); // Arrête l'animation lorsque la hauteur atteint 35px
    }
  }

  document.querySelector('.contenerButtonClose').style.display = "none";
  document.querySelector('.contenerButtonSettings').style.display = "none";

  const animationInterval = setInterval(animate, 9);
}

function openWidget() {
  let hauteur = 40;
  let largeur = 148;
  let decaleTitre = 45.6;
  let hauteurTitre = -16.8;
  let posButtonOpen = 3.4;
  let opacityButtonOpen = 1;

  function animateOpenWidget() {
    if (hauteur <= 280) {
      document.getElementById('contener_principal').style.height = hauteur + "px";
      hauteur += 10;
      document.getElementById('contener_principal').style.width = largeur + "px";
      largeur += 3;
      document.getElementById('titreWidget').style.paddingLeft = decaleTitre + "px";
      decaleTitre -= 1.9;
      document.getElementById('titreWidget').style.top = hauteurTitre + "px";
      hauteurTitre += 0.7;
      document.getElementById('openWidgetbutton').style.top = posButtonOpen + "px";
      posButtonOpen -= 1.6;
      document.getElementById('openWidgetbutton').style.opacity = opacityButtonOpen;
      opacityButtonOpen -= 0.02;

    } else {
      clearInterval(animationInterval); // Arrête l'animation lorsque la hauteur atteint 35px
    }
  }

  document.querySelector('.contenerButtonClose').style.display = "";
  document.querySelector('.contenerButtonSettings').style.display = "";

  const animationInterval = setInterval(animateOpenWidget, 9);
}

//fonction appelé au lancement de la page si l'utilisateur à demandé le widget fermé par defaut
function closeWidgetWithoutAnnim(){
  document.getElementById('contener_principal').style.height = "40px";
  document.getElementById('contener_principal').style.width = "148px";
  document.getElementById('titreWidget').style.paddingLeft ="45.6px";
  document.getElementById('titreWidget').style.top = "-16.8px";
  document.getElementById('openWidgetbutton').style.top = "3.6px";
  document.getElementById('openWidgetbutton').style.opacity = 1;
  document.querySelector('.contenerButtonClose').style.display = "none";
  document.querySelector('.contenerButtonSettings').style.display = "none";
  document.getElementById('contener_principal').style.display=""; //affiche le widget qui est masqué par defaut
}



/*-------------------------------------------------------------------------------------------- */
// Fonction pour définir la valeur de widgetCloseByDefault dans Chrome Storage
function setWidgetCloseByDefault(value) {
  chrome.storage.sync.set({ widgetCloseByDefault: value });
}

// Fonction pour obtenir la valeur de widgetCloseByDefault dans Chrome Storage
function getWidgetCloseByDefault(callback) {
  chrome.storage.sync.get(['widgetCloseByDefault'], function(result) {
    const value = result.widgetCloseByDefault;
    if (value === undefined) {
      // Si la valeur n'est pas définie, enregistrez "false" par défaut
      setWidgetCloseByDefault(false);
      callback(false);
    } else {
      callback(value);
    }
  });
}

// Fonction pour mettre à jour la case à cocher en fonction de la valeur de widgetCloseByDefault
function updateCheckbox() {
  const checkbox = document.getElementById('widgetCloseByDefault');
  getWidgetCloseByDefault(function(value) {
    checkbox.checked = value;
    if (value) {
      // Si la case est cochée, exécutez la fonction pour fermer sans annimation
      closeWidgetWithoutAnnim();
    }
    else{
      document.getElementById('contener_principal').style.display="";//afficher le widget qui est caché par defaut
    }
  });
}

// Écouteur d'événement pour la case à cocher
document.getElementById('widgetCloseByDefault').addEventListener('change', function() {
  const checkbox = this;
  setWidgetCloseByDefault(checkbox.checked);
});

// Appelez la fonction pour mettre à jour la case à cocher au chargement de la page
updateCheckbox();











/*-------------------------------------------------------------------------------------------- */

//ensemble des écouteur d'évenement sur les boutons 
  document.getElementById("openSettingsbutton").addEventListener("click", function() {
    openSettings();
  });
  document.getElementById("closeSettingsbutton").addEventListener("click", function() {
    closeSettings();

  });


  document.getElementById("closeWidgetbutton").addEventListener("click", function() {
    closeWidget();
  });


  document.getElementById("openWidgetbutton").addEventListener("click", function() {
    openWidget();
  });
