import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // Configuração para arquivos JavaScript
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Define o tipo de módulo como CommonJS
      globals: {
        ...globals.browser, // Adiciona variáveis globais do ambiente do navegador
        ...globals.node, // Adiciona variáveis globais do ambiente Node.js
      },
    },
  },
  // Configuração padrão recomendada pelo plugin
  pluginJs.configs.recommended,
  // Regras personalizadas (adicionadas como exemplo)
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn"
    }
  },
];

