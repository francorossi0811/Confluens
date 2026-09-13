import { CODIGOS_ERROR, type CodigoError, type DetalleError } from '@confluens/shared';

/**
 * Error esperado de la API. Lanzarlo desde servicios o controladores:
 * el middleware manejadorErrores lo convierte en una RespuestaError.
 */
export class ErrorApi extends Error {
  readonly status: number;
  readonly codigo: CodigoError;
  readonly detalles?: DetalleError[];

  constructor(status: number, codigo: CodigoError, mensaje: string, detalles?: DetalleError[]) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
    this.codigo = codigo;
    this.detalles = detalles;
  }

  static noEncontrado(mensaje = 'Recurso no encontrado'): ErrorApi {
    return new ErrorApi(404, CODIGOS_ERROR.NO_ENCONTRADO, mensaje);
  }

  static conflicto(mensaje: string): ErrorApi {
    return new ErrorApi(409, CODIGOS_ERROR.CONFLICTO, mensaje);
  }

  static reglaNegocio(mensaje: string, detalles?: DetalleError[]): ErrorApi {
    return new ErrorApi(422, CODIGOS_ERROR.REGLA_NEGOCIO, mensaje, detalles);
  }
}
