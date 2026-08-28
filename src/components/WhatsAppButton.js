import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSite } from './SiteContext';
import { WHATSAPP_NUMBER } from '../siteDefaults';

export default function WhatsAppButton() {
  const { settings } = useSite();
  const number = settings?.whatsapp?.number || settings?.contact_info?.whatsapp || WHATSAPP_NUMBER;
  const message = settings?.whatsapp?.message || "Hello Akagera Inc, I'd like to talk about a project.";
  const href = `https://wa.me/${String(number).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  return (
    <a className="whatsapp-fab" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="Talk to us on WhatsApp">
      <MessageCircle size={26} />
    </a>
  );
}
