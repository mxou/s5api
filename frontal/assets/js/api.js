const App = {
  // L'état de l'application
  _state: {
    debug: true, // afficher ou non les messages de debug dans la console
    apiUrl: 'http://localhost/s5api/api/v1/routes/get_all_tricks.php', // URL de l'API
    currentPage: "home",  // home|categories|tricks
  },

  // Sélecteurs du DOM
  _dom: {
    loadTricksButton: document.querySelector("#load-tricks"),
    getCategButton: document.querySelector("#get_categ_button"),
    appContent: document.querySelector("#app-content"),
    title: document.querySelector("#title"),
    backButton: document.querySelector("#back_button"),
    addTricksButton: document.querySelector("#add_tricks_button"),
  },

  // Initialisations
  coreInit() {
    this.HELPERS.log.call(this, "App is starting.");
    this.coreHandlers();
  },

  // Mise en place des gestionnaires d'événements
  coreHandlers() {
    this._dom.loadTricksButton.addEventListener("click", this.fetchTricks.bind(this));
    this._dom.getCategButton.addEventListener("click", this.fetchCategories.bind(this));
    this._dom.backButton.addEventListener("click", () => {
      this.backButtonHandlers();
    });
    this._dom.addTricksButton.addEventListener("click", () => {
      this.addTricksForm();
    });
  },

    // Fonction pour gérer le bouton « Retour »
  backButtonHandlers() {
    if (this._state.currentPage === "tricks") {
      this.displayCategories(this._cachedCategories); // Revient aux catégories
    } else if (this._state.currentPage === "categories") {
      window.location.reload();

    }
  },

  // Les méthodes utilitaires regroupées dans HELPERS
  HELPERS: {
    log(message) {
      if (!this._state.debug) return;
      const CONSOLE_STYLE = "color: blue; font-size: 20px";
      console.log(`%c${message}`, CONSOLE_STYLE);
    },
  },

  // Récupérer les catégories depuis l'API et les afficher
  async fetchCategories() {
    try {
      const response = await fetch(this._state.apiUrl);
      const data = await response.json();
      console.log("Catégories de tricks:", data);
      this._cachedCategories = data;
      this.displayCategories(data);
    } catch (error) {
      this.HELPERS.log.call(this, "Erreur lors du chargement des catégories");
      console.error(error);
    }
  },

  // Récupérer les données depuis l'API et afficher les tricks
  async fetchTricks() {
    try {
      const response = await fetch(this._state.apiUrl);
      const data = await response.json();
      console.log("Réponse de l'API:", data);
      this.displayTricks(data);
    } catch (error) {
      this.HELPERS.log.call(this, "Erreur lors du chargement des tricks");
      console.error(error);
    }
  },


async deleteTrick(trickId) {
  try {
    const response = await fetch(`http://localhost/s5api/api/v1/routes/delete_trick.php?id=${trickId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      // Retirer l'élément du DOM si la suppression est réussie
      const trickElement = document.getElementById(`trick-${trickId}`);
      if (trickElement) {
        trickElement.remove();
        alert('Trick supprimé avec succès!');
      } else {
        console.error('Élément DOM non trouvé pour supprimer');
      }
    } else {
      alert(`Erreur: ${result.message}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    alert('Une erreur est survenue lors de la suppression.');
  }
},


// Initialisation des boutons de suppression dans le DOM
initializeDeleteButtons() {
  console.log("Initialisation des boutons de suppression");
  const deleteButtons = document.querySelectorAll('.delete_tricks_btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const trickId = e.target.getAttribute('data-id');
      console.log(`ID du trick à supprimer : ${trickId}`);
      this.deleteTrick(trickId);
    });
  });
},






  // Afficher les catégories (seulement les noms)
displayCategories(data) {
  let htmlCateg = `
    <h2>Catégories de Tricks</h2>
    <ul>
      ${Object.keys(data).map(category => `
        <li class="categorie" data-category="${category}">
          <img src="../assets/img/fornaite.jpg" alt="Image de ${category}">
          ${category.charAt(0).toUpperCase() + category.slice(1)}
        </li>
      `).join('')}
    </ul>
  `;
  this._dom.appContent.innerHTML = htmlCateg;
  this._dom.backButton.style.display = "block"; 
  this._state.currentPage = "categories";

  // Ajouter un gestionnaire d'événements à chaque catégorie
  document.querySelectorAll(".categorie").forEach(item => {
    item.addEventListener("click", (event) => {
      const selectedCategory = event.currentTarget.dataset.category;
      this.displayTricksByCategory(data[selectedCategory]);
    });
  });
},

// Fonction pour afficher les tricks d'une catégorie
displayTricksByCategory(tricks) {
  const htmlTricks = tricks.map(trick => `
      <div class="tricks" id="trick-${trick.id}" data-id="${trick.id}">
        <img src="../assets/img/fornaite.jpg" alt="Image de">
          <div>
            <h2 class="text-center">${trick.nom}</h2>
            <p class="text-end m-0">${trick.description}</p>
            <p class="text-end m-0">${trick.niveau}</p>
             <button class="delete_tricks_btn" data-id="${trick.id}">X</button>
          </div>
        </div>
  `).join("");

  this._dom.appContent.innerHTML = htmlTricks;
  this._dom.backButton.style.display = "block"; 
  this._dom.addTricksButton.style.display = "block"; 
  this._state.currentPage = "tricks";
  
  this.initializeDeleteButtons(); 
},


async handleAddTrick(event) {
  event.preventDefault(); // Empêche la soumission du formulaire par défaut

  // Récupérer les valeurs du formulaire
  const name = document.getElementById("trick_name").value;
  const description = document.getElementById("trick_description").value;
  const level = document.getElementById("trick_level").value;

  // Récupérer la catégorie choisie par l'utilisateur
  const category = document.querySelector('input[name="category"]:checked').value;

  // Données à envoyer au serveur
  const trickData = {
    name,
    description,
    level,
    category
  };

  try {
    // Appel AJAX avec fetch (en utilisant await)
    const response = await fetch('http://localhost/s5api/api/v1/routes/add_trick.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trickData),
    });

    // Vérifier si la réponse est au format JSON
    const textResponse = await response.text();  // Lire la réponse en tant que texte brut

    // Vérifier si la réponse est valide (bien du JSON)
    try {
      const responseData = JSON.parse(textResponse);  // Tenter de convertir en JSON
      console.log('Réponse du serveur:', responseData);
      
      if (responseData.success) {
        // Si l'ajout est réussi
        alert('Trick ajouté avec succès!');
      } else {
        // Si l'ajout échoue
        alert(`Erreur: ${responseData.message}`);
      }
    } catch (jsonError) {
      // console.error('Erreur lors du traitement de la réponse JSON:', jsonError, 'Réponse du serveur (texte brut):', textResponse)
      // Si la conversion JSON échoue, il y a un problème avec la réponse du serveur
      let htmlAddTrickResponse = `<h1>${name} ajouté avec succès</h1>`;
      this._dom.appContent.innerHTML = htmlAddTrickResponse;
      setTimeout(() => {
      window.location.reload();
      }, "2000");
         }
  } catch (error) {
    // Gérer les erreurs de l'appel AJAX
    console.error('Erreur:', error);
  }
},




addTricksForm() {
  const htmlAddTricksForm = `
    <form action="" id="add_tricks_form" enctype="multipart/form-data">
      <label for="trick_name">Nom du trick :</label>
      <input type="text" name="name" id="trick_name" placeholder="Nom du trick" maxlength="20" autocapitalize="on" required />

      <label for="trick_description">Description :</label>
      <input type="text" name="description" id="trick_description" placeholder="Description..." maxlength="80" autocapitalize="on" required />

      <label for="trick_level">Niveau :</label>
      <select name="level" id="trick_level" required>
        <option value="beginner">Débutant</option>
        <option value="intermediate">Intermédiaire</option>
        <option value="advanced">Avancé</option>
      </select>

      <label for="category_tricks">
        <input type="radio" name="category" value="tricks" id="category_tricks" required /> Tricks
      </label>
      <label for="category_grinds">
        <input type="radio" name="category" value="grinds" id="category_grinds" required /> Grinds
      </label>
      <label for="category_slides">
        <input type="radio" name="category" value="slides" id="category_slides" required /> Slides
      </label>

      <button type="submit">Ajouter</button>
    </form>`;

  this._dom.appContent.innerHTML = htmlAddTricksForm;

  // Gestionnaire d'événement pour la soumission
  document.getElementById("add_tricks_form").addEventListener("submit", this.handleAddTrick.bind(this));
},






  // Afficher les tricks dans le DOM
  displayTricks(data) {
  if (!data) {
    console.error('Erreur: Données des tricks non disponibles.');
    return;
  }

  // Affichage des tricks
  const htmlTricks = data.tricks?.map(trick => `
    <div class="trick p-2 border" data-id="${trick.id}">
      <img src="../assets/img/fornaite.jpg" alt="Image de ${trick.nom}">
      <div>
        <h2 class="text-center">${trick.nom}</h2>
        <p class="text-end m-0">${trick.description}</p>
        <p class="text-end m-0">${trick.niveau}</p>
      </div>
    </div>
  `).join("") || '';

  // Affichage des grinds
  const htmlGrinds = data.grinds?.map(grind => `
    <div class="grind p-2 border" data-id="${grind.id}">
      <h2 class="text-center">${grind.nom}</h2>
      <p class="text-end m-0">${grind.description}</p>
      <p class="text-end m-0">${grind.niveau}</p>
    </div>
  `).join("") || '';

  // Affichage des slides
  const htmlSlides = data.slides?.map(slide => `
    <div class="slide p-2 border" data-id="${slide.id}">
      <h2 class="text-center">${slide.nom}</h2>
      <p class="text-end m-0">${slide.description}</p>
      <p class="text-end m-0">${slide.niveau}</p>
    </div>
  `).join("") || '';

  this._dom.appContent.innerHTML = `
    <h2>Tricks</h2>${htmlTricks}
    <h2>Grinds</h2>${htmlGrinds}
    <h2>Slides</h2>${htmlSlides}
  `;
}
};


// Initialiser l'application quand le DOM est prêt
window.addEventListener("DOMContentLoaded", App.coreInit.bind(App));
