import type { UserInput } from '../types';

export async function createUser(userData: UserInput): Promise<any> {
  // Mock implementation - replace with real API call
  console.log('Creating user:', userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful response
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...userData,
    createdAt: new Date().toISOString(),
  };
}