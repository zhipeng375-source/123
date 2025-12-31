import React, { useEffect, useState } from 'react';
import { X, Smartphone, Wifi, AlertTriangle, Copy, Check, Globe, UploadCloud, Monitor, ExternalLink, AppWindow, Share, PlusSquare, MoreVertical, Menu, Link, Bot, CheckCircle2, XCircle, Lock, ArrowLeft, FilePlus } from 'lucide-react';
import { hasApiKey } from '../services/geminiService';

interface SettingsModalProps {
  onClose: () => void;
}

type Tab = 'connect' | 'desktop' | 'deploy';
type InstallPlatform = 'ios' | 'android';

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('connect');
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>('ios');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    // Get the actual URL where the app is running
    const url = window.location.href;
    setCurrentUrl(url);
    
    // Check if running on localhost
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      setIsLocalhost(true);
    }

    // Check API Status
    setApiConnected(hasApiKey());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewWindow = () => {
    window.open(currentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">系统集成与分享</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'connect' ? 'text-sl-600 border-b-2 border-sl-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            手机/分享
          </button>
          <button 
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'desktop' ? 'text-sl-600 border-b-2 border-sl-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            电脑安装
          </button>
          <button 
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'deploy' ? 'text-sl-600 border-b-2 border-sl-600 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            发布状态
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* MOBILE / CONNECT TAB */}
          {activeTab === 'connect' && (
            <div className="text-center">
              
              {/* URL Display & Copy */}
              <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                   <Link size={12} /> 当前应用链接
                </label>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    readOnly 
                    value={currentUrl} 
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:outline-none select-all"
                   />
                   <button 
                    onClick={handleCopy}
                    className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                   >
                     {copied ? <Check size={14} /> : <Copy size={14} />}
                     {copied ? '已复制' : '复制'}
                   </button>
                </div>
              </div>

              {/* QR Section */}
              {!isLocalhost ? (
                <div className="flex flex-col items-center mb-6">
                  <div className="p-2 bg-white border-2 border-slate-100 rounded-xl shadow-sm mb-2 relative group cursor-pointer hover:shadow-md transition-all">
                     <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}`} 
                       alt="QR Code" 
                       className="w-32 h-32 md:w-40 md:h-40"
                     />
                     <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-slate-600 rounded-xl">
                        微信/相机扫码
                     </div>
                  </div>
                  <p className="text-xs text-slate-400">请使用手机扫码，或复制上方链接发送给同事</p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
                  <h5 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> 本地环境
                  </h5>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    当前为本地开发环境 (Localhost)，外部设备无法访问。请切换到 <b>发布状态</b> 页签了解如何上线。
                  </p>
                </div>
              )}

              {/* Install Guide Section */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-center gap-2">
                  <Smartphone size={16} className="text-sl-500" /> 添加到手机桌面
                </h4>
                
                <div className="flex justify-center gap-2 mb-4">
                  <button 
                    onClick={() => setInstallPlatform('ios')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${installPlatform === 'ios' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    iOS (苹果)
                  </button>
                  <button 
                    onClick={() => setInstallPlatform('android')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${installPlatform === 'android' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Android (安卓)
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100">
                  {installPlatform === 'ios' ? (
                    <ol className="text-xs text-slate-600 space-y-3">
                      <li className="flex gap-2">
                        <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200 flex-shrink-0">1</span>
                        <span>在 <b>Safari</b> 打开链接。</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200 flex-shrink-0">2</span>
                        <span>点击底部 <b>分享</b> <Share size={12} className="inline mx-0.5" />。</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200 flex-shrink-0">3</span>
                        <span>选择 <b>“添加到主屏幕”</b> <PlusSquare size={12} className="inline mx-0.5" />。</span>
                      </li>
                    </ol>
                  ) : (
                    <ol className="text-xs text-slate-600 space-y-3">
                      <li className="flex gap-2">
                        <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200 flex-shrink-0">1</span>
                        <span>在 <b>Chrome</b> 打开链接。</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200 flex-shrink-0">2</span>
                        <span>点击右上角菜单 <MoreVertical size={12} className="inline mx-0.5" />。</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-200 flex-shrink-0">3</span>
                        <span>选择 <b>“安装应用”</b> 或 <b>“添加到主屏幕”</b>。</span>
                      </li>
                    </ol>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP TAB */}
          {activeTab === 'desktop' && (
            <div className="space-y-6">
               <div className="text-center">
                  <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Monitor size={24} />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-1">电脑端体验</h4>
                  <p className="text-sm text-slate-500">
                    更好的大屏管理体验
                  </p>
               </div>

               {/* Open New Window Button */}
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">全屏预览</h5>
                    <p className="text-xs text-slate-500 mt-1">在新标签页中打开应用</p>
                  </div>
                  <button 
                    onClick={openInNewWindow}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <ExternalLink size={16} /> 打开
                  </button>
               </div>

               {/* Install PWA Guide */}
               <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <h5 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-2">
                    <AppWindow size={16} /> 安装到电脑桌面
                  </h5>
                  <p className="text-xs text-indigo-700 leading-relaxed mb-3">
                    Chrome/Edge 浏览器支持将网页安装为独立 APP：
                  </p>
                  <ol className="text-xs text-indigo-800 space-y-2 list-decimal list-inside bg-white/50 p-3 rounded-lg">
                    <li>在地址栏右侧寻找 <b className="bg-white px-1 rounded border border-indigo-200">💻 或 ⊕</b> 图标。</li>
                    <li>点击 <b>“安装 双良PM”</b>。</li>
                    <li>应用将以独立窗口运行。</li>
                  </ol>
               </div>
            </div>
          )}

          {/* DEPLOY TAB */}
          {activeTab === 'deploy' && (
            <div className="space-y-4">
              {/* API Status Card */}
              <div className={`p-4 rounded-xl border ${apiConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start gap-3">
                   <div className={`mt-1 ${apiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                     <Bot size={20} />
                   </div>
                   <div>
                     <h4 className={`text-sm font-bold ${apiConnected ? 'text-emerald-900' : 'text-amber-900'}`}>
                       AI 服务状态: {apiConnected ? '已连接 (生产模式)' : '演示模式 (无 Key)'}
                     </h4>
                     <p className={`text-xs mt-1 leading-relaxed ${apiConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                       {apiConnected 
                         ? '系统已检测到有效的 API Key。Deep Research 及情报功能将访问实时互联网数据。' 
                         : '未检测到有效的 API Key。Deep Research 及情报功能目前使用模拟数据运行。'}
                     </p>
                     {!apiConnected && (
                       <div className="mt-3 text-xs bg-white/60 p-3 rounded border border-amber-200/50 text-amber-900">
                         <p className="font-bold flex items-center gap-1 mb-1"><Lock size={12}/> 无法连接?</p>
                         <ul className="list-disc list-inside space-y-1 opacity-90">
                            <li>1. 在文件列表找到 <code>.env</code> 文件。</li>
                            <li>2. 将内容修改为: <code>VITE_API_KEY=您的密钥</code> (增加 VITE_ 前缀)。</li>
                            <li>3. 点击右侧预览窗口的刷新按钮。</li>
                         </ul>
                         <p className="mt-2 text-[10px] text-amber-700 font-mono bg-amber-100/50 p-1 rounded">
                           VITE_API_KEY=AIzaSy...
                         </p>
                       </div>
                     )}
                   </div>
                   <div className={`ml-auto ${apiConnected ? 'text-emerald-500' : 'text-amber-400'}`}>
                     {apiConnected ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                   </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Globe className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">关于访问链接</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    如果您在 Bolt 编辑器中找不到“Deploy”按钮，请直接使用<b>“手机/分享”</b>标签页中的链接。
                  </p>
                  <p className="text-xs text-blue-700 mt-2 leading-relaxed font-bold">
                    只要您在当前页面能看到此窗口，该链接就是有效的。
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 hover:border-sl-400 transition-colors">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold">V</div>
                   <h5 className="font-bold text-slate-800">永久部署 (推荐)</h5>
                 </div>
                 <p className="text-xs text-slate-600 mb-2">
                   如果需要长期稳定的访问链接（不随编辑器关闭而失效）：
                 </p>
                 <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside ml-1">
                   <li>点击编辑器上方的 <b>Download</b> 下载代码。</li>
                   <li>将代码上传至 <a href="https://vercel.com" target="_blank" className="text-indigo-600 hover:underline">Vercel</a> 或 <a href="https://netlify.com" target="_blank" className="text-indigo-600 hover:underline">Netlify</a>。</li>
                 </ol>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;