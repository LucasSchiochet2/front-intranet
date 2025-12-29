import Link from 'next/link';
import { getMenu, MenuItem } from '../../api';

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const hasChildren = item.children && item.children.length > 0;
  const href = item.link || '#';

  return (
    <li>
      <Link 
        href={href} 
        className="flex items-center gap-3 p-3 hover:bg-primary-dark rounded-lg transition-colors"
      >
        <i className={`${item.icon || 'las la-file'} text-xl`}></i>
        <span>{item.name}</span>
      </Link>
      {hasChildren && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-primary-dark pl-2">
          {item.children.map((child) => (
            <MenuItemComponent key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export async function Sidebar() {
  const menuItems = await getMenu();

  return (
    <aside className="h-screen w-64 bg-primary text-white flex flex-col fixed left-0 top-0 overflow-y-auto mt-24">
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <MenuItemComponent key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

