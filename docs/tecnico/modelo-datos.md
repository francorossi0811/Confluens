# Modelo de datos

Entidades y enums del sistema. **Los valores de los enums son los de la máquina de estados
aprobada** (ver `../producto/dominio.md`): no inventar sinónimos ni traducirlos.

Este archivo describe el modelo acordado. El `schema.prisma` es su implementación y se mergea a
main el primer día de cada sprint, antes de que nadie escriba un endpoint.

## Enums

```prisma
enum EstadoEvento {
  EnConsulta
  Reservado
  Cobrado
  Cancelado
}

enum EstadoPresupuesto {
  Estimado
  Confirmado
  Cancelado
  Expirado
}

enum Rol {
  RESPONSABLE_EVENTOS
  RESPONSABLE_FINANZAS
  GERENTE_GENERAL
  CLIENTE            // definido desde el Sprint 1, se activa en el Sprint 2
}
```

## Entidades

| Entidad | Notas |
|---|---|
| `Usuario` | Credenciales: email único, hash de contraseña, rol. **Separada de `Cliente`.** |
| `Cliente` | Datos comerciales: razón social o nombre, teléfono, correo, activo. Relación 1-1 opcional con `Usuario`. |
| `Salon` | Nombre, capacidad máxima, superficie, precio de referencia jornada completa y media jornada. |
| `Distribucion` | Pertenece a un salón. Nombre único por salón, capacidad ≤ capacidad del salón. |
| `Servicio` | Nombre único, descripción, unidad de medida, precio, si se cobra por persona, si es tercerizado, activo. |
| `Solicitud` | Llega del canal público. `clienteId` **nullable** desde el día 1. Guarda los datos de contacto que cargó el formulario. Puede descartarse sin convertirse en evento. |
| `Evento` | Cliente, salón, distribución, fecha, horario desde/hasta, cantidad de personas, estado, modalidad salón-restaurante. |
| `Presupuesto` | Pertenece a un evento. Estado, fecha de emisión, total. Un evento puede tener varios. |
| `LineaPresupuesto` | Servicio, cantidad, precio unitario congelado, subtotal. |
| `Pago` | Evento, fecha, monto, medio de pago. |
| `MedioPago` | Efectivo, tarjeta, a la habitación. Baja lógica. |
| `AuditLog` | Usuario, fecha, entidad, id, valor anterior, valor nuevo. Inmutable. |

## Por qué `Usuario` y `Cliente` van separados

El cliente es a la vez una entidad de negocio con historial comercial y, desde el Sprint 2, una
credencial. Si se unifican, cada cliente que el Responsable de Eventos carga a mano exige una
contraseña que nadie tiene. La relación es 1-1 opcional: hay clientes sin usuario, y el usuario
se crea recién cuando el cliente se registra en el canal público.

## No solapamiento de reservas

Un salón no puede tener dos eventos en la misma fecha y horario. Se valida en dos niveles:

1. En el servicio, para devolver un error legible que indique con qué evento se superpone.
2. En la base, con una restricción de exclusión que la aplicación no puede saltear:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Evento" ADD CONSTRAINT evento_sin_solapamiento
  EXCLUDE USING gist (
    "salonId" WITH =,
    tsrange("inicio", "fin") WITH &&
  ) WHERE (estado IN ('Reservado', 'Cobrado'));
```

El `WHERE` es importante: los eventos en `EnConsulta` **no** bloquean el salón, y los
`Cancelado` tampoco.

Prisma no genera restricciones de exclusión, así que va como SQL crudo dentro de una migración.

## Precios congelados

`LineaPresupuesto` guarda el precio unitario al momento de emitir, no una referencia al precio
actual del servicio. Es lo que permite que un incremento mensual no altere presupuestos ya
emitidos (RN-03, HU-34).

## Importes

Todos se almacenan **sin IVA** (RN-05). Usar `Decimal` de Prisma, nunca `Float`.
