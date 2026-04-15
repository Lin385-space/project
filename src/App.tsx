/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useNotes, useSettings } from './hooks';
import { Note } from './types';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, SearchX, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

export default function App() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { settings, updateSettings } = useSettings();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(settings.sidebarOpen);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTag && matchesSearch;
    });
  }, [notes, selectedTag, searchQuery]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      toast.success('笔记已更新');
    } else {
      addNote({
        title: noteData.title || '',
        content: noteData.content || '',
        tags: noteData.tags || [],
        color: noteData.color || '',
      });
      toast.success('笔记已创建');
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.error('笔记已删除', {
      action: {
        label: '撤销',
        onClick: () => {
          // Logic for undo could be added here if needed
          toast.info('此演示中未实现撤销功能');
        }
      }
    });
  };

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.fontSize];

  return (
    <div className={`flex h-screen w-full bg-background text-foreground overflow-hidden ${fontSizeClass}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewNote={handleCreateNote}
        onOpenSettings={() => setIsSettingsOpen(true)}
        notes={notes}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 flex flex-col min-w-0 relative bg-white">
        <header className="h-24 border-b flex items-center justify-between px-8 lg:px-[80px] bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <div className="text-[12px] text-muted-foreground font-medium mb-1">
              {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-[32px] font-bold tracking-[-0.03em]">
                {selectedTag ? `#${selectedTag}` : searchQuery ? `搜索: ${searchQuery}` : '所有笔记'}
              </h1>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {filteredNotes.length}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索笔记..."
                className="pl-9 bg-muted/30 border-none focus-visible:ring-1 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 border-border"
              onClick={handleCreateNote}
            >
              <Plus className="h-4 w-4" /> 新建笔记
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-[80px]">
          <AnimatePresence mode="popLayout">
            {filteredNotes.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-6 ${
                  settings.layout === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1 max-w-4xl mx-auto'
                }`}
              >
                {filteredNotes.map((note) => (
                  <div key={note.id}>
                    <NoteCard
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50"
              >
                <div className="p-6 rounded-full bg-muted">
                  <SearchX className="h-12 w-12" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">未找到笔记</h3>
                  <p className="text-sm text-muted-foreground">
                    尝试调整搜索条件或创建新笔记以开始。
                  </p>
                </div>
                <Button onClick={handleCreateNote} variant="secondary">
                  创建您的第一条笔记
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button for Mobile */}
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl sm:hidden"
          onClick={handleCreateNote}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </main>

      <NoteEditor
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
      />

      <Settings
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdate={updateSettings}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

