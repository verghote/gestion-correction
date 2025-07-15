"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {retournerVersApresConfirmation, afficherToast, confirmer} from "/composant/fonction/afficher.js";
import { configurerFormulaire, donneesValides, effacerLesErreurs } from '/composant/fonction/controle';

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

/*global lesProjets, lesCompetences */

// récupération des éléments de l'interface
const idProjet = document.getElementById('idProjet');
const listeCompetence = document.getElementById('listeCompetence');
const btnMaj = document.getElementById('btnMaj');
const btnSupprimer = document.getElementById('btnSupprimer');

// récupération des éléments de l'interface d'ajout d'un projet
const frmAjout = document.getElementById('frmAjout');
const nom = document.getElementById('nom');
const btnAjouter = document.getElementById('btnAjouter');

// récupération des éléments de l'interface de modification d'un projet

const fm = new bootstrap.Modal(document.getElementById('frmMaj'));
const frmMaj = document.getElementById('frmMaj');
const nomMaj = document.getElementById('nomMaj');
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
        appelAjax({
            url: url,
            data: {
                idProjet: idProjet.value,
                idCompetence: id
            },
            success: data => {
                    afficherToast(data.success, 'success', 'top-right', 1000);
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
    appelAjax({
        url: 'ajax/getlescompetences.php',
        data: {
            idProjet: idProjet.value
        },
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
        }
    });
}

// ------------------------------------------------------
// Traitement concernant la suppression d'un projet
// ------------------------------------------------------

btnSupprimer.onclick = () => confirmer(supprimer);

function supprimer() {
    appelAjax({
        url: '/ajax/supprimer.php',
        data: {
            table : 'projet',
            id: idProjet.value
        },
        success: (data) => {
            // Recharger la page pour mettre à jour la liste des projets
            retournerVersApresConfirmation('Projet supprimé', '.');
        }
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

configurerFormulaire();

function ajouter() {
    appelAjax({
        url: '/ajax/ajouter.php',
        data: {
            table : 'projet',
            nom: nom.value
        },
        dataType: 'json',
        success: () => {
            nom.value = '';
            // Recharger la page pour mettre à jour la liste des projets
            retournerVersApresConfirmation('Projet ajouté', '.');
        }
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

configurerFormulaire();

function modifier() {
    appelAjax({
        url: '/ajax/modifiercolonne.php',
        data: {
            table : 'projet',
            id: idProjet.value,
            colonne: 'nom',
            valeur: nomMaj.value
        },
        success: () => {
                // mettre à jour le libellé affiché dans la zone de liste des projets (idProjet)
                idProjet.options[idProjet.selectedIndex].text = nomMaj.value;
                // fermer la fenêtre modale
                fm.hide();
                fm.toggle();
        }
    });
}