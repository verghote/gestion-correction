<?php
declare(strict_types=1);

// table club : id, nom, fichier

class Club extends Table
{
    public function __construct()
    {
        parent::__construct('club');

        // colonne id : clé primaire qui n'est pas auto-incrémentée
        $input = new inputText();
        $input->Require = true;
        $input->Pattern = "^[0-9]{6}$";
        $input->MaxLength = 6;
        $input->MinLength = 6;
        $this->columns['id'] = $input;

        // colonne nom
        // lettres en majuscule chiffre point espace
        // 60 caractères
        $input = new inputText();
        $input->Require = true;
        $input->Casse = 'U';
        $input->SupprimerAccent = true;
        $input->SupprimerEspaceSuperflu = true;
        $input->Pattern = "^[A-Z0-9]+([ .\-]?[A-Z0-9]+)*$";
        $input->MaxLength = 70;
        $this->columns['nom'] = $input;

        // définition des colonnes modifiables en mode colonne
        $this->listOfColumns->Values = ['nom'];

    }

    // ------------------------------------------------------------------------------------------------
    // Méthodes concernant les opérations de consultation
    // ------------------------------------------------------------------------------------------------


    /**
     * Retourner l'ensemble des clubs
     * Champs à retourner : id, nom, fichier, nb (nombre de licenciés dans le club)
     * @return array
     */
    public static function getAll(): array
    {
        $sql = <<<EOD
           SELECT id, nom, fichier, (select count(*) from coureur where coureur.idClub = club.id) as nb
           FROM club
           order by nom;
EOD;
        $db = Database::getInstance();
        $cmd = $db->query($sql);
        $lesLignes = $cmd->fetchAll(PDO::FETCH_ASSOC);
        $cmd->closeCursor();
        // ajout d'une colonne permettant de vérifier l'existence du logo
        $rep = RACINE . "/data/club";
        foreach ($lesLignes as &$ligne) {
            $ligne['present'] = isset($ligne['fichier']) && file_exists("$rep/{$ligne['fichier']}");
        }
        return $lesLignes;
    }

    /**
     * Retourner l'ensemble des clubs pour une liste déroulante (triée par nom) AYANT au moins un licencié
     * Champs à retourner : id, nom
     * @return array
     */
    public static function getListe(): array
    {
        $sql = <<<EOD
             SELECT id, nom 
             FROM club
             ORDER BY nom;
EOD;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * Retourner les informations sur un club
     * @param string $id
     * @return array | false
     */
    public static function getById(string $id): array | false
    {
        $sql = <<<EOD
             SELECT id, nom, fichier,  (select count(*) from coureur where coureur.idClub = club.id) as nb
             FROM club
             WHERE id = :id;
EOD;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }

}
