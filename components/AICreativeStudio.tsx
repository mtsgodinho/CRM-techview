
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AICreativeStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [adCopy, setAdCopy] = useState<string | null>(null);

  const generateCreatives = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere uma copy persuasiva e agressiva focada em conversão para IPTV. O produto é TECHVIEW. Público: ${prompt}. Estilo: Elite, futurista, focado em faturar. Headline em maiúsculo.`,
        config: { systemInstruction: "Você é um mentor de marketing agressivo e digitalmente imbatível. Suas palavras exalam confiança e autoridade espacial.", temperature: 0.9 }
      });
      setAdCopy(textResponse.text || 'ERRO_PROTOCOLO_TEXTO');

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Futuristic cinematic advertisement, neon blue accents, high-tech streaming visual. Subject: ${prompt}. Style: Cyberpunk 2077, high resolution, ultra detailed.` }]
        },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (error) {
      console.error(error);
      alert('FALHA_NA_CONEXÃO_NEURAL. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-[#0A0A0A] border-2 border-[#00BFFF]/30 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-[0_0_50px_rgba(0,191,255,0.1)]">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-sci-fi font-black mb-6 neon-glow uppercase tracking-tighter">Neural_Creative_Engine</h2>
          <p className="text-slate-500 mb-10 font-black uppercase tracking-widest text-xs leading-relaxed">Sintetize pautas publicitárias de alto impacto usando a rede neural TechView. Interface de geração para vendedores de elite.</p>
          
          <div className="flex flex-col md:flex-row gap-4 p-3 bg-black border border-[#1A1A1A] rounded-3xl shadow-inner">
            <input 
              type="text" 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="COMANDO_DE_OBJETIVO: Ex: Cliente premium querendo 4K..."
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white font-black uppercase tracking-widest placeholder:text-slate-800 text-xs"
            />
            <button 
              onClick={generateCreatives}
              disabled={isGenerating}
              className="bg-[#00BFFF] text-black px-10 py-4 rounded-2xl font-sci-fi font-black hover:bg-[#33ccff] transition-all disabled:opacity-50 uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(0,191,255,0.4)]"
            >
              {isGenerating ? 'PROCESSANDO...' : 'EXECUTAR_GEN'}
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
           <i className="fa-solid fa-user-astronaut text-[300px] text-[#00BFFF] -rotate-12 translate-x-12 translate-y-12"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[3rem] p-10 shadow-2xl flex flex-col min-h-[500px]">
          <h3 className="text-[11px] font-sci-fi font-black mb-8 flex items-center gap-4 text-white uppercase tracking-widest">
            <i className="fa-solid fa-microchip text-[#00BFFF]"></i>
            Visual_Output_Buffer
          </h3>
          {generatedImage ? (
            <div className="relative group flex-1">
              <img src={generatedImage} alt="Neural Output" className="w-full h-full object-cover rounded-[2rem] shadow-2xl border border-[#1A1A1A]" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem]">
                <button className="bg-white text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-black rounded-[2rem] border-2 border-[#1A1A1A] border-dashed flex items-center justify-center flex-col text-slate-800 space-y-4">
               <i className="fa-solid fa-radiation text-6xl animate-pulse"></i>
               <p className="text-[9px] font-black uppercase tracking-[0.4em]">Aguardando Sincronização de Imagem</p>
            </div>
          )}
        </div>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[3rem] p-10 shadow-2xl flex flex-col min-h-[500px]">
          <h3 className="text-[11px] font-sci-fi font-black mb-8 flex items-center gap-4 text-white uppercase tracking-widest">
            <i className="fa-solid fa-code text-[#00BFFF]"></i>
            Neural_Copy_Protocol
          </h3>
          {adCopy ? (
            <div className="flex-1 bg-black p-8 rounded-[2rem] border border-[#1A1A1A] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <i className="fa-solid fa-quote-right text-6xl text-white"></i>
              </div>
              <div className="flex-1 overflow-y-auto text-slate-400 font-black uppercase tracking-widest text-[10px] leading-relaxed custom-scrollbar">
                {adCopy}
              </div>
              <div className="mt-8 pt-8 border-t border-[#1A1A1A] flex gap-4">
                <button className="flex-1 bg-[#1A1A1A] text-[#00BFFF] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#222] transition-all">Copiar_Terminal</button>
                <button className="flex-1 border border-[#1A1A1A] text-slate-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Refinar_IA</button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-black rounded-[2rem] border-2 border-[#1A1A1A] border-dashed flex items-center justify-center flex-col text-slate-800 space-y-4">
               <i className="fa-solid fa-fingerprint text-6xl animate-pulse"></i>
               <p className="text-[9px] font-black uppercase tracking-[0.4em]">Aguardando Processamento Neural</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICreativeStudio;
