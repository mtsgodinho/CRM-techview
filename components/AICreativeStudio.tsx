
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
      
      // 1. Generate Ad Copy (Text)
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere uma copy persuasiva de alta conversão para Facebook Ads focada em IPTV. Público: ${prompt}. Estilo: Profissional mas agressivo em benefícios. Inclua Headline, Body text e CTA.`,
        config: { temperature: 0.8 }
      });
      setAdCopy(textResponse.text || 'Falha ao gerar copy.');

      // 2. Generate Image (Simulation with placeholder for speed, but showing logic)
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High resolution digital art for a streaming service advertisement. Vibrant colors, neon, futuristic. Subject: ${prompt}. No text in image.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar criativos. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-indigo-900 rounded-2xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Crie Criativos Vencedores com IA</h2>
          <p className="text-indigo-200 mb-6">Nossa inteligência artificial analisa as tendências de mercado para gerar artes e copys que convertem 3x mais.</p>
          <div className="flex gap-2 p-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <input 
              type="text" 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Família assistindo futebol em 4K no sofá..."
              className="flex-1 bg-transparent border-none outline-none px-2 text-white placeholder:text-indigo-300"
            />
            <button 
              onClick={generateCreatives}
              disabled={isGenerating}
              className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
           <i className="fa-solid fa-wand-magic-sparkles text-[200px] -rotate-12 absolute -bottom-10 -right-10"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-image text-indigo-600"></i>
            Arte Gerada
          </h3>
          {generatedImage ? (
            <div className="relative group">
              <img src={generatedImage} alt="Generated Creative" className="w-full rounded-xl shadow-lg" />
              <button 
                 onClick={() => {}} // Download logic
                 className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fa-solid fa-download text-indigo-600"></i>
              </button>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center flex-col text-gray-400">
               <i className="fa-regular fa-image text-4xl mb-2"></i>
               <p className="text-sm">Sua arte aparecerá aqui</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-align-left text-indigo-600"></i>
            Copy Persuasiva
          </h3>
          {adCopy ? (
            <div className="bg-gray-50 p-6 rounded-xl border whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
              {adCopy}
              <div className="mt-6 flex gap-2">
                <button className="text-xs bg-indigo-600 text-white px-3 py-2 rounded font-bold uppercase">Copiar Texto</button>
                <button className="text-xs bg-white border px-3 py-2 rounded font-bold uppercase">Refinar com IA</button>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center flex-col text-gray-400">
               <i className="fa-solid fa-pen-nib text-4xl mb-2"></i>
               <p className="text-sm">Sua copy aparecerá aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICreativeStudio;
