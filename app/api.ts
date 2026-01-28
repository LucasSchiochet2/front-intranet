import {Document,DocumentCategory,DocumentsResponse,Collaborator,Dashboard,Task,OmbudsmanData,CalendarEvent,NewsItem,MenuItem,Banner,Message} from './interfaces';

export const API_URL = process.env.API_URL?.endsWith('/') 
  ? process.env.API_URL 
  : `${process.env.API_URL}/`;
export const storageUrl = 'https://pub-6a3bf9787e92468db0d423b6545a5fa8.r2.dev/';

export async function getBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_URL}banners`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch banners');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
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



export async function getNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${API_URL}news`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    
    let items: NewsItem[] = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      items = data.data;
    }
    
    return items.map(transformNewsItem);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
function transformNewsItem(item: NewsItem): NewsItem {
  let image = item.image;

  // Se não tem image, usa a primeira foto
  if (!image && Array.isArray(item.photos) && item.photos.length > 0) {
    image = item.photos[0];
  }

  // Se tem imagem e não é externa (https), adiciona storageUrl
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    image = `${storageUrl}${image}`;
  }

  return {
    ...item,
    image
  };
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
    const rawItem = data.data || data;
    return rawItem ? transformNewsItem(rawItem) : null;
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    return null;
  }
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




export async function getOmbudsmanProtocol(token: string): Promise<OmbudsmanData> {
  const response = await fetch(`${API_URL}ombudsman/${token}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error("Protocolo não encontrado ou erro na busca.");
  }

  return response.json();
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


export async function getDocuments(page = 1, categoryId?: number): Promise<DocumentsResponse> {
  try {
    let url = `${API_URL}documents?page=${page}`;
    if (categoryId) {
      url = `${API_URL}documents/category/${categoryId}?page=${page}`;
    }
    
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    
    const data = await response.json();
    
    // Handle if response is just an array (common in some endpoints)
    if (Array.isArray(data)) {
      return { current_page: 1, data: data, last_page: 1, total: data.length };
    }
    
    // Handle if response has data property but it might be nested differently or missing
    if (!data.data && Array.isArray(data.documents)) {
       return { ...data, data: data.documents };
    }

    return data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { current_page: 1, data: [] };
  }
}

export async function getDocumentCategories(): Promise<DocumentCategory[]> {
  try {
    const response = await fetch(`${API_URL}documents/categories`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function searchDocuments(query: string): Promise<DocumentsResponse> {
  try {
    const response = await fetch(`${API_URL}documents/search?query=${query}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to search documents');
    }
    
    const data = await response.json();
    // Handle if response is just an array or paginated
    if (Array.isArray(data)) {
      return { current_page: 1, data: data, total: data.length, last_page: 1 };
    }
    return data;
  } catch (error) {
    console.error('Error searching documents:', error);
    return { current_page: 1, data: [] };
  }
}

export async function getShowDocuments(id: number): Promise<Document | null> {
  try {
    const response = await fetch(`${API_URL}documents/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}


export async function getCollaborators(): Promise<Collaborator[]> {
  try {
    const response = await fetch(`${API_URL}collaborators`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
    });

    if (!response.ok) {
       return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.collaborators && Array.isArray(data.collaborators)) return data.collaborators;
    if (data.data && Array.isArray(data.data)) return data.data;
    
    return [];
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return [];
  }
}

export async function getDashboards(): Promise<Dashboard[]> {
  try {
    const response = await fetch(`${API_URL}dashboard`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
       return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return [];
  }
}

export async function getDashboard(id: number): Promise<Dashboard | null> {
  try {
    const response = await fetch(`${API_URL}dashboard/${id}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
       return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching dashboard ${id}:`, error);
    return null;
  }
}

export async function getCollaboratorDashboards(collaboratorId: number): Promise<Dashboard[]> {
  try {
    const response = await fetch(`${API_URL}dashboard/collaborator/${collaboratorId}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
       return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`Error fetching dashboards for collaborator ${collaboratorId}:`, error);
    return [];
  }
}

export async function getPersonalDashboards(collaboratorId: number): Promise<Dashboard[]> {
  try {
    const response = await fetch(`${API_URL}dashboard/personal/${collaboratorId}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
    });

    if (!response.ok) {
       return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`Error fetching personal dashboards for ${collaboratorId}:`, error);
    return [];
  }
}

export async function createDashboard(data: { name: string; description: string; collaborators: number[]; tenant_id?: number | string }) {
  const response = await fetch(`${API_URL}dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    let errorData = {};
    try {
        errorData = JSON.parse(text);
    } catch (error) {
        console.error(error, 'Failed to parse error response JSON:', text);
    }
    console.error('Create dashboard failed:', response.status, errorData, text);
  }

  return response.json();
}

export async function updateDashboard(id: number, data: { name: string; description: string; collaborators: number[]; tenant_id?: number | string } | FormData) {
  let body: BodyInit;
  let method = 'PUT';
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
  };

  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    body = data;
    method = 'POST';
  } else {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}dashboard/${id}`, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    let errorData = {};
    try {
        errorData = JSON.parse(text);
    } catch (e) {
        console.error(e,'Failed to parse error response JSON:', text);
    }
    console.error('Update dashboard failed:', response.status, errorData, text);
  }

  return response.json();
}

export async function deleteDashboard(id: number) {
  const response = await fetch(`${API_URL}dashboard/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    try {
        JSON.parse(text);
    } catch (e) {
        console.error(e,'Failed to parse error response JSON:', text);
    }
    console.error('Delete dashboard failed:', response.status, text);
  }

  return response.json();
}



export async function getCollaboratorTasks(collaboratorId: number): Promise<Task[]> {
  try {
    const response = await fetch(`${API_URL}task/collaborator/${collaboratorId}`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch collaborator tasks');
    }

    const data = await response.json();
    
    let tasks: Task[] = [];
    if (Array.isArray(data)) {
      tasks = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      tasks = data.data;
    }

    return tasks.map((t) => ({
      ...t,
      status: t.status || 'todo'
    }));

  } catch (error) {
    console.error('Error fetching collaborator tasks:', error);
    return [];
  }
}

// export async function getCollaboratorSenderTasks(collaboratorId: number): Promise<Task[]> {
//   try {
//     const response = await fetch(`${API_URL}task/collaborator/sender/${collaboratorId}`, {
//       next: { revalidate: 0 },
//       headers: {
//         'Accept': 'application/json',
//       },
//     });

//     if (!response.ok) {
//         if (response.status === 404) return [];
//         throw new Error('Failed to fetch sender tasks');
//     }

//     const data = await response.json();
    
//     let tasks: Task[] = [];
//     if (Array.isArray(data)) {
//       tasks = data;
//     } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
//       tasks = data.data;
//     }

//     return tasks.map((t: any) => ({
//       ...t,
//       status: t.status || 'todo'
//     }));

//   } catch (error) {
//     console.error('Error fetching sender tasks:', error);
//     return [];
//   }
// }

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_URL}task`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch tasks');
    }

    const data = await response.json();
    
    let tasks: Task[] = [];
    if (Array.isArray(data)) {
      tasks = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      tasks = data.data;
    }

    return tasks.map((t) => ({
      ...t,
      status: t.status || 'todo'
    }));

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function getTask(id: number): Promise<Task | null> {
  try {
    const response = await fetch(`${API_URL}task/${id}`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
       return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    return null;
  }
}

export async function createTask(formData: FormData) {
  const response = await fetch(`${API_URL}task`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
    },
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('Create task failed:', response.status, data);
    throw new Error(data.message || 'Failed to create task');
  }

  return response.json();
}

export async function updateTask(id: number, data: Partial<Task> | FormData) {
  let body: BodyInit;
  let method = 'PUT';
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
  };

  if (data instanceof FormData) {
    // For file uploads in Laravel/PHP via PUT, we often need to simulate PUT via POST
    // and append _method field.
    data.append('_method', 'PUT');
    body = data;
    method = 'POST'; 
  } else {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_URL}task/${id}`, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const resData = await response.json().catch(() => ({}));
    console.error('Update task failed:', response.status, resData);
    throw new Error(resData.message || 'Failed to update task');
  }

  return response.json();
}

export async function archiveTask(id: number) {
  const response = await fetch(`${API_URL}task/${id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to archive task');
  }

  return response.json();
}

export async function unarchiveTask(id: number) {
  const response = await fetch(`${API_URL}task/${id}/unarchive`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to unarchive task');
  }

  return response.json();
}

export async function getArchivedTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_URL}task/archived`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch archived tasks');
    }

    const data = await response.json();
    
    let tasks: Task[] = [];
    if (Array.isArray(data)) {
      tasks = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      tasks = data.data;
    }

    return tasks.map((t) => ({
      ...t,
      status: t.status || 'todo'
    }));

  } catch (error) {
    console.error('Error fetching archived tasks:', error);
    return [];
  }
}

export async function getMenuLinks(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${API_URL}menu/links`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu links');
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
    console.error('Error fetching menu links:', error);
    return [];
  }
}

export async function getFastAccess(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${API_URL}menu/fastaccess`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fast access');
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
    console.error('Error fetching fast access:', error);
    return [];
  }
}
export async function getPageBySlug(slug: string): Promise<PageItem | null> {
  try {
    const response = await fetch(`${API_URL}pages/${slug}`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
    });

    if (!response.ok) {
       return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

export async function getCollaboratorMessages(collaboratorId: number): Promise<Message[]> {
  try {
    const response = await fetch(`${API_URL}message/collaborator/${collaboratorId}`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch messages');
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
    console.error(`Error fetching messages for collaborator ${collaboratorId}:`, error);
    return [];
  }
}

export async function getMessage(id: number): Promise<Message | null> {
  try {
    const response = await fetch(`${API_URL}message/${id}`, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
    });

    if (!response.ok) {
       return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching message ${id}:`, error);
    return null;
  }
}

export async function markMessageAsRead(id: number) {
  const formData = new FormData();
  formData.append('_method', 'PUT');

  const response = await fetch(`${API_URL}message/${id}/read`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to mark message as read');
  }

  return response.json();
}
export type PageItem = {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  template?: string | null;
  extras?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tenant_id: string | null;
};
// General search for intranet (news, documents, calendar, etc)
export type GeneralSearchResult =
  | ({ type: 'news' } & NewsItem)
  | ({ type: 'document' } & Document)
  | ({ type: 'calendar' } & CalendarEvent)
  | ({ type: 'page' } & PageItem)
  | ({ type: 'banner' } & Banner)
  | ({ type: 'collaborator' } & Collaborator);

export type GeneralSearchResponse = {
  query: string;
  total: number;
  results: GeneralSearchResult[];
};

export async function getCollaboratorDocuments(collaboratorId: number): Promise<Document[]> {
  try {
    const response = await fetch(`${API_URL}documents/collaborator/${collaboratorId}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Secret': process.env.FRONTEND_SECRET || '',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch collaborator documents');
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error(`Error fetching documents for collaborator ${collaboratorId}:`, error);
    return [];
  }
}

export async function searchIntranet(query: string): Promise<GeneralSearchResponse> {
  let data: GeneralSearchResponse = { query, total: 0, results: [] };
  try {
    const res = await fetch(`${API_URL}search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch search API:', err);
  }
  return data;
}