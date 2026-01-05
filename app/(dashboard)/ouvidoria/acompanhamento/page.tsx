"use client";
import { useState } from "react";
import { OmbudsmanData, storageUrl } from "../../../api";
import { fetchOmbudsmanProtocol } from "@/app/actions";

const statusMap: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em Andamento",
  resolved: "Resolvido",
};

export default function AcompanhamentoPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<OmbudsmanData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const result = await fetchOmbudsmanProtocol(token);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(" Ocorreu um erro ao buscar o protocolo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-primary">Acompanhamento de Ouvidoria</h1>

      {/* Card substituto */}
      <div className="mb-8 rounded-lg border bg-white text-primary border-primary shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight text-primary">
            Consultar Protocolo
          </h3>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              placeholder="Digite o número do protocolo (Token)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="border-primary inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-primary hover:text-white! hover:bg-primary h-10 px-4 py-2"
            >
              {loading ? "Buscando..." : "Consultar"}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mb-6 relative w-full rounded-lg border border-red-200 p-4 bg-red-50 text-red-600">
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {data && (
        <div className="rounded-lg border bg-white text-primary border-primary shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              Detalhes do Protocolo: {token}
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm text-slate-500">Assunto</p>
                <p>{data.subject || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-500">Tipo</p>
                <p className="capitalize">{data.type || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-500">Status</p>
                <p className="capitalize">
                  {statusMap[data.status] || data.status || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-500">
                  Data de Criação
                </p>
                <p>
                  {data.created_at
                    ? new Date(data.created_at).toLocaleDateString('pt-BR')
                    : "N/A"}
                </p>
              </div>
              {data.resolved_at && (
                <div className="col-span-full md:col-span-2">
                  <p className="font-semibold text-sm text-slate-500">
                    Resolvido em
                  </p>
                  <p>{new Date(data.resolved_at).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
              <div className="col-span-full">
                <p className="font-semibold text-sm text-slate-500">Mensagem</p>
                <p className="whitespace-pre-wrap">
                  {data.message || data.description || "Sem descrição"}
                </p>
              </div>
              {data.attachment && (
                <div className="col-span-full">
                  <p className="font-semibold text-sm text-slate-500">Anexo</p>
                  <a
                    href={`${storageUrl}${data.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    Ver anexo
                  </a>
                </div>
              )}
              {(data.response || data.admin_notes) && (
                <div className="col-span-full bg-slate-100 p-4 rounded-md">
                  <p className="font-semibold text-sm text-slate-500 mb-2">
                    Resposta da Ouvidoria
                  </p>
                  <p className="whitespace-pre-wrap">
                    {data.response || data.admin_notes}
                  </p>
                  {data.admin_attachment && (
                    <div className="col-span-full">
                      <p className="font-semibold text-sm text-slate-500">
                        Anexo
                      </p>
                      <a
                        href={`${storageUrl}${data.admin_attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline break-all"
                      >
                        Ver anexo
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
