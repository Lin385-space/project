import { useState, useEffect } from 'react';
import { Note, UserSettings, DEFAULT_SETTINGS } from './types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('mindflow_notes');
    if (saved) return JSON.parse(saved);
    
    // Default welcome note
    const welcomeNote: Note = {
      id: 'welcome-note',
      title: '欢迎使用 ZenNote! 🚀',
      content: '这是您的第一条笔记。您可以编辑、删除它，或者创建新的笔记。\n\n尝试在“设置”菜单中个性化您的界面吧！',
      tags: ['欢迎', '教程'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: '#4F46E5'
    };
    return [welcomeNote];
  });

  useEffect(() => {
    localStorage.setItem('mindflow_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return { notes, addNote, updateNote, deleteNote };
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('mindflow_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('mindflow_settings', JSON.stringify(settings));
    
    // Apply theme
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    }

    // Apply accent color
    root.style.setProperty('--primary', settings.accentColor);
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return { settings, updateSettings };
}
