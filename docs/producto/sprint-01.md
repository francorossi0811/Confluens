# Sprint 1 — Confluens

**Del 09/09/2026 al 23/09/2026 · Scrum Master: Tomás Santillán · 6 historias · 25 puntos**

Objetivo: walking skeleton. Que un evento pueda recorrer el circuito completo de punta a punta
aunque cada paso sea mínimo, antes de profundizar en ninguna funcionalidad.

Los puntos por historia surgen del acta del Sprint Planning; HU-09 y HU-15 fueron re-estimadas
a la baja respecto del backlog general por abordarse con alcance acotado.

## Alcance

| HU | Título | Actor | Grupo sugerido |
|---|---|---|---|
| HU-27 | Autenticar a un usuario según su rol | RE | A |
| HU-01 | Consultar salones y su capacidad | RE | A |
| HU-32 | Registrar un servicio | RE | A |
| HU-14 | Registrar un evento en consulta | Cliente | B |
| HU-09 | Generar un presupuesto estimado | RE | B |
| HU-15 | Registrar la reserva de un evento | RE | B |

El corte entre grupos es por límite de módulo, no por capa. El grupo A se lleva accesos y
catálogo, el B el circuito del evento. B depende de las entidades de A: **el `schema.prisma`
del sprint y los tipos de `packages/shared` se mergean a main el día 1**, antes de que nadie
escriba un endpoint.

---

## HU-27 — Autenticar a un usuario según su rol

> Como Responsable de Eventos, quiero iniciar sesión con mi usuario y contraseña y acceder
> únicamente a lo que me corresponde, para que cada perfil vea la información de su incumbencia.

1. Con credenciales válidas accedo al sistema y veo el menú de mi rol.
2. Con contraseña incorrecta se deniega el acceso sin indicar cuál de los dos datos falló.
3. Siendo RE, el acceso a administración de usuarios y reportes de ingresos queda denegado.
4. Las contraseñas se almacenan cifradas, nunca en texto plano.
5. Al cerrar sesión o expirar por inactividad, hay que volver a autenticarse.

**Implementación.** JWT en cookie httpOnly, hash bcrypt. El enum de rol incluye `CLIENTE` desde
ahora aunque no se use en este sprint: se activa en el Sprint 2 y evita migrar la tabla después.

---

## HU-01 — Consultar salones y su capacidad

> Como Responsable de Eventos, quiero consultar el listado de salones con su capacidad,
> superficie y distribuciones posibles, para responderle al cliente qué salón se ajusta a su
> evento sin recurrir al PDF que se envía hoy por WhatsApp.

1. Veo los cinco salones con nombre, capacidad máxima y superficie.
2. Filtrando por capacidad mínima N, solo aparecen los salones que la cubren.
3. Al seleccionar un salón veo sus distribuciones con la capacidad de cada una.
4. Si ningún salón cubre la capacidad pedida, el sistema lo informa y sugiere la mayor disponible.

**Datos.** Capacidades, superficies y precios reales en `../negocio/tarifario-2026.md`. En este
sprint los salones se cargan por seed, no hay pantalla de alta (eso es HU-02, Sprint 4).

---

## HU-32 — Registrar un servicio

> Como Responsable de Eventos, quiero registrar los servicios que ofrece la organización con su
> precio, para incorporarlos a los presupuestos sin cargarlos manualmente cada vez.

1. Al registrar un servicio con nombre, descripción, unidad de medida y precio, queda disponible
   para seleccionar en un presupuesto.
2. Un servicio que se cobra por persona multiplica su precio por la cantidad indicada para ese
   servicio.
3. Puede contratarse para una cantidad menor a la del total de asistentes del evento (RN-04).
4. Un nombre de servicio ya existente se rechaza.

**Datos.** El catálogo real (coffee breaks, desayunos, degustación, lunch-cocktail,
almuerzo/cena) está en `../negocio/tarifario-2026.md` y sirve de seed.

---

## HU-14 — Registrar un evento en consulta

> Como Cliente, quiero registrar a través del formulario público la consulta de un evento con la
> fecha deseada y los datos preliminares, para consultar la disponibilidad, conocer las opciones
> de precios y servicios, y coordinar los detalles restantes.

1. Al completar el formulario con datos de contacto, fecha deseada y cantidad estimada de
   personas, se crea una solicitud y recibo confirmación de que fue enviada.
2. **En este sprint el formulario no requiere autenticación.** La ficha de cliente la crea el
   Responsable de Eventos al tomar la solicitud.
3. La solicitud no bloquea el salón: la fecha sigue figurando disponible.
4. El Responsable de Eventos ve la solicitud diferenciada visualmente de reservas y eventos.
5. Sin datos de contacto o sin fecha, la solicitud se rechaza indicando los campos obligatorios.

**Decidido.** El acceso con credenciales del Cliente se implementa en el **Sprint 2**. Para que
nada de esto se tire: `Solicitud` lleva `clienteId` nullable desde el día 1, el endpoint es
`POST /api/solicitudes` en ambos sprints y lo único que se agrega después es el middleware de
autenticación adelante. El formulario pide los datos de contacto igual; en el Sprint 2 se
prellenan desde la sesión.

**Pendiente antes de publicar.** Rate limit y honeypot: el formulario queda abierto sin login.

---

## HU-09 — Generar un presupuesto estimado

> Como Responsable de Eventos, quiero que el sistema genere automáticamente un presupuesto a
> partir del salón, la fecha, la cantidad de personas y los servicios seleccionados, para
> responderle al cliente en minutos en lugar de armar la planilla a mano.

1. El total se calcula sumando el precio del salón más cada servicio por su cantidad, con
   detalle línea por línea.
2. Un servicio contratado para menos personas que el total se calcula sobre esa cantidad.
3. **Todos los importes se expresan sin IVA** y esa condición se indica en el documento (RN-05).
4. **Los servicios de catering tercerizados no se incluyen en el total**, por estar a cargo del
   cliente frente al tercero.
5. Se toman los precios vigentes al mes de emisión.
6. El presupuesto nace en estado `Estimado`, editable y sin requerir pago previo.

---

## HU-15 — Registrar la reserva de un evento

> Como Responsable de Eventos, quiero registrar la reserva de un evento con salón, fecha,
> distribución, servicios y presupuesto asociado, para dejar formalmente tomado el compromiso
> con el cliente y bloquear el salón en la agenda.

1. Al registrar la reserva, el evento ocupa el salón en la agenda.
2. **Sin solapamiento**: si el salón ya tiene otro evento en esa fecha y horario, se rechaza
   informando con cuál se superpone.
3. Si la cantidad de personas supera la capacidad de la distribución, se advierte y se exige
   confirmación explícita.
4. **Confirmación por seña**: si no se registra el 20% del total dentro de los 10 días
   posteriores a la confirmación, el evento pasa a `Cancelado` y el salón se libera (RN-06).
5. **Cancelación**: solo se admite hasta 48 horas antes de la fecha del evento (RN-07).
6. Tres eventos el mismo sábado en salones distintos se aceptan sin conflicto.
7. La modalidad salón-restaurante se marca como opción interna, no visible al cliente.

**Implementación.** El no solapamiento se valida en la aplicación **y** con una restricción de
exclusión de PostgreSQL usando `btree_gist`. Ver `../tecnico/modelo-datos.md`.

---

## Definición de Terminado

Una historia está terminada cuando sus criterios pasan como tests automatizados, el código fue
revisado por otro integrante vía pull request, el CI corre sin errores, la funcionalidad está
desplegada y accesible, y las operaciones que modifican datos quedan auditadas.
