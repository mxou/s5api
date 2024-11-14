<?php
class TrickModel {
    private $pdo;  // Instance PDO pour la connexion à la base de données

    // Le constructeur reçoit la connexion PDO
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Récupérer tous les tricks
    public function getTricks() {
        $stmt = $this->pdo->query("SELECT * FROM tricks");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);  // Retourner les résultats sous forme de tableau associatif
    }

    // Récupérer tous les grinds
    public function getGrinds() {
        $stmt = $this->pdo->query("SELECT * FROM grinds");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);  // Retourner les résultats sous forme de tableau associatif
    }

    // Récupérer tous les slides
    public function getSlides() {
        $stmt = $this->pdo->query("SELECT * FROM slides");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);  // Retourner les résultats sous forme de tableau associatif
    }

    // Ajouter un trick, grind ou slide
    public function addTrick($name, $description, $level, $category) {
        $validCategories = ['tricks', 'grinds', 'slides'];
        if (!in_array($category, $validCategories)) {
            return "Erreur : Catégorie invalide.";
        }

        // Préparer la requête pour ajouter un trick, grind ou slide
        $stmt = $this->pdo->prepare("INSERT INTO $category (nom, description, niveau) VALUES (:name, :description, :level)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':level', $level);

        // Exécuter la requête
        $stmt->execute();

        // Retourner l'ID du dernier enregistrement inséré
        return $this->pdo->lastInsertId();
    }

    public function deleteTrick($id) {
    $stmt = $this->pdo->prepare("DELETE FROM tricks WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    return $stmt->execute();
}

}