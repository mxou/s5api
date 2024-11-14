<?php
header("Content-Type: application/json");

// Inclure la base de données et les contrôleurs
require_once '../db/database.php';
require_once '../controllers/TrickController.php';

// Vérifier que la méthode HTTP est DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Extraire l'ID du trick à partir de l'URL
    parse_str($_SERVER['QUERY_STRING'], $queryParams);
    $trickId = isset($queryParams['id']) ? (int)$queryParams['id'] : null;

    if ($trickId) {
        // Initialiser la connexion PDO et le contrôleur
        $database = new Database();
        $pdo = $database->getPdo();
        $trickController = new TrickController($pdo);

        // Essayer de supprimer le trick
        $success = $trickController->deleteTrick($trickId);

        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Trick supprimé avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression du trick']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de trick manquant']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode HTTP non autorisée']);
}
?>