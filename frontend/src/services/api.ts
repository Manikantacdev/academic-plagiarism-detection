// API Service for connecting frontend to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PlagiarismMatch {
    chunk_id: number;
    similarity_score: number;
    source_text: string;
    source_id: string;
    match_type: 'exact' | 'paraphrase' | 'semantic';
}

export interface TextChunk {
    text: string;
    chunk_id: number;
    start_pos: number;
    end_pos: number;
}

export interface PlagiarismResult {
    overall_score: number;
    ai_score: number;
    chunks: TextChunk[];
    matches: PlagiarismMatch[];
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    processing_time: number;
    timestamp: string;
}

export interface PlagiarismCheckResponse {
    success: boolean;
    result: PlagiarismResult | null;
    error?: string;
    highlights?: Record<number, { text: string; matches: PlagiarismMatch[] }>;
    stats?: {
        total_chunks: number;
        total_matches: number;
        database_size: number;
    };
}

export interface UploadResponse {
    success: boolean;
    filename: string;
    content_type: string;
    size: number;
    text: string;
    character_count: number;
    word_count: number;
}

export interface HealthResponse {
    status: string;
    model_loaded: boolean;
    index_ready: boolean;
    version: string;
}

export interface StatsResponse {
    success: boolean;
    stats: {
        total_documents: number;
        index_size: number;
    };
}

export interface AuthResponse {
    success: boolean;
    user: {
        name: string;
        email: string;
    };
    message: string;
}

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Health check
    async checkHealth(): Promise<HealthResponse> {
        const response = await fetch(`${this.baseUrl}/health`);
        if (!response.ok) {
            throw new Error('Backend service unavailable');
        }
        return response.json();
    }

    // Upload a file for text extraction
    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'File upload failed');
        }

        return response.json();
    }

    // Submit pasted text
    async submitText(text: string): Promise<UploadResponse> {
        const response = await fetch(`${this.baseUrl}/api/paste`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Text submission failed');
        }

        return response.json();
    }

    // Check text for plagiarism
    async checkPlagiarism(
        text: string,
        filename?: string,
        userEmail?: string,
        thresholdHigh: number = 0.85,
        thresholdMedium: number = 0.7
    ): Promise<PlagiarismCheckResponse> {
        const response = await fetch(`${this.baseUrl}/api/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                filename,
                user_email: userEmail,
                threshold_high: thresholdHigh,
                threshold_medium: thresholdMedium,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Plagiarism check failed');
        }

        return response.json();
    }

    // Get database statistics
    async getStats(userEmail?: string): Promise<StatsResponse> {
        const url = userEmail
            ? `${this.baseUrl}/api/stats?user_email=${encodeURIComponent(userEmail)}`
            : `${this.baseUrl}/api/stats`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        return response.json();
    }

    // Get user history
    async fetchHistory(userEmail: string): Promise<{ success: boolean; history: any[] }> {
        const response = await fetch(`${this.baseUrl}/api/history?user_email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        return response.json();
    }

    // Rebuild the search index
    async rebuildIndex(): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${this.baseUrl}/api/rebuild-index`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to rebuild index');
        }
        return response.json();
    }

    // AUTH: Register
    async register(name: string, email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }
        return response.json();
    }

    // AUTH: Login
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
        return response.json();
    }
}

// Export a singleton instance
export const api = new ApiService();
export default api;
