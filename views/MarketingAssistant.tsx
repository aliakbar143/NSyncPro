
import React, { useState } from 'react';
import { generateMarketingContent } from '../services/geminiService';
import { Product } from '../types';
import { Sparkles, Send, Copy, RefreshCcw, Facebook, Instagram, Twitter, Mail, CheckCircle2 } from 'lucide-react';

interface MarketingAssistantProps {
  products: Product[];
}

const MarketingAssistant: React.FC<MarketingAssistantProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [platform, setPlatform] = useState<'Facebook' | 'Instagram' | 'X' | 'Email'>('Instagram');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = products.find(p => p.id === selectedProduct);

  const handleGenerate = async () => {
    if (!product) return;
    setIsGenerating(true);
    const content = await generateMarketingContent(product.name, product.description, platform);
    setGeneratedContent(content || 'No content generated.');
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          AI POWERED MARKETING
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Campaign Content Generator</h1>
        <p className="text-gray-500 mt-2">Generate high-converting ad copy and social media posts for your Noon products.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Product</label>
              <select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Marketing Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Instagram', icon: Instagram },
                  { id: 'Facebook', icon: Facebook },
                  { id: 'X', icon: Twitter },
                  { id: 'Email', icon: Mail }
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPlatform(id as any)}
                    className={`flex items-center justify-center p-3 rounded-xl border transition-all ${
                      platform === id 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-xs font-bold">{id}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
            >
              {isGenerating ? (
                <RefreshCcw className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {isGenerating ? 'Analyzing Product...' : 'Generate Copy'}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="md:col-span-2">
          <div className="bg-white h-full min-h-[400px] rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preview: {platform} Post</span>
              {generatedContent && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Content
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="p-8 flex-1 prose prose-indigo max-w-none">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full animate-pulse flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium">Gemini AI is crafting your ad copy...</p>
                </div>
              ) : generatedContent ? (
                <div className="whitespace-pre-wrap font-medium text-gray-700 leading-relaxed">
                  {generatedContent}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-300">
                  <Sparkles className="w-12 h-12" />
                  <p className="text-sm font-medium">Configure your post settings and click generate.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingAssistant;
