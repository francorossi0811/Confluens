-- Habilita btree_gist, necesaria para la restricción EXCLUDE que impide solapar reservas de un mismo salón.
-- Neon permite crear esta extensión sin privilegios de superusuario.
CREATE EXTENSION IF NOT EXISTS btree_gist;
