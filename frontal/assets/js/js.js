const App = {
  // les données de l'application
  _state: {
    debug: true, // afficher (ou pas) la bannière dans la console au démarrage
  },

  // les sélecteurs importants du DOM
  _dom: {
    go: document.querySelector("#go"),
    app: document.querySelector("#app-content"),
    users_wrapper: document.createElement("div"), // Créer un wrapper pour les utilisateurs
  },

  /**
   * Initialisations.
   */
  coreInit() {
    this.HELPERS.log.call(this, "App is starting.");
    this._dom.users_wrapper.id = "users-wrapper"; // Attribuer un ID au wrapper
    this._dom.app.appendChild(this._dom.users_wrapper); // Ajouter le wrapper au DOM
    this.coreHandlers();
  },

  /**
   * Mise en place des gestionnaires d'événements.
   */
  coreHandlers() {
    this._dom.go.addEventListener("click", this.injectDatas.bind(this));
    this._dom.users_wrapper.addEventListener("click", this.operation.bind(this)); // Gestion des événements
  },

  // les méthodes utilitaires regroupées dans la propriété HELPERS
  HELPERS: {
    log(message) {
      if (!App._state.debug) return; // Utiliser App._state ici
      const CONSOLE_STYLE = "color: blue; font-size: 20px";
      const log_message = `
          ///////////////////////////////////////////
            ${message}
              (c) s5 MMI Angoulême 2024
          ///////////////////////////////////////////
        `;
      console.log(`%c${log_message}`, CONSOLE_STYLE);
    },
  },

  /**
   * Injecter les informations des utilisateurs depuis l'API.
   */
  async injectDatas(page = 1) {
  try {
    const response = await fetch(`https://reqres.in/api/users?page=${page}`);
    const data = await response.json();

    // Générer le HTML pour les utilisateurs avec images
    const html = data.data
      .map(
        (user) => `
       <div class="user p-1 border" data-id="${user.id}">
        <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}" class="user-avatar" />
        <h2 class="text-center">${user.last_name} ${user.first_name}</h2>
        <p class="text-end m-0">${user.email}</p>
        <div class="user--operations mt-1 bg-white text-center border-top">
          <button class="btn btn-link operation" data-operation="edit" data-id="${user.id}"><i class="bi bi-pencil"></i>éditer</button>
          <button class="btn btn-link operation" data-operation="delete" data-id="${user.id}"><i class="bi bi-trash3"></i>effacer</button>
        </div>
       </div>`
      )
      .join("");

    // Afficher les utilisateurs et les boutons de page
    this._dom.users_wrapper.innerHTML = html + this.generatePaginationButtons(data.total_pages);
    this._dom.go.setAttribute("disabled", true);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
  }
},


  /**
   * Générer les boutons de pagination en fonction du nombre total de pages.
   */
  generatePaginationButtons(totalPages) {
    let buttons = "";
    for (let i = 1; i <= totalPages; i++) {
      buttons += `
        <button class="btn btn-outline-dark operation mx-1 btn-sm" data-operation="page" data-page="${i}">
          ${i}
        </button>`;
    }
    return `<div class="choose-page m-1">${buttons}</div>`;
  },

  /**
   * Traitement des opérations ('edit', 'delete', 'page') sur les utilisateurs.
   * @param {Event} event
   */
  async operation(event) {
    const target = event.target.closest('.operation');
    if (!target) return;

    const operation = target.dataset.operation;
    const userId = target.dataset.id;

    switch (operation) {
      case 'edit':
        const newName = prompt("Entrez le nouveau nom pour l'utilisateur :", `${target.closest('.user').querySelector('h2').innerText}`);
        if (newName) {
          // Mettre à jour l'utilisateur via l'API (Simulation avec PUT)
          const response = await fetch(`https://reqres.in/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newName,
              job: 'updated', // Remplacer par des données appropriées si nécessaire
            }),
          });

          if (response.ok) {
            const updatedUser = await response.json();
            target.closest('.user').querySelector('h2').innerText = `${updatedUser.name}`; // Mettre à jour l'affichage
          } else {
            alert("Échec de l'édition de l'utilisateur.");
          }
        }
        break;

      case 'delete':
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userId}?`)) {
          // Supprimer l'utilisateur via l'API
          const deleteResponse = await fetch(`https://reqres.in/api/users/${userId}`, {
            method: 'DELETE',
          });

          if (deleteResponse.ok) {
            target.closest('.user').remove(); // Supprimer de l'interface
          } else {
            alert("Échec de la suppression de l'utilisateur.");
          }
        }
        break;

      case 'page':
        const page = target.dataset.page;
        this.injectDatas(page); // Récupérer les utilisateurs de la page spécifiée
        break;
    }
  },
};

// initialiser l'application quand le DOM est prêt
window.addEventListener("DOMContentLoaded", App.coreInit.bind(App));
