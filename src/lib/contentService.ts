import { ContentItem } from "@/data/mockData";

const STORAGE_KEY = "edusmart_content_items";

// Initialize localStorage with mock data if empty
export const initializeContentStorage = (mockData: ContentItem[]) => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
};

// Get all content items
export const getAllContent = (): ContentItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get content by ID
export const getContentById = (id: string): ContentItem | null => {
  const items = getAllContent();
  return items.find(item => item.id === id) || null;
};

// Add new content
export const addContent = (content: Omit<ContentItem, 'id' | 'updatedAt'>): ContentItem => {
  const items = getAllContent();
  const newContent: ContentItem = {
    ...content,
    id: `item-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  
  items.push(newContent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return newContent;
};

// Update content
export const updateContent = (id: string, updates: Partial<ContentItem>): ContentItem | null => {
  const items = getAllContent();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items[index];
};

// Delete content
export const deleteContent = (id: string): boolean => {
  const items = getAllContent();
  const filtered = items.filter(item => item.id !== id);
  
  if (filtered.length === items.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Search content
export const searchContent = (query: string, filters?: {
  topic?: string;
  difficulty?: string;
  type?: string;
}): ContentItem[] => {
  let items = getAllContent();
  
  // Text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    items = items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      item.author.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Apply filters
  if (filters) {
    if (filters.topic && filters.topic !== 'all') {
      items = items.filter(item => item.topic === filters.topic);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      items = items.filter(item => item.difficulty === filters.difficulty);
    }
    if (filters.type && filters.type !== 'all') {
      items = items.filter(item => item.type === filters.type);
    }
  }
  
  return items;
};

// Get content statistics
export const getContentStats = () => {
  const items = getAllContent();
  
  return {
    total: items.length,
    byTopic: {
      algebra: items.filter(i => i.topic === 'algebra').length,
      geometry: items.filter(i => i.topic === 'geometry').length,
      statistics: items.filter(i => i.topic === 'statistics').length,
      trigonometry: items.filter(i => i.topic === 'trigonometry').length,
      calculus: items.filter(i => i.topic === 'calculus').length,
    },
    byType: {
      video: items.filter(i => i.type === 'video').length,
      pdf: items.filter(i => i.type === 'pdf').length,
      quiz: items.filter(i => i.type === 'quiz').length,
      slide: items.filter(i => i.type === 'slide').length,
    },
    byDifficulty: {
      beginner: items.filter(i => i.difficulty === 'beginner').length,
      intermediate: items.filter(i => i.difficulty === 'intermediate').length,
      advanced: items.filter(i => i.difficulty === 'advanced').length,
    },
  };
};
