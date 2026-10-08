// =====================================================================
// CONTACTO E MODO DEMONSTRAÇÃO
// Preenche estes dados ANTES de enviar a demo a barbearias.
// Enquanto 'whatsapp' e 'email' estiverem vazios, os botões
// "Quero isto na minha barbearia" ficam escondidos.
// =====================================================================
export const CONTACT = {
  name: 'Bruna',
  whatsapp: '', // só dígitos, com indicativo. Ex.: '351912345678' (usa um número de empresa, não o pessoal)
  email: 'webproline10@gmail.com',
};

// true = demonstração com dados fictícios.
// Neste modo, as mensagens de WhatsApp NÃO vão para números de exemplo:
// o WhatsApp abre com a mensagem pronta e a pessoa escolhe o destinatário.
export const DEMO_MODE = true;

export function getContactUrl(): string | null {
  const msg =
    'Olá! Vi a demonstração do sistema de marcações para barbearias e gostava de saber mais.';
  const wa = CONTACT.whatsapp.replace(/\D/g, '');
  if (wa) return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
  const email = CONTACT.email.trim();
  if (email) {
    return `mailto:${email}?subject=${encodeURIComponent(
      'Sistema de marcações para barbearia'
    )}&body=${encodeURIComponent(msg)}`;
  }
  return null;
}
