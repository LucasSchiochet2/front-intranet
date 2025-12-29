const API_URL = process.env.API_URL?.endsWith('/') 
  ? process.env.API_URL 
  : `${process.env.API_URL}/`;

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
  summary: string;
  date: string;
  image_url?: string;
  category: string;
}

export async function getNews(): Promise<NewsItem[]> {
  // Mock data
  return [
    {
      id: 1,
      title: "Lançamento do Novo Portal",
      summary: "Estamos felizes em anunciar o lançamento da nossa nova intranet corporativa.",
      date: "2023-10-27",
      category: "Institucional",
      image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Resultados do Trimestre",
      summary: "Confira os resultados alcançados pela equipe no último trimestre.",
      date: "2023-10-25",
      category: "Financeiro",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Treinamento de Segurança",
      summary: "Novo módulo de treinamento de segurança da informação disponível.",
      date: "2023-10-20",
      category: "RH",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      title: "Evento de Integração",
        summary: "Participe do nosso próximo evento de integração para novos colaboradores.",
        date: "2023-10-18",
        category: "Eventos",
        image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=60"
    }
  ];
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'event' | 'holiday';
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  // Mock data
  return [
    {
      id: 1,
      title: "Reunião Geral",
      date: "2023-11-01",
      time: "10:00",
      location: "Sala de Conferências",
      type: "meeting"
    },
    {
      id: 2,
      title: "Feriado Nacional",
      date: "2023-11-02",
      time: "Dia todo",
      location: "-",
      type: "holiday"
    },
    {
      id: 3,
      title: "Workshop de Inovação",
      date: "2023-11-05",
      time: "14:00",
      location: "Auditório",
      type: "event"
    }
  ];
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

