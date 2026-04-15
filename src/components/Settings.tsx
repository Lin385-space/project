import { UserSettings } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import { Palette, Layout, Type, Moon, Sun, Monitor } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<UserSettings>) => void;
}

const ACCENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Slate', value: '#475569' },
];

export function Settings({ settings, isOpen, onClose, onUpdate }: SettingsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">设置</DialogTitle>
          <DialogDescription>
            个性化您的笔记体验。
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" /> 外观
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-2">
              <Layout className="h-4 w-4" /> 布局
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-3">
              <Label>主题</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => onUpdate({ theme: 'light' })}
                >
                  <Sun className="h-4 w-4" /> 浅色
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => onUpdate({ theme: 'dark' })}
                >
                  <Moon className="h-4 w-4" /> 深色
                </Button>
                <Button
                  variant={settings.theme === 'system' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => onUpdate({ theme: 'system' })}
                >
                  <Monitor className="h-4 w-4" /> 系统
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>强调色</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      settings.accentColor === color.value ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => onUpdate({ accentColor: color.value })}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>字体大小</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={settings.fontSize === size ? 'default' : 'outline'}
                    className="capitalize"
                    onClick={() => onUpdate({ fontSize: size })}
                  >
                    <Type className={`h-4 w-4 mr-2 ${size === 'small' ? 'scale-75' : size === 'large' ? 'scale-125' : ''}`} />
                    {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>侧边栏默认状态</Label>
                <p className="text-xs text-muted-foreground">默认保持侧边栏开启。</p>
              </div>
              <Switch
                checked={settings.sidebarOpen}
                onCheckedChange={(checked) => onUpdate({ sidebarOpen: checked })}
              />
            </div>

            <div className="space-y-3">
              <Label>笔记网格布局</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.layout === 'grid' ? 'default' : 'outline'}
                  onClick={() => onUpdate({ layout: 'grid' })}
                >
                  网格视图
                </Button>
                <Button
                  variant={settings.layout === 'list' ? 'default' : 'outline'}
                  onClick={() => onUpdate({ layout: 'list' })}
                >
                  列表视图
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>完成</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
