// lib/api/client.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // =================== MÉTODO PRINCIPAL ===================
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: {
      headers?: Record<string, string>;
      requiresAuth?: boolean;
    }
  ): Promise<T> {
    // Preparar headers
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...config?.headers,
    };

    // Configurar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include', // ✅ ÚNICO Y CRÍTICO: Envía cookies automáticamente
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Manejo de errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Error desconocido'
        }));

        const errorMessage = this.getErrorMessage(response.status, errorData);
        this.showToastError(errorMessage);

        // Redirigir a login si es 401
        if (response.status === 401 && typeof window !== 'undefined') {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?session=expired';
          }
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        this.showToastError('La solicitud tardó demasiado');
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        this.showToastError('Error de conexión con el servidor');
      }

      throw error;
    }
  }

  // =================== MANEJO DE ERRORES ===================
  private getErrorMessage(status: number, data: any): string {
    switch (status) {
      case 400:
        return data.message || 'Solicitud incorrecta';
      case 401:
        return 'No autorizado - Sesión expirada';
      case 403:
        return 'No tienes permisos para esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 422:
        return data.errors?.join(', ') || 'Datos inválidos';
      case 500:
        console.error('Server Error:', data);
        return 'Error interno del servidor';
      default:
        return data.message || `Error ${status}`;
    }
  }

  private showToastError(message: string): void {
    if (typeof window !== 'undefined') {
      console.error('API Error:', message);

      // Si tienes react-hot-toast, descomenta:
      // import('react-hot-toast').then(({ toast }) => toast.error(message));

      // Mostrar en consola para debugging
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ API Error: ${message}`);
      }
    }
  }

  // =================== MÉTODOS PÚBLICOS ===================
  async get<T>(
    url: string,
    config?: { headers?: Record<string, string>; requiresAuth?: boolean }
  ): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: { headers?: Record<string, string>; requiresAuth?: boolean }
  ): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(
    url: string,
    data: any,
    config?: { headers?: Record<string, string>; requiresAuth?: boolean }
  ): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(
    url: string,
    config?: { headers?: Record<string, string>; requiresAuth?: boolean }
  ): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // Método especial para subida de archivos (sin Content-Type: json)
  async upload<T>(
    url: string,
    formData: FormData,
    config?: { headers?: Record<string, string> }
  ): Promise<T> {
    const headers = {
      ...config?.headers,
      // NO incluir 'Content-Type': fetch lo establecerá automáticamente con boundary
    };

    return this.request<T>('POST', url, formData, { headers });
  }
}

// =================== INSTANCIA GLOBAL ===================
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
);

export default apiClient;