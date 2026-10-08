import React from 'react';
import { Info, MessageCircle } from 'lucide-react';
import { DEMO_MODE, getContactUrl } from '../../data/contact';

export const DemoBanner: React.FC = () => {
  if (!DEMO_MODE) return null;
  const contactUrl = getContactUrl();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-100 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="flex items-start sm:items-center gap-2 text-center sm:text-left">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Demonstração com dados fictícios.</strong> As marcações ficam apenas neste
            dispositivo e nenhuma mensagem é enviada a clientes reais.
          </span>
        </p>
        {contactUrl && (
          <a
            href={contactUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold whitespace-nowrap transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Quero isto na minha barbearia
          </a>
        )}
      </div>
    </div>
  );
};
