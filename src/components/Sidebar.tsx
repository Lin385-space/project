import { Note } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  StickyNote, 
  Star, 
  Trash2, 
  Settings as SettingsIcon, 
  Plus, 
  Hash,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewNote: () => void;
  onOpenSettings: () => void;
  notes: Note[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  onNewNote,
  onOpenSettings,
  notes,
  selectedTag,
  onSelectTag,
  searchQuery,
  onSearchChange
}: SidebarProps) {
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags))).sort();

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 0 }}
        className="h-full bg-muted/30 border-r flex flex-col overflow-hidden relative"
      >
        <div className="p-6 flex flex-col gap-8 w-[280px]">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[18px] tracking-[-0.02em] flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-[3px]" />
              ZenNote
            </h2>
          </div>

          <Button onClick={onNewNote} className="w-full gap-2 shadow-sm font-medium text-sm">
            <Plus className="h-4 w-4" /> 新建笔记
          </Button>
        </div>

        <ScrollArea className="flex-1 w-[280px]">
          <div className="px-4 py-2 space-y-6">
            <div className="space-y-1">
              <Button 
                variant={selectedTag === null ? 'secondary' : 'ghost'} 
                className="w-full justify-start gap-3 text-[14px] font-medium"
                onClick={() => onSelectTag(null)}
              >
                所有笔记
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-[14px] font-medium">
                收藏夹
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-[14px] font-medium">
                回收站
              </Button>
            </div>

            <Separator className="bg-muted-foreground/10" />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">标签</h3>
              <div className="space-y-1">
                {allTags.length > 0 ? (
                  allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-3 h-9"
                      onClick={() => onSelectTag(tag)}
                    >
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{tag}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {notes.filter(n => n.tags.includes(tag)).length}
                      </span>
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground px-2 italic">暂无标签</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t w-[280px]">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={onOpenSettings}>
            <SettingsIcon className="h-4 w-4" /> 设置
          </Button>
        </div>
      </motion.aside>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-[280px] top-4 z-50 h-8 w-8 rounded-full border bg-background shadow-sm -ml-4 hover:bg-accent transition-all"
        style={{ left: isOpen ? '280px' : '0px', marginLeft: isOpen ? '-16px' : '16px' }}
        onClick={onToggle}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </AnimatePresence>
  );
}
