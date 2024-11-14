<?php
class CategoryController {
private $pdo;

public function __construct() {
$this->pdo = Database::getConnection();
}

public function addCategory($nom) {
$stmt = $this->pdo->prepare("INSERT INTO categories (nom) VALUES (:nom)");
$stmt->bindParam(':nom', $nom);
if ($stmt->execute()) {
return ['success' => 'Catégorie ajoutée avec succès'];
} else {
return ['error' => 'Erreur lors de l\'ajout de la catégorie'];
}
}
}