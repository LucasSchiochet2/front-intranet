"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Upload, Send, CheckCircle, Copy, User as UserIcon, EyeOff } from "lucide-react";
import { submitOmbudsman, type OmbudsmanState } from "@/app/actions";
import Link from "next/link";

const initialState: OmbudsmanState = {
  success: false,
  error: "",
  message: ""
};

interface User {
  id: number;
  name: string;
  email: string;
}

interface SolicitacaoFormProps {
  user?: User | null;
}

export default function SolicitacaoForm({ user }: SolicitacaoFormProps) {
  const [state, formAction, isPending] = useActionState(submitOmbudsman, initialState);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      alert(state.error);
    }
  }, [state]);

  if (state.success && state.token) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md border border-primary/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Solicitação Enviada!</h2>
          <p className="text-gray-600 mb-6">
            Sua solicitação foi registrada com sucesso. Utilize o protocolo abaixo para acompanhar o andamento.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6 flex items-center justify-between max-w-md mx-auto">
            <span className="font-mono text-lg font-semibold text-gray-800">{state.token}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(state.token || "");
                alert("Protocolo copiado!");
              }}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-600"
              title="Copiar protocolo"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <Link 
              href="/ouvidoria/acompanhamento" 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
            >
              Acompanhar Solicitação
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Nova Solicitação</h1>
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isAnonymous 
              ? "bg-gray-800 text-white hover:bg-gray-700" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isAnonymous ? (
            <>
              <UserIcon className="w-4 h-4 mr-2" />
              Identificar-se
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Enviar como Anônimo
            </>
          )}
        </button>
      </div>
      
      <form ref={formRef} action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        
        {isAnonymous ? (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <p className="text-sm text-gray-600 flex items-center">
              <EyeOff className="w-4 h-4 mr-2" />
              Você está enviando esta solicitação anonimamente. Seus dados pessoais não serão registrados.
            </p>
            <input type="hidden" name="name" value="Anônimo" />
            <input type="hidden" name="email" value="anonimo@intranet.local" />
          </div>
        ) : (
          <>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name || ""}
                required={!isAnonymous}
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user?.email || ""}
                required={!isAnonymous}
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </>
        )}

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Solicitação
          </label>
          <select
            id="type"
            name="type"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
          >
            <option value="">Selecione um tipo</option>
            <option value="denuncia">Denúncia</option>
            <option value="reclamacao">Reclamação</option>
            <option value="sugestao">Sugestão</option>
            <option value="elogio">Elogio</option>
            <option value="solicitacao">Solicitação</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Assunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            maxLength={255}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Resumo da solicitação"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-y"
            placeholder="Descreva detalhadamente sua solicitação..."
          ></textarea>
        </div>

        {/* Attachment */}
        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
            Anexo (Opcional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors group relative">
            
            {/* Default Upload View */}
            <div id="upload-view" className="space-y-1 text-center transition-opacity">
              <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-attachment"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Faça upload de um arquivo</span>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                PDF, PNG, JPG até 10MB
              </p>
            </div>

            {/* Selected File View (Hidden by default) */}
            <div id="file-view" className="hidden absolute inset-0 flex-col items-center justify-center bg-gray-50 rounded-md z-10">
              <div className="flex items-center text-gray-700 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <span id="file-name" className="font-medium text-sm truncate max-w-55"></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('file-attachment') as HTMLInputElement;
                  if (input) input.value = '';
                  
                  const fileView = document.getElementById('file-view');
                  const uploadView = document.getElementById('upload-view');
                  
                  if (fileView) {
                    fileView.classList.add('hidden');
                    fileView.classList.remove('flex');
                  }
                  if (uploadView) uploadView.classList.remove('opacity-0');
                }}
                className="text-xs text-red-500 hover:text-red-700 underline font-medium"
              >
                Remover arquivo
              </button>
            </div>

            <input 
              id="file-attachment" 
              name="attachment" 
              type="file" 
              className="sr-only" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const fileName = document.getElementById('file-name');
                  const fileView = document.getElementById('file-view');
                  const uploadView = document.getElementById('upload-view');
                  
                  if (fileName) fileName.textContent = file.name;
                  if (fileView) {
                    fileView.classList.remove('hidden');
                    fileView.classList.add('flex');
                  }
                  if (uploadView) uploadView.classList.add('opacity-0');
                }
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center items-center px-4 py-3 border-2 border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-primary hover:text-white! focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              "Enviando..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Solicitação
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
