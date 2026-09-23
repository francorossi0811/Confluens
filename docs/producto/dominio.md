# Dominio — Confluens

Vocabulario, estados y reglas del negocio de Los Abuelos Servicios Gastronómicos.
Todo nombre de entidad, campo, enum y endpoint tiene que corresponderse con este archivo.

Fuentes: Plan de Proyecto, Seguimiento del Proyecto, Sprint 1 y máquina de estados (drawio),
todos aprobados por la cátedra.

---

## Estados

Los nombres de estos estados son los de la máquina de estados aprobada. **Se usan literalmente
como valores de enum en Prisma.** No inventar sinónimos ni traducir.

### Evento

```
Inicio ──primer contacto──> EnConsulta ──registrarPago()──> Reservado ──registrarPago()──> Cobrado
                                          [acumulado > 20%]              [acumulado = 100%]
```

| Estado | Significado |
|---|---|
| `EnConsulta` | Primer contacto. Hay cliente, fecha deseada y cantidad estimada. **No bloquea el salón.** |
| `Reservado` | Se acreditó más del 20% del total. El salón queda tomado en la agenda. |
| `Cobrado` | Los pagos acumulados cubren el 100% del total. |
| `Cancelado` | Salida posible desde `EnConsulta` y desde `Reservado`, vía `cancelar()`. |

Transición automática: un evento se cancela si no se registra la seña dentro del plazo (RN-06).

### Presupuesto

```
Estimado ──confirmar()──> Confirmado
    │
    ├──cancelar()──> Cancelado
    └──controlarVigencia()──> Expirado
```

| Estado | Significado |
|---|---|
| `Estimado` | Recién generado. Editable. |
| `Confirmado` | El cliente lo aceptó. Bloqueado para edición. Habilita la reserva del evento. |
| `Cancelado` | Dado de baja sin confirmarse. |
| `Expirado` | Perdió vigencia por el control automático de validez. |

---

## Entidades

**Salón.** Espacio físico del evento. Son cinco: Paraná, Iguazú, Pucará, Bariloche y Auditorio.
De ellos sale el nombre del producto. Tiene capacidad máxima, superficie y precio de referencia.
Capacidades y precios reales en `../negocio/tarifario-2026.md`.

**Distribución.** Forma de armado de un salón con su propia capacidad: conferencia, mesas de
trabajo, banquete. Nombre único por salón. Su capacidad nunca supera la del salón.

**Cliente.** Persona u organización que contrata. Mínimo: razón social o nombre, teléfono y
correo. Baja lógica por inactividad conservando el historial.

**Es usuario del sistema**: para acceder al formulario del canal público debe registrarse e
iniciar sesión. Decisión tomada sobre el cierre de la definición y **planificada para el Sprint 2**.
En el Sprint 1 el formulario opera sin autenticación y la ficha de cliente la crea el Responsable
de Eventos al tomar la solicitud.

**Solicitud.** Consulta de evento que llega por el canal público. Una vez implementado el acceso
con credenciales, llega ya asociada al cliente que la envió. El Responsable de Eventos la toma y
la convierte en un evento `EnConsulta`, o la descarta. Es una entidad distinta del evento: puede
descartarse sin convertirse en nada.

**Servicio.** Ítem del catálogo: nombre, descripción, unidad de medida y precio. Puede cobrarse
por persona y contratarse para una cantidad menor a la de asistentes.

**Servicio tercerizado.** Catering u otros provistos por un tercero. El cliente lo paga directo
al proveedor, por lo que **su precio no entra en el total del presupuesto**.

**Presupuesto.** Valorización del evento, detallada línea por línea, sin IVA. Al emitirse congela
los precios vigentes, aunque después cambie el catálogo.

**Evento.** Entidad central: cliente, salón, distribución, fecha, horario, cantidad de personas,
servicios, presupuesto y pagos.

**Pago.** Importe recibido con fecha y medio de pago. Monto libre, sin mínimo. Se registra sin IVA.

**Saldo.** Total acordado menos la suma de los pagos registrados.

**Medio de pago.** Efectivo, tarjeta, a la habitación.

**Auditoría.** Registro inmutable de usuario, fecha, entidad, valor anterior y valor nuevo.
Nadie lo edita ni lo borra. Se implementa con middleware de Prisma sobre `audit_log`.

**Solapamiento.** Dos eventos en el mismo salón, fecha y horario. Prohibido. Se valida en la
aplicación **y** con una restricción de exclusión de PostgreSQL usando `btree_gist` solamente 
cuando el estado del evento es Reservado.

**Comedor.** Servicio gastronómico del hotel, con sistema propio. Fuera de alcance (EXC-04).

---

## Roles

| Rol | Código | Alcance |
|---|---|---|
| Responsable de Eventos | `RE` | Consulta, presupuesto, agenda y reserva. Mayor uso diario. |
| Responsable de Finanzas | `RF` | Cobros, medios de pago, seguimiento de deuda. |
| Gerente General | `GG` | Reportes, usuarios, política de precios. Lectura de todo. Único que ve la auditoría. |
| Administrador del Sistema | `ADM` | Acceso completo: todo lo del Gerente General más el contenido público de la landing (qué salones se publican y qué fotos se muestran). |
| Sistema | `SYS` | Actor no humano: tareas programadas, cálculos, auditoría. |
| Cliente | `CLI` | Externo a la organización, con credenciales propias. Solo el canal público: envía solicitudes y consulta las suyas. Nunca accede al panel interno. Se implementa en el Sprint 2. |

---

## Reglas de negocio

| Código | Regla |
|---|---|
| RN-01 | La seña equivale al 20% del total del evento. |
| RN-02 | La prioridad entre clientes al reasignar salones la define la organización. |
| RN-03 | El precio informado es de referencia; el final se ajusta comercialmente y el ajuste queda auditado. |
| RN-04 | Los servicios no necesariamente cubren a todos los asistentes: pueden contratarse para menos. |
| RN-05 | **Todos los importes se registran sin IVA.** El impuesto se aplica recién al facturar. |
| RN-06 | La seña debe abonarse dentro de los 10 días posteriores a la confirmación. Vencido el plazo el evento pasa a `Cancelado`, el salón se libera y lo abonado no es reembolsable. |
| RN-07 | La cancelación por parte del cliente requiere un mínimo de 48 horas de anticipación. |
| RN-08 | Los presupuestos tienen una vigencia limitada; vencida, pasan a `Expirado` por control automático. |

---

## Decisiones que el agente NO puede tomar solo

- Agregar o renombrar un estado de evento o presupuesto.
- Cambiar el porcentaje de la seña, el plazo de 10 días o el de 48 horas.
- Definir qué pasa con lo abonado por encima de la seña ante una cancelación en plazo.
- Asumir un plazo concreto de vigencia del presupuesto (ver `pendientes.md`).
- Decidir cómo se da de alta un cliente en el canal público a partir del Sprint 2: autorregistro
  abierto, validación de correo, o aprobación previa del Responsable de Eventos.

Ante cualquiera de estas, parar y preguntar.
