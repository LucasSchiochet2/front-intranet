import { getMenu } from "../api";
import { DashboardClientLayout } from "../layout/components/dashboard-client-layout";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = await getMenu();
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_session');
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  return (
    <DashboardClientLayout menuItems={menuItems} user={user}>
      {children}
    </DashboardClientLayout>
  );
}
