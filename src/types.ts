export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  color?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  layout: 'grid' | 'list';
  sidebarOpen: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  accentColor: '#4F46E5', // Clean Minimalism accent
  fontSize: 'medium',
  layout: 'grid',
  sidebarOpen: true,
};
