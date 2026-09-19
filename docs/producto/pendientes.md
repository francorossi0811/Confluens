# Pendientes de definición

Definiciones ausentes o contradictorias entre los documentos de origen. **El agente no las
resuelve por su cuenta**: si una tarea depende de alguno de estos puntos, parar y preguntar.

El Product Owner los valida con el cliente antes del sprint en que se aborda la historia afectada.

| ID | Tema | Situación | Bloquea |
|---|---|---|---|
| S-01 | Reintegro parcial | RN-06 dice que lo abonado no se reintegra cuando vence el plazo de la seña. No está definido qué pasa con lo abonado **por encima** de la seña si el cliente cancela dentro del plazo de 48 hs de RN-07. | HU-44 (S3) |
| S-02 | Alta de clientes en el canal público | A partir del Sprint 2 el cliente inicia sesión para acceder al formulario. Falta definir si el alta es autorregistro abierto, con validación de correo, o con aprobación del Responsable de Eventos. | Sprint 2 |
| S-03 | Inactividad de un cliente | RD-02.5 exige la baja por inactividad pero no define a partir de cuántos meses sin eventos se considera inactivo. | HU-08 (S6) |. RESOLUCION:  no hay baja por inactivadad.
| S-04 | Tipos de evento | RD-05.1 pide reporte de ingresos por tipo de evento, pero los tipos nunca fueron enumerados. Se asume tabla parametrizable. | HU-21 (S6) | RESOLUCION: los tipos son eventos sociales y eventos empresariales
| S-05 | Vencimiento del saldo | RD-06.1 exige alertar el próximo vencimiento, pero no está definida la fecha de vencimiento del saldo de un evento.A resolver con el cliente | HU-23 (S6) |
| S-06 | IVA | El tarifario del cliente se contradice: el pie dice "más IVA" y una condición de contratación dice que los valores lo incluyen. El sistema adopta registrar sin IVA (RN-05). | HU-09 (S1) |: RESOLUCION: se registra siempre sin IVA
| S-07 | Comandas y proveedores | Los procesos de comandas de cocina y de compras y proveedores están relevados en el Estudio Inicial pero no tienen Requerimiento Global. Quedan fuera del backlog por decisión del equipo. Incorporarlos exige actualizar antes el Plan de Proyecto. | — | RESOLUCION: fuera del alcance


## Resueltos

| ID | Tema | Resolución |
|---|---|---|
| — | Capacidades de los salones | Están en el tarifario vigente. Ver `../negocio/tarifario-2026.md`. |
| — | Vigencia del presupuesto | 30 días, según las condiciones de contratación del cliente (RN-08). |
| — | Plazo de la seña | 20% dentro de los 10 días de confirmado (RN-06), acordado en el refinamiento del Sprint 1. |
| — | Plazo de cancelación | 48 horas hábiles antes del evento (RN-07). |
| — | Login del cliente | Se implementa en el Sprint 2. El Sprint 1 va sin autenticación. |
