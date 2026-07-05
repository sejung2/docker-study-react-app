import type { CreateNoteDto, Note } from '../types/note';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const noteApi = {
  async getAll(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  },

  async getById(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    return response.json();
  },

  async create(data: CreateNoteDto): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  },

  async update(id: string, data: Partial<CreateNoteDto>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  },
};
