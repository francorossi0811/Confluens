-- No solapamiento de reservas (docs/tecnico/modelo-datos.md). Prisma no genera restricciones de
-- exclusión ni CHECK, así que van como SQL crudo. No editar esta migración una vez aplicada.

-- La habilita también 20260913000000_habilitar_btree_gist; se repite para que esta migración
-- sea autocontenida.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- inicio y fin son opcionales mientras el evento está EnConsulta (y si se cancela desde ahí).
-- En cualquier otro estado son obligatorios: un tsrange con límites NULL es infinito y la
-- restricción de exclusión bloquearía el salón para siempre.
ALTER TABLE "Evento" ADD CONSTRAINT evento_horario_obligatorio
  CHECK (estado IN ('EnConsulta', 'Cancelado') OR ("inicio" IS NOT NULL AND "fin" IS NOT NULL));

-- Un salón no puede tener dos eventos Reservado o Cobrado con horarios superpuestos.
-- EnConsulta y Cancelado no bloquean el salón.
ALTER TABLE "Evento" ADD CONSTRAINT evento_sin_solapamiento
  EXCLUDE USING gist (
    "salonId" WITH =,
    tsrange("inicio", "fin") WITH &&
  ) WHERE (estado IN ('Reservado', 'Cobrado'));
