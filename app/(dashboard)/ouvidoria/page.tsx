import Link from "next/link";
import { FileText, Search } from "lucide-react";

export default function OuvidoriaPage() {
  return (
    <div className="container  mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Ouvidoria</h1>
      <div className=" ml-4 md:ml-10 bg-white w-[90%] p-6 shadow-md">
      <div>
        <p className="text-gray-600 mb-8 text-base leading-relaxed">
          A <strong>Ouvidoria</strong> é um canal de comunicação direta entre você e a instituição. 
          Aqui você pode registrar elogios, sugestões, reclamações ou denúncias, 
          contribuindo para a melhoria contínua dos nossos serviços. 
          Sua participação é fundamental para construirmos um ambiente cada vez melhor.
        </p>
      </div>  
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link 
          href="/ouvidoria/solicitacao"
          className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 group"
        >
          <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nova Solicitação</h2>
          <p className="text-gray-600 text-center">
            Registre uma nova manifestação, denúncia, elogio ou reclamação.
          </p>
        </Link>

        <Link 
          href="/ouvidoria/acompanhamento"
          className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 group"
        >
          <div className="p-4 bg-green-50 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
            <Search className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Acompanhamento</h2>
          <p className="text-gray-600 text-center">
            Consulte o andamento da sua manifestação através do número de protocolo.
          </p>
        </Link>
      </div>
    </div>
    </div>
  );
}
