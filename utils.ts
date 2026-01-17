
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function generateEventId(): string {
  return `evt_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export const DEFAULT_PLANS = [
  { id: '1t_mensal', name: 'Mensal (1 Tela)', price: 29.90, screens: 1 },
  { id: '1t_trimestral', name: 'Trimestral (1 Tela)', price: 74.90, screens: 1 },
  { id: '1t_semestral', name: 'Semestral (1 Tela)', price: 149.90, screens: 1 },
  { id: '1t_anual', name: 'Anual (1 Tela)', price: 289.90, screens: 1 },
  { id: '2t_mensal', name: 'Mensal (2 Telas)', price: 54.90, screens: 2 },
  { id: '2t_trimestral', name: 'Trimestral (2 Telas)', price: 149.90, screens: 2 },
  { id: '2t_semestral', name: 'Semestral (2 Telas)', price: 289.90, screens: 2 },
  { id: '2t_anual', name: 'Anual (2 Telas)', price: 569.90, screens: 2 },
];
