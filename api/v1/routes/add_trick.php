<?php
header("Content-Type: application/json");

// Inclure les fichiers nécessaires
require_once '../db/database.php';
require_once '../controllers/TrickController.php';

// Vérifier que la méthode HTTP est bien POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Lire les données JSON envoyées dans la requête
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Vérifier que les données nécessaires sont présentes
    $name = isset($inputData['name']) ? $inputData['name'] : null;
    $description = isset($inputData['description']) ? $inputData['description'] : null;
    $level = isset($inputData['level']) ? $inputData['level'] : null;
    $category = isset($inputData['category']) ? $inputData['category'] : null;

    // Vérifier si toutes les données sont présentes
    if ($name && $description && $level && $category) {
        // Initialiser la base de données et la connexion PDO
        $database = new Database();
        $pdo = $database->getPdo();

        // Initialiser le contrôleur
        $trickController = new TrickController($pdo);

        // Ajouter le trick, grind ou slide
        $result = $trickController->addTrick($name, $description, $level, $category);

        // Vérifier si le résultat est une erreur
        if (is_numeric($result)) {
            // Le trick a été ajouté avec succès, renvoyer l'ID du nouvel enregistrement
            echo json_encode(['success' => true, 'id' => $result], JSON_PRETTY_PRINT);
        } else {
            // Erreur de catégorie invalide
            echo json_encode(['success' => false, 'message' => $result], JSON_PRETTY_PRINT);
        }
    } else {
        // Si les données nécessaires ne sont pas présentes, renvoyer une erreur
        echo json_encode(['success' => false, 'message' => 'Données manquantes.'], JSON_PRETTY_PRINT);
    }
} else {
    // Si la méthode HTTP n'est pas POST, renvoyer une erreur
    echo json_encode(['success' => false, 'message' => 'Méthode HTTP non autorisée. Utilisez POST.'], JSON_PRETTY_PRINT);
}
?>