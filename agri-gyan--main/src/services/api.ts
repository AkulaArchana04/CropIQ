const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'agri_gyan_auth_token';

export interface ApiUser {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string | null;
  };
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  farm_size_hectares: number | null;
  primary_crops: string[];
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  name: string;
  scientific_name: string | null;
  category: string;
  growing_season: string[];
  min_temperature: number | null;
  max_temperature: number | null;
  water_requirement: string | null;
  soil_ph_min: number | null;
  soil_ph_max: number | null;
  growth_duration_days: number | null;
  image_url: string | null;
  created_at: string;
}

export interface CropRecommendation {
  id: string;
  user_id: string;
  location_lat: number | null;
  location_lng: number | null;
  soil_ph: number | null;
  soil_type: string | null;
  irrigation_available: boolean;
  previous_crop: string | null;
  recommended_crops: unknown;
  weather_data: unknown;
  market_data: unknown;
  created_at: string;
}

export interface DiseaseDetection {
  id: string;
  user_id: string;
  crop_name: string;
  image_url: string | null;
  detected_disease: string | null;
  disease_name?: string | null;
  confidence_score: number | null;
  treatment_recommendations: string[];
  treatment_suggestion?: string;
  severity: string | null;
  created_at: string;
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status);
  }

  return data as T;
}

export const api = {
  auth: {
    signUp: (email: string, password: string, full_name?: string) =>
      request<{ user: ApiUser; session: { access_token: string; user: ApiUser } }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
      }),

    signIn: (email: string, password: string) =>
      request<{ user: ApiUser; session: { access_token: string; user: ApiUser } }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    getSession: () =>
      request<{ session: { access_token: string; user: ApiUser } | null }>('/auth/session'),

    signOut: () => request<{ message: string }>('/auth/signout', { method: 'POST' }),
  },

  profiles: {
    get: () => request<Profile | null>('/profiles/me'),
    upsert: (profile: Partial<Profile>) =>
      request<Profile>('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(profile),
      }),
    getStats: () => request<{ recommendations: number; scans: number }>('/profiles/stats'),
  },

  crops: {
    list: () => request<Crop[]>('/crops'),
  },

  recommendations: {
    list: () => request<CropRecommendation[]>('/recommendations'),
    create: (data: Partial<CropRecommendation>) =>
      request<CropRecommendation>('/recommendations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  diseaseDetections: {
    list: (limit = 10) => request<DiseaseDetection[]>(`/disease-detections?limit=${limit}`),
    create: (data: Partial<DiseaseDetection>) =>
      request<DiseaseDetection>('/disease-detections', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
