import { defineConfig } from "cypress";

export default defineConfig({
  // Mantenemos tu configuración global
  allowCypressEnv: false,

  e2e: {
    // Tu configuración E2E actual intacta
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  // AGREGAMOS ESTO PARA COMPONENT TESTING
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    // Le decimos que busque los tests unitarios en esta carpeta específica
    specPattern: "cypress/component/**/*.cy.ts", 
  },
});