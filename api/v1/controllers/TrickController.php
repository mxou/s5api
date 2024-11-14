<?php
require_once '../models/TrickModel.php';

class TrickController {
    private $TrickModel;

    public function __construct($pdo) {
        $this->trickModel = new TrickModel($pdo);  // Utilisation du modèle pour accéder à la base de données
    }

    // Récupérer tous les tricks
    public function getTricks() {
    return $this->trickModel->getTricks();  // Retourne simplement les résultats sans les afficher
    }


    // Récupérer tous les grinds
    public function getGrinds() {
       return $this->trickModel->getGrinds();
        // echo json_encode($grinds);  // Retourner les résultats en format JSON
    }

    // Récupérer tous les slides
    public function getSlides() {
        return $this->trickModel->getSlides();
        // echo json_encode($slides);  // Retourner les résultats en format JSON
    }

    // Ajouter un nouveau trick, grind ou slide
    public function addTrick($name, $description, $level, $category) {
        $result = $this->trickModel->addTrick($name, $description, $level, $category);
        echo json_encode(['success' => true, 'id' => $result]);
    }

    public function deleteTrick($id) {
    return $this->trickModel->deleteTrick($id);
}

}