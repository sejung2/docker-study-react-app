import { useEffect, useState } from 'react';
import { noteApi } from './api/notes.api';
import {
  FileTextIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
} from './components/Icons';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import type { CreateNoteDto, Note } from './types/note';
import { WorkoutWidget } from './components/WorkoutWidget';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme support
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load notes on mount / manual retry
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await noteApi.getAll();
      // Sort by newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setNotes(sorted);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Could not load notes. Please verify the backend service is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    noteApi
      .getAll()
      .then((data) => {
        if (!ignore) {
          const sorted = [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setNotes(sorted);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Error fetching notes on mount:', err);
          setError('Could not load notes. Please verify the backend service is running.');
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateClick = () => {
    setActiveNote(null);
    setIsEditorOpen(true);
  };

  const handleEditClick = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (dto: CreateNoteDto) => {
    if (activeNote) {
      // Update existing note
      const updated = await noteApi.update(activeNote.id, dto);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } else {
      // Create new note
      const created = await noteApi.create(dto);
      setNotes((prev) => [created, ...prev]);
    }
    setIsEditorOpen(false);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteApi.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note. Please try again.');
    }
  };

  // Filter notes by search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col font-sans antialiased transition-colors duration-300'>
      {/* Sleek Navigation Bar */}
      <header className='border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary text-primary-foreground shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-xl font-black shadow-lg'>
              M
            </div>
            <div>
              <h1 className='text-lg leading-none font-bold tracking-tight text-gray-900 dark:text-white'>
                SleekMemo
              </h1>
              <p className='mt-1 text-[11px] text-gray-500 dark:text-gray-400'>
                Your thoughts, organized
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className='border-border hover:bg-muted cursor-pointer rounded-xl border p-2.5 text-gray-500 transition-all active:scale-95 dark:text-gray-400'
              aria-label='Toggle dark mode'
            >
              {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Section */}
      <main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8'>
        <WorkoutWidget />
        {/* Statistics & Toolbar */}
        <section className='bg-card border-border flex flex-col justify-between gap-4 rounded-3xl border p-6 shadow-sm md:flex-row md:items-center'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-extrabold text-gray-900 dark:text-white'>
              Notes Dashboard
            </h2>
            <div className='flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400'>
              <FileTextIcon size={14} className='text-primary' />
              <span>
                {notes.length === 0
                  ? 'No notes stored yet'
                  : `${notes.length} note${notes.length > 1 ? 's' : ''} total`}
              </span>
            </div>
          </div>

          {/* Controls: Search and New Button */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='relative'>
              <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400'>
                <SearchIcon size={16} />
              </span>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search notes...'
                className='border-border bg-input-background focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm transition-all placeholder:text-gray-400 focus:ring-1 focus:outline-none sm:w-64'
              />
            </div>

            <button
              onClick={handleCreateClick}
              className='bg-primary text-primary-foreground shadow-primary/20 dark:shadow-primary/5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:opacity-95 active:scale-[0.98]'
            >
              <PlusIcon size={16} />
              <span>New Note</span>
            </button>
          </div>
        </section>

        {/* Content Area */}
        <section className='flex min-h-100 flex-1 flex-col'>
          {isLoading ? (
            /* Loading State */
            <div className='flex flex-1 flex-col items-center justify-center py-20'>
              <div className='relative flex items-center justify-center'>
                <div className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
              </div>
              <p className='mt-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                Syncing with memory database...
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className='mx-auto flex max-w-md flex-1 flex-col items-center justify-center py-16 text-center'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 dark:border-red-950 dark:bg-red-950/20 dark:text-red-400'>
                ⚠️
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Connection Error</h3>
              <p className='mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
                {error}
              </p>
              <button
                onClick={fetchNotes}
                className='border-border hover:bg-muted mt-5 cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition-colors'
              >
                Retry Connection
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            /* Empty State */
            <div className='border-border flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center'>
              <div className='bg-primary/5 text-primary mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl'>
                <SparklesIcon size={28} />
              </div>

              {searchQuery ? (
                <>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    No search matches
                  </h3>
                  <p className='mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400'>
                    We couldn't find any note matching "{searchQuery}". Try editing your query.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className='text-primary mt-4 cursor-pointer text-sm font-semibold hover:underline'
                  >
                    Clear search query
                  </button>
                </>
              ) : (
                <>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>No notes yet</h3>
                  <p className='mt-2 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
                    Create your first note to capture ideas, document guides, or plan tasks.
                  </p>
                  <button
                    onClick={handleCreateClick}
                    className='bg-primary/10 hover:bg-primary/20 text-primary mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors'
                  >
                    <PlusIcon size={14} />
                    <span>Create a note</span>
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Notes Grid Display */
            <div className='animate-fade-in grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Editor Modal overlay */}
      {isEditorOpen && (
        <NoteEditor
          key={activeNote ? `note-${activeNote.id}` : 'new-note'}
          note={activeNote}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveNote}
        />
      )}

      {/* Footer */}
      <footer className='border-border bg-card mt-12 border-t py-6'>
        <div className='mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-center text-xs text-gray-400 sm:flex-row dark:text-gray-500'>
          <p>© {new Date().getFullYear()} SleekMemo. All rights reserved.</p>
          <div className='flex justify-center gap-4'>
            <span className='flex items-center gap-1'>
              <span className='h-2 w-2 rounded-full bg-emerald-500' />
              Backend Connected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
