import { useState, useEffect } from 'react';
import { Note } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Plus, Palette } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface NoteEditorProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
}

const COLORS = [
  { name: 'Default', value: '' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

export function NoteEditor({ note, isOpen, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setColor(note.color || '');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setColor('');
    }
  }, [note, isOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    onSave({ title, content, tags, color });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-none shadow-2xl">
        <DialogHeader className="px-12 pt-12 pb-2">
          <div className="text-[12px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">
            {note ? `最后编辑于 ${new Date(note.updatedAt).toLocaleDateString('zh-CN')}` : '新草稿'}
          </div>
          <DialogTitle className="flex items-center justify-between">
            <Input
              placeholder="笔记标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[32px] font-bold tracking-[-0.03em] border-none px-0 h-auto focus-visible:ring-0 placeholder:opacity-30"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                  <Palette className="h-5 w-5" style={{ color: color || 'currentColor' }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="grid grid-cols-4 gap-1 p-2">
                {COLORS.map((c) => (
                  <DropdownMenuItem
                    key={c.name}
                    className="w-8 h-8 rounded-full p-0 flex items-center justify-center cursor-pointer border border-muted"
                    style={{ backgroundColor: c.value || 'transparent' }}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                  >
                    {!c.value && <X className="h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-12 space-y-6 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                #{tag}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeTag(tag)}
                />
              </span>
            ))}
            <div className="flex items-center gap-1">
              <Input
                placeholder="添加标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                className="h-7 w-24 text-[11px] border-none bg-muted/30 focus-visible:ring-0 font-bold uppercase tracking-wider"
              />
            </div>
          </div>

          <Textarea
            placeholder="开始写作..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none border-none px-0 focus-visible:ring-0 text-[16px] leading-[1.7] text-[#374151] placeholder:opacity-30"
          />
        </div>

        <DialogFooter className="px-12 py-8 border-t bg-muted/5">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">放弃</Button>
          <Button onClick={handleSave} disabled={!title && !content} className="bg-primary hover:bg-primary/90 px-8">
            保存笔记
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
