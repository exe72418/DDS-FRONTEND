// Importar comandos globales
import './commands';

// Importar la función 'mount' específica para Angular
import { mount } from 'cypress/angular';

// Declarar tipos globales para que TypeScript no se queje
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

// Inicializar el comando
Cypress.Commands.add('mount', mount);