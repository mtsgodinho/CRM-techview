
import { CapiPayload } from '../types';
import { sha256, getCookie } from '../utils';

declare global {
  interface Window {
    fbq: any;
  }
}

export const trackPixelEvent = (eventName: string, params: any, eventID: string) => {
  if (window.fbq) {
    window.fbq('track', eventName, params, { eventID });
    console.log(`[Pixel] Tracking: ${eventName}`, params, eventID);
  }
};

export const sendToCapi = async (payload: CapiPayload, accessToken: string, pixelId: string) => {
  // In a real production app, this would be a fetch to Meta's endpoint or a proxy backend
  // We'll simulate the "Server-side" call for educational/prototype purposes
  console.log("%c[CAPI SERVER-SIDE PAYLOAD SENT]", "color: #10b981; font-weight: bold; font-size: 14px;");
  console.log(JSON.stringify(payload, null, 2));
  
  // Example of what the real fetch would look like:
  /*
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ data: [payload] }),
    headers: { 'Content-Type': 'application/json' }
  });
  */
};

export const prepareCapiPayload = async (
  eventName: string,
  eventId: string,
  userData: { email: string, phone: string, firstName: string, lastName: string, cep: string },
  customData: any
): Promise<CapiPayload> => {
  return {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    event_id: eventId,
    action_source: 'website',
    user_data: {
      em: await sha256(userData.email),
      ph: await sha256(userData.phone),
      fn: await sha256(userData.firstName),
      ln: await sha256(userData.lastName),
      zp: await sha256(userData.cep),
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
      client_ip_address: '127.0.0.1', // Should be obtained from server
      client_user_agent: navigator.userAgent
    },
    custom_data: {
      ...customData,
      currency: 'BRL'
    }
  };
};
