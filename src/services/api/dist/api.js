"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiService = void 0;
class ApiService {
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    }
    async request(endpoint, options) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    error: data.error || 'An error occurred',
                };
            }
            return { data };
        }
        catch (error) {
            return {
                error: error instanceof Error ? error.message : 'An error occurred',
            };
        }
    }
    async get(endpoint, options) {
        return this.request(endpoint, { method: 'GET', ...options });
    }
    async post(endpoint, body, options) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            ...options,
        });
    }
    async put(endpoint, body, options) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...options,
        });
    }
    async delete(endpoint, options) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
}
exports.apiService = new ApiService();
