import { cookies } from "next/headers";
import SolicitacaoForm from "./solicitacao-form";

export default async function NovaSolicitacaoPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user_session');
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  return <SolicitacaoForm user={user} />;
}
