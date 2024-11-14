const App = {
  // les données de l'application
  _state: {
    debug: true, // afficher (ou pas) la bannière dans la console au démarrage
  },


  // les sélecteurs importants du DOM
  _dom: {
    go: document.querySelector("#go"),
  },

  
//  Initialisations
  coreInit() {
    this.HELPERS.log.call(this, "App is starting.");
    this.coreHandlers();
  },

  /**
   * Mise en place des gestionnaires d'ev.
   */
  coreHandlers() {
    this._dom.go.addEventListener("click", this.injectDatas.bind(this));
  },

  // les méthodes utilitaires regroupées dans la propriété HELPERS
  HELPERS: {
    /**
     * Afficher un message dans la console.
     * @param {string} message
     * @returns
     */
    log(message) {
      if (!this._state.debug) return;
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
   * Injecter les informations fictives.
   * Afficher le nom+prénom et l'email de 5 utilisateurs fictifs.
   */
  async injectDatas() {
    const html = this._state.fake
      .map(
        (user) => `
       <div class="user p-1 border" data-id="${user.id}">
        <h2 class="text-center">${user.last_name} ${user.first_name}</h2>
        <p class="text-end m-0">${user.email}</p>
       </div>`
      )
      .join("");
    this._dom.app.innerHTML = html;
    //  desactiver le bouton pour interdire le redéclenchement
    this._dom.go.setAttribute("disabled", true);
  },
};

// initialiser l'application quand le DOM est prêt
window.addEventListener("DOMContentLoaded", App.coreInit());