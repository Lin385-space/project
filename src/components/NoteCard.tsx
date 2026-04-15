import { Note } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Trash2, Edit3, Calendar } from 'lucide-react';
import { Button } from './ui/button';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col group relative overflow-hidden border border-border shadow-none hover:bg-[#FAFAFF] hover:border-l-4 hover:border-l-primary transition-all duration-200 bg-white rounded-none p-0">
        <CardHeader className="p-6 pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-[15px] font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {note.title || '无标题笔记'}
            </CardTitle>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={() => onEdit(note)}
              >
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex-1 flex flex-col gap-4">
          <p className="text-[13px] text-muted-foreground line-clamp-3 leading-[1.5] flex-1">
            {note.content || '暂无内容...'}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground/60">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground mt-auto">
            <span>{formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
