-- Se ejecuta solo la primera vez que se crea el volumen de datos.
-- btree_gist es necesaria para la restricción EXCLUDE de no solapamiento de reservas de salones.
CREATE EXTENSION IF NOT EXISTS btree_gist;
