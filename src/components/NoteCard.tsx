import React from 'react';
import type { Note } from '../types/note';
import { CalendarIcon, EditIcon, TrashIcon } from './Icons';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const COLOR_PRESETS = [
  {
    bg: 'bg-indigo-50/40 dark:bg-indigo-950/10',
    border:
      'border-indigo-100 dark:border-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-800',
    accent: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    tag: 'Work',
    glow: 'hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10',
  },
  {
    bg: 'bg-emerald-50/40 dark:bg-emerald-950/10',
    border:
      'border-emerald-100 dark:border-emerald-950 hover:border-emerald-300 dark:hover:border-emerald-800',
    accent: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    tag: 'Idea',
    glow: 'hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10',
  },
  {
    bg: 'bg-rose-50/40 dark:bg-rose-950/10',
    border: 'border-rose-100 dark:border-rose-950 hover:border-rose-300 dark:hover:border-rose-800',
    accent: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    tag: 'Todo',
    glow: 'hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10',
  },
  {
    bg: 'bg-amber-50/40 dark:bg-amber-950/10',
    border:
      'border-amber-100 dark:border-amber-950 hover:border-amber-300 dark:hover:border-amber-800',
    accent: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    tag: 'Study',
    glow: 'hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10',
  },
  {
    bg: 'bg-purple-50/40 dark:bg-purple-950/10',
    border:
      'border-purple-100 dark:border-purple-950 hover:border-purple-300 dark:hover:border-purple-800',
    accent: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    tag: 'Personal',
    glow: 'hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10',
  },
];

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const hashId = (value: string) => {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash;
  };

  // Select color preset based on note ID
  const preset = COLOR_PRESETS[hashId(note.id) % COLOR_PRESETS.length];

  // Helper to format the creation date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');

      return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
    } catch {
      return dateStr;
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${preset.bg} ${preset.border} ${preset.glow}`}
    >
      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-0 h-1.5 w-full ${preset.accent}`} />

      <div>
        {/* Header: Title and tag */}
        <div className='mb-3 flex items-start justify-between gap-4'>
          <h3 className='group-hover:text-primary line-clamp-2 text-lg leading-snug font-bold text-gray-800 transition-colors dark:text-gray-100'>
            {note.title || 'Untitled Note'}
          </h3>
          <span
            className={`inline-flex items-center rounded-full bg-white/40 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm dark:bg-black/20 ${preset.text}`}
          >
            {preset.tag}
          </span>
        </div>

        {/* Content Preview */}
        <p className='mb-6 line-clamp-5 text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300'>
          {note.content || (
            <span className='text-gray-400 italic dark:text-gray-500'>No content</span>
          )}
        </p>
      </div>

      {/* Footer: Date and Actions */}
      <div className='mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800/60'>
        <div className='flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500'>
          <CalendarIcon size={13} className='text-gray-400 dark:text-gray-500' />
          <span>{formatDate(note.createdAt)}</span>
        </div>

        {/* Actions panel */}
        <div className='flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100'>
          <button
            type='button'
            onClick={handleEditClick}
            className='rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-indigo-950/40'
            title='Edit note'
          >
            <EditIcon size={15} />
          </button>
          <button
            type='button'
            onClick={handleDeleteClick}
            className='rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40'
            title='Delete note'
          >
            <TrashIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
