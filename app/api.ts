export const API_URL = process.env.API_URL?.endsWith('/') 
  ? process.env.API_URL 
  : `${process.env.API_URL}/`;
export const storageUrl = 'http://intranetproject.test/';

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
  image_url: string;
  link: string | null;
  description: string | null;
}

export async function getBanners(): Promise<Banner[]> {
  try {
    // Mock data for now as I don't have the real endpoint response structure
    // In a real scenario, uncomment the fetch below
    /*
    const response = await fetch(`${API_URL}banners`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }

    const data = await response.json();
    return data;
    */
   
    return [
      {
        id: 1,
        title: "Bem-vindo à Intranet",
        image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        link: "#",
        description: "Fique por dentro de todas as novidades da empresa."
      },
      {
        id: 2,
        title: "Novos Benefícios",
        image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
        link: "/beneficios",
        description: "Confira a nova lista de benefícios para colaboradores."
      },
      {
        id: 3,
        title: "Evento de Final de Ano",
        image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        link: "/eventos",
        description: "Não perca nossa festa de confraternização!"
      }
    ];
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

export async function getMenu(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${API_URL}menu`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }

    const data = await response.json();
    
    // Handle if the API returns an object with numeric keys instead of an array
    if (typeof data === 'object' && !Array.isArray(data)) {
      return Object.values(data);
    }

    return data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
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

export async function getNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${API_URL}news`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    // Primeiro tenta buscar todas as notícias e filtrar (fallback caso o endpoint de slug não exista)
    const allNews = await getNews();
    const newsItem = allNews.find(item => item.slug === slug);
    
    if (newsItem) {
      return newsItem;
    }

    // Se não encontrar na lista, tenta o endpoint direto (caso a lista seja paginada e o item não esteja nela)
    const url = `${API_URL}news/${slug}`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    return null;
  }
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

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(`${API_URL}calendar`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}
export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(`${API_URL}calendar/upcoming`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

export async function login(credentials: {email: string, password: string}) {
  const response = await fetch(`${API_URL}login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
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

export async function getOmbudsmanProtocol(token: string): Promise<OmbudsmanData> {
  const response = await fetch(`${API_URL}ombudsman/${token}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error("Protocolo não encontrado ou erro na busca.");
  }

  return response.json();
}
export interface BirthDay {
  name: string;
  birth_date: string;
  url_photo?: string | null;
}
export async function getBirthDays() {
  try {
    const response = await fetch(`${API_URL}birthdays`, {
      next: { revalidate: 60 },
    });
    console.log('Fetching birthdays from:', `${API_URL}birthdays`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch birthdays');
    }
    const data = await response.json();
    console.log(data);
    return data;
  }
  catch (error) {
    console.error('Error fetching birthdays:', error);
    return [];
  }
}