/**
 * Servicio WiFi para comunicación con ESP32
 * Version corregida - Sin timeout en fetch
 */

// Tipos
export type TipoComando = 'abrir' | 'cerrar' | 'dispensar' | 'estado' | 'test';

export interface ComandoPastillero {
  tipo: TipoComando;
  slot?: number;
}

/**
 * Clase principal para comunicación WiFi
 */
export class WifiDirectService {
  // Propiedades
  private _ip: string = '192.168.4.1';
  private _conectado: boolean = false;

  /**
   * Configurar dirección IP del ESP32
   */
  setIP(ip: string): void {
    this._ip = ip;
  }

  /**
   * Obtener IP actual
   */
  getIP(): string {
    return this._ip;
  }

  /**
   * Verificar si está conectado
   */
  isConectado(): boolean {
    return this._conectado;
  }

  /**
   * Método interno para peticiones HTTP con timeout manual
   */
  private async _hacerPeticion(endpoint: string): Promise<string | null> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const url = `http://${this._ip}${endpoint}`;
      
      // Configurar timeout de 5 segundos
      xhr.timeout = 5000;
      
      // Abrir conexión
      xhr.open('GET', url, true);
      
      // Configurar manejadores de eventos
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          console.warn(`HTTP ${xhr.status}: ${xhr.statusText}`);
          resolve(null);
        }
      };
      
      xhr.onerror = () => {
        console.warn(`Error de red: ${url}`);
        resolve(null);
      };
      
      xhr.ontimeout = () => {
        console.warn(`Timeout: ${url}`);
        resolve(null);
      };
      
      // Enviar petición
      xhr.send();
    });
  }

  /**
   * Conectar al pastillero
   */
  async conectar(): Promise<boolean> {
    try {
      console.log(`Conectando a: ${this._ip}`);
      const respuesta = await this._hacerPeticion('/estado');
      this._conectado = respuesta !== null;
      
      if (this._conectado) {
        console.log('✅ Conectado al pastillero');
      } else {
        console.log('❌ No se pudo conectar');
      }
      
      return this._conectado;
    } catch (error) {
      console.error('Error en conectar:', error);
      this._conectado = false;
      return false;
    }
  }

  /**
   * Abrir pastillero
   */
  async abrir(): Promise<boolean> {
    console.log('Enviando: ABRIR');
    const respuesta = await this._hacerPeticion('/abrir');
    return respuesta !== null;
  }

  /**
   * Cerrar pastillero
   */
  async cerrar(): Promise<boolean> {
    console.log('Enviando: CERRAR');
    const respuesta = await this._hacerPeticion('/cerrar');
    return respuesta !== null;
  }

  /**
   * Dispensar medicamento de un slot
   */
  async dispensar(slot: number): Promise<boolean> {
    console.log(`Enviando: DISPENSAR slot ${slot}`);
    const respuesta = await this._hacerPeticion(`/dispensar?slot=${slot}`);
    return respuesta !== null;
  }

  /**
   * Test de conexión
   */
  async test(): Promise<boolean> {
    console.log('Enviando: TEST');
    const respuesta = await this._hacerPeticion('/test');
    return respuesta !== null;
  }

  /**
   * Obtener estado actual
   */
  async obtenerEstado(): Promise<string> {
    const respuesta = await this._hacerPeticion('/estado');
    return respuesta || 'Desconectado';
  }
}

// Exportar instancia global
export const wifiDirectService = new WifiDirectService();