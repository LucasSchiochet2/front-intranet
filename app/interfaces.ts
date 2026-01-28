export interface Collaborator {
  id: number;
  name: string;
  email: string;
  position?: string;
  department?: string;
  birth_date?: Date | string;
  url_photo?: string | null;
  tenant_id?: number | string;
}

export interface ChecklistItem {
  id?: number;
  description: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Dashboard {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  collaborators?: Collaborator[];
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dashboard_id?: number | null;
  is_completed: boolean;
  deadline?: string;
  collaborator_id_sender: number;
  collaborator_id_receiver: number;
  status: string; // 'pending' | 'in_progress' | 'done'
  tag?: string;
  attachment?: string[] | string | null;
  checklist_items?: ChecklistItem[];
  created_at: string;
  updated_at: string;
  sender?: Collaborator;
  receiver?: Collaborator;
  is_archived?: boolean | number;
  // Old fields for backward compatibility/during transition
  message?: string;
  subject?: string;
  type?: string;
}

export interface DocumentCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
}

export interface DocumentFile {
  id: number;
  url: string;
  name: string;
}

export interface Document {
  id: number;
  document_category_id: number;
  title: string;
  description: string;
  files: string[];
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
  category: DocumentCategory;
}

export interface DocumentsResponse {
  current_page: number;
  data: Document[];
  last_page?: number;
  total?: number;
}
export interface OmbudsmanData {
  id: number;
  status: 'open' | 'in_progress' | 'resolved' | string;
  created_at: string;
  message?: string;
  description?: string;
  response?: string;
  admin_notes?: string;
  subject?: string;
  type?: string;
  attachment?: string;
  admin_attachment?: string;
  resolved_at?: string;
}
export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  collaborator?: {
    id: number;
    name: string;
  };
}
export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  photos: string[];
  tenant_id: number | null;
}
export interface MenuItem {
  id: number;
  name: string;
  type: string;
  link: string | null;
  page_id: number | null;
  parent_id: number | null;
  lft: number;
  rgt: number;
  depth: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tenant_id: string | null;
  icon: string | null;
  children: MenuItem[];
}

export interface Banner {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}
export interface BirthDay {
  name: string;
  birth_date: string;
  url_photo?: string | null;
}
export interface Message {
  id: number;
  title: string;
  content: string;
  sender: string;
  is_read: number;
  attachment?: string | null;
  created_at?: string;
  updated_at?: string;
}