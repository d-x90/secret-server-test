import { Secret } from './secretSlice';
import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000',
});

export interface CreateSecretDto {
  secret: string;
  expireAfterViews: number;
  expireAfter: number;
}

export async function fetchSecret(hash: string): Promise<Secret> {
  const response = await httpClient.get<Secret>(`/api/secret/${hash}`);
  return response.data;
}

export async function createSecret(
  createSecretDto: CreateSecretDto
): Promise<Secret> {
  const response = await httpClient.post<Secret>(
    '/api/secret',
    createSecretDto
  );

  return response.data;
}
