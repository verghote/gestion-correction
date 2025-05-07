<?php
declare(strict_types=1);

// Classe gérant les données de la table annonce : id, nom, description, date, actif

class Annonce extends Table
{
    public function __construct()
    {
        parent::__construct('annonce');

        // nom
        $input = new inputText();
        $input->Require = true;
        $input->Pattern = "^[A-Za-zÀÇÈÉÊàáâçèéêëî]([ ']?[A-Za-zÀÇÈÉÊàáâçèéêëî]+)*$";
        $input->MinLength = 8;
        $input->MaxLength = 100;
        $this->columns['nom'] = $input;

        // la date ne doit pas être inférieure à la date du jour ni dépassé d'un an la date du jour
        $input = new InputDate();
        $input->Min = date('Y-m-d');
        $input->Max = date("Y-m-d", strtotime("+1 year"));
        $this->columns['date'] = $input;

        // description
        $input = new InputTextarea();
        $input->Require = true;
        $input->EncoderHtml = false;
        $input->AcceptHtml = true;
        $this->columns['description'] = $input;

        // actif  en ajout il prend sa valeur par défaut,
        $input = new InputInt();
        $input->Require = false;
        $input->Min = 0;
        $input->Max = 1;
        $this->columns['actif'] = $input;

        // Liste des colonnes modifiables en mode colonne
        $this->listOfColumns->Values = ['actif'];
    }

    // ------------------------------------------------------------------------------------------------
    // Méthodes statiques relatives aux opérations de consultation
    // ------------------------------------------------------------------------------------------------


    /**
     * retourne les annonces
     * @return array
     */
    public static function getAll() {
        $sql = <<<EOD
          Select id, nom, description, date, actif, date_format(date, '%d/%m/%Y') as dateFr
          from annonce 
          order by date;
EOD;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * Retourne l'annonce dont l'id est passé en paramètre
     *
     * @param int $id L'id doit être contrôlé en amont
     * @return mixed
     */
    public static function getById(int $id): mixed
    {
        $sql = <<<EOD
            SELECT id, nom, description, date
            FROM  annonce
            where id = :id;
EOD;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }

    /**
     * Suppression des ancinnes annonces : date dépassée
     * @return int nombre d'annonces supprimées
     */
    public static function deleteOld() : int {
        $sql = <<<EOD
	        delete from annonce 
	               where date <= curdate()
EOD;
        $db = Database::getInstance();
        return $db->exec($sql);
    }
}

