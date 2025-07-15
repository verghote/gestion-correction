<?php
declare(strict_types=1);

// table club : id, nom, fichier

class Club extends Table
{

    /**
     * Configuration intégrée pour l'upload des logos.
     */
    private const CONFIG = [
        'repertoire' => '/data/club/',
        'extensions' => ["jpg", "png"],
        'types' => ["image/pjpeg", "image/jpeg", "x-png", "image/png"],
        'maxSize' => 150 * 1024,
        'require' => false,
        'rename' => true,
        'sansAccent' => true,
        'redimensionner' => false,
        'height' => 500,
        'width' => 500,
        'accept' => '.jpg, .png',
    ];

    private const DIR = RACINE . self::CONFIG['repertoire'];

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

        // colonne fichier : un enregistrement est associé à un fichier image (logo du club)
        $input = new InputFileImg(self::CONFIG);
        $input->Directory = self::DIR;
        $input->Require = false; // le logo n'est pas obligatoire
        $this->columns['fichier'] = $input;

        // définition des colonnes modifiables en mode colonne
        $this->listOfColumns->Values = ['nom'];
    }

    // ------------------------------------------------------------------------------------------------
    // Méthodes concernant les opérations de consultation
    // ------------------------------------------------------------------------------------------------

    /**
     * Renvoie la configuration du logo des partenaires
     * @return array<string, mixed>
     */
    public static function getConfig(): array
    {
        return self::CONFIG;
    }

    /**
     * Retourner l'ensemble des clubs
     * Champs à retourner : id, nom, fichier, nb (nombre de licenciés dans le club)
     * @return array
     */
    public static function getAll(): array
    {
        $sql = <<<SQL
           select id, nom, fichier, (select count(*) from coureur where coureur.idClub = club.id) as nb
           from club
           order by nom;
SQL;
        $select = new Select();
        $lesLignes = $select->getRows($sql);

        // ajout d'une colonne permettant de vérifier l'existence du logo
        foreach ($lesLignes as &$ligne) {
            $ligne['present'] = isset($ligne['fichier']) && is_file(self::DIR . $ligne['fichier']);
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
        $sql = <<<SQL
           select id, nom, (select count(*) from coureur where coureur.idClub = club.id) as nb
           from club
           order by nom;
SQL;
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
        $sql = <<<SQL
             select id, nom, fichier,  (select count(*) from coureur where coureur.idClub = club.id) as nb
             from club
             where id = :id;
SQL;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }

}
