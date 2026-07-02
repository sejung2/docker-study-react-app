import type { CreateWorkoutDto, UpdateWorkoutDto, WorkoutCheck } from '../types/workout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const workoutApi = {
  async getAll(): Promise<WorkoutCheck[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/workouts`);
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  },

  async create(data: CreateWorkoutDto): Promise<WorkoutCheck> {
    const response = await fetch(`${API_BASE_URL}/api/v1/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create workout');
    return response.json();
  },

  async update(id: number, data: UpdateWorkoutDto): Promise<WorkoutCheck> {
    const response = await fetch(`${API_BASE_URL}/api/v1/workouts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update workout');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/workouts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete workout');
  },
};
