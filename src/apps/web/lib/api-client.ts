const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // If response is not JSON, use statusText
      }
      console.error(`GET ${endpoint} failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // If response is not JSON, use statusText
      }
      console.error(`POST ${endpoint} failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // If response is not JSON, use statusText
      }
      console.error(`PUT ${endpoint} failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // If response is not JSON, use statusText
      }
      console.error(`DELETE ${endpoint} failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

// Convenience methods for different resources
export const api = {
  users: {
    getAll: () => apiClient.get<any[]>('/api/users'),
    getById: (id: string) => apiClient.get<any>(`/api/users/${id}`),
    create: (data: any) => apiClient.post<any>('/api/users', data),
    update: (id: string, data: any) => apiClient.put<any>(`/api/users/${id}`, data),
    delete: (id: string) => apiClient.delete<any>(`/api/users/${id}`),
  },
  tests: {
    getAll: () => apiClient.get<any[]>('/api/tests'),
    getById: (id: string) => apiClient.get<any>(`/api/tests/${id}`),
    create: (data: any) => apiClient.post<any>('/api/tests', data),
    update: (id: string, data: any) => apiClient.put<any>(`/api/tests/${id}`, data),
    delete: (id: string) => apiClient.delete<any>(`/api/tests/${id}`),
  },
  trials: {
    getAll: () => apiClient.get<any[]>('/api/trials'),
    getById: (id: string) => apiClient.get<any>(`/api/trials/${id}`),
    create: (data: any) => apiClient.post<any>('/api/trials', data),
    update: (id: string, data: any) => apiClient.put<any>(`/api/trials/${id}`, data),
  },
  responses: {
    getAll: () => apiClient.get<any[]>('/api/responses'),
    getByTrial: (trialId: string) => apiClient.get<any[]>(`/api/responses?trialId=${trialId}`),
    create: (data: any) => apiClient.post<any>('/api/responses', data),
  },
  jobs: {
    scoreTest: (data: { trialId: string; userId: string }) => 
      apiClient.post<any>('/api/jobs/score-test', data),
    getStatus: (jobId: string) => apiClient.get<any>(`/api/jobs/status/${jobId}`),
  },
  health: {
    check: () => apiClient.get<any>('/health'),
    checkQueue: () => apiClient.get<any>('/health/queue'),
  },
  auth: {
    signup: (data: { name: string; email: string; password: string }) =>
      apiClient.post<any>('/api/auth/signup', data),
    login: (data: { email: string; password: string }) =>
      apiClient.post<any>('/api/auth/login', data),
  },
};
