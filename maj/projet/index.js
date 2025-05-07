"use strict";

import {
    afficherErreur, afficherSucces,
    configurerFormulaire, confirmer,
    donneesValides,
    effacerLesErreurs,
    afficherDansConsole,
    genererMessage,
    retournerVersApresConfirmation
} from 'https://verghote.github.io/composant/fonction.js';

/*global lesProjets, lesCompetences */

// récupération des éléments de l'interface
const idProjet = document.getElementById('idProjet');
const listeCompetence = document.getElementById('listeCompetence');
const btnMaj = document.getElementById('btnMaj');
const btnSupprimer = document.getElementById('btnSupprimer');

// récupération des éléments de l'interface d'ajout d'un projet
const frmAjout = document.getElementById('frmAjout');
const nom = document.getElementById('nom');
const msgAjout = document.getElementById('msgAjout');
const btnAjouter = document.getElementById('btnAjouter');

// récupération des éléments de l'interface de modification d'un projet

const fm = new bootstrap.Modal(document.getElementById('frmMaj'));
const frmMaj = document.getElementById('frmMaj');
const nomMaj = document.getElementById('nomMaj');
const msg = document.getElementById('msg');
const btnModifier = document.getElementById('btnModifier');

// alimentation de la zone de liste des projets
for (const projet of lesProjets) {
    idProjet.add(new Option(projet.nom, projet.id));
}

// sur le changement de valeur sélectionnée dans la zone de liste, il faut récupérer les compétences associées au projet sélectionné
idProjet.onchange = chargerLesCompetencesDuProjet;

// alimenter la zone des compétences sous la forme de case à cocher
// afficher les compétences
for (const competence of lesCompetences) {
    const div = document.createElement('div');
    // important : il faut utiliser une variable locale dans le gestionnaire d'événement
    const id = competence.id;
    div.classList.add('d-flex', 'm-3');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.classList.add('form-check-input', 'my-auto', 'm-3');
    checkbox.style.width = '25px';
    checkbox.style.height = '25px';
    // le clic sur une case à cocher déclenche la mise à jour des competences du projet (ajout ou suppression)
    checkbox.onclick =  () => {
        const url = checkbox.checked ? 'ajax/ajoutercompetence.php' : 'ajax/supprimercompetence.php';
        $.ajax({
            url: url,
            method: 'POST',
            data: {
                idProjet: idProjet.value,
                idCompetence: id
            },
            dataType: 'json',
            success: data => {
                if (data.success) {
                    afficherSucces(data.success);
                }
            },
            error: reponse => {
                afficherErreur('Une erreur imprévue est survenue');
               afficherDansConsole(reponse.responseText);
            }
        });
    };
    div.appendChild(checkbox);
    const label = document.createElement('label');
    label.innerHTML = competence.libelle;
    label.classList.add('my-auto');
    div.appendChild(label);
    listeCompetence.appendChild(div);
}

chargerLesCompetencesDuProjet();

/**
 * Récupération des competences du projet sélectionné afin de cocher les bonnes cases
 */
function chargerLesCompetencesDuProjet() {
    $.ajax({
        url: 'ajax/getlescompetences.php',
        method: 'POST',
        data: {
            idProjet: idProjet.value
        },
        dataType: 'json',
        success: data => {
            // décocher les cases
            for(const checkbox of document.querySelectorAll('input[type="checkbox"]')) {
                checkbox.checked = false;
            }
            // mise à jour de l'interface en cochant les cases correspondant aux competences du projet
            for (const competence of data) {
                document.getElementById(competence.id).checked = true;
            }
            // window[competence.idCompetence].checked = true;
        },
        error: reponse => {
            afficherErreur('Une erreur imprévue est survenue');
           afficherDansConsole(reponse.responseText);
        }
    });
}

// ------------------------------------------------------
// Traitement concernant la suppression d'un projet
// ------------------------------------------------------

btnSupprimer.onclick = () => confirmer(supprimer);

function supprimer() {
    $.ajax({
        url: '/ajax/supprimer.php',
        method: 'POST',
        data: {
            table : 'projet',
            id: idProjet.value
        },
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                // Recharger la page pour mettre à jour la liste des projets
                retournerVersApresConfirmation('Projet supprimé', '.');
            } else {
                // une seule erreur renvoyée de type global ou system
                if (data.error.system) {
                    console.error(data.error.system);
                    afficherErreur('Une erreur innatendue est survenue lors de la suppression du projet');
                } else {
                    afficherErreur(genererMessage(data.error.global));
                }
            }
        },
        error: reponse => console.error(reponse.responseText)
    });
}

// ------------------------------------------------------
// Traitement concernant l'ajout d'un projet
// ------------------------------------------------------

// sur le clic du bouton ajouter, il faut ajouter le projet
//  La fonction donneesValides ne doit s'appliquer que sur la fenêtre modale (id='frmAjout'')
btnAjouter.onclick = () => {
    // vérification sur le champ nom
    if (donneesValides(frmAjout)) {
        ajouter();
    }
};

configurerFormulaire(true, frmAjout);

function ajouter() {
    $.ajax({
        url: '/ajax/ajouter.php',
        method: 'POST',
        data: {
            table : 'projet',
            nom: nom.value
        },
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                nom.value = '';
                // Recharger la page pour mettre à jour la liste des projets
                retournerVersApresConfirmation('Projet ajouté', '.');
            } else {
                // une seule erreur renvoyée de type global ou system
                if (data.error.system) {
                    console.error(data.error.system);
                    afficherErreur('Une erreur innatendue est survenue lors de l\'ajout du projet');
                } else {
                    msgAjout.innerHTML =  genererMessage(data.error.global);
                }
            }
        },
        error: reponse => console.error(reponse.responseText)
    });
}



// ------------------------------------------------------
// Traitement concernant la modification d'un projet
// ------------------------------------------------------

// ouverture de la fenêtre modale de modification
btnMaj.onclick = () => {
    // il faut alimenter le champ nomMaj avec le nom du projet sélectionné
    nomMaj.value = idProjet.options[idProjet.selectedIndex].text;
    // effacer les éventuels messages d'erreur
    effacerLesErreurs();
    // afficher la fenêtre modale
    fm.show();
};

// sur le clic du bouton ajouter, il faut ajouter le projet
//  La fonction donneesValides ne doit s'appliquer que sur la fenêtre modale (id='frmAjout'')
btnModifier.onclick = () => {
    // vérification sur le champ nom
    if (donneesValides(frmMaj)) {
        modifier();
    }
};

configurerFormulaire(true, frmMaj);

function modifier() {
    $.ajax({
        url: '/ajax/modifiercolonne.php',
        method: 'POST',
        data: {
            table : 'projet',
            id: idProjet.value,
            colonne: 'nom',
            valeur: nomMaj.value
        },
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                // mettre à jour le libellé affiché dans la zone de liste des projets (idProjet)
                idProjet.options[idProjet.selectedIndex].text = nomMaj.value;
                // fermer la fenêtre modale
                fm.hide();
                fm.toggle();
            } else {
                // une seule erreur renvoyée de type global ou system
                if (data.error.system) {
                    console.error(data.error.system);
                    afficherErreur('Une erreur innatendue est survenue lors de la modification du projet');
                } else {
                    msg.innerHTML =  genererMessage(data.error.global);
                }
            }
        },
        error: reponse => console.error(reponse.responseText)
    });
}