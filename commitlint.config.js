/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // El scope es el ID de la historia de Jira en mayúsculas: feat(HU-12): ...
    'scope-case': [0],
    // Los mensajes van en español y pueden empezar con nombres propios (Neon, Prisma, etc.).
    'subject-case': [0],
  },
};
