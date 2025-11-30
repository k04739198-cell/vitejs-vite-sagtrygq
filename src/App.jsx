import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Activity, Terminal, Crosshair, Settings, 
  LayoutDashboard, TrendingUp, TrendingDown, AlertTriangle, 
  Lock, Unlock, Zap, Sparkles, Bot, X, Camera, ChevronRight, Play 
} from 'lucide-react';

// --- TOUR DATA ---
const TOUR_STEPS = [
  {
    target: 'tour-neural',
    title: '1. The Neural Stream',
    desc: 'The brain of the system. Here, the Alpha Agent (Strategy) proposes trades, but cannot execute. It must negotiate with the Risk Warden and Compliance Clerk in real-time JSON.',
    position: 'right'
  },
  {
    target: 'tour-killswitch',
    title: '2. The Fail-Safe Layer',
    desc: 'Safety is hard-coded. The Kill Switch bypasses all AI agents to freeze the system and square off positions immediately. This prevents runaway AI errors.',
    position: 'bottom'
  },
  {
    target: 'tour-market',
    title: '3. Advanced Market View (Roadmap)',
    desc: 'Future Vision: We are integrating multi-asset tracking here. SentinAL will soon monitor correlation between Nifty, Nasdaq, and Crypto to filter false signals.',
    position: 'right'
  },
  {
    target: 'tour-positions',
    title: '4. Audit & Transparency',
    desc: 'Notice the "Source" tag. SentinAL clearly distinguishes between AI-executed trades and Human-executed trades for perfect auditability.',
    position: 'top'
  },
  {
    target: 'nav-sniper',
    title: '5. Human-in-the-Loop',
    desc: 'Let\'s switch views. During high-impact events (like Elections), humans can override the AI using the Sniper Mode.',
    action: 'switch_sniper', // Special action to switch tabs
    position: 'right'
  },
  {
    target: 'tour-override',
    title: '6. Risk Override',
    desc: 'Here, a trader can inject a custom risk limit (e.g., ₹20k) that temporarily supersedes the AI\'s conservative defaults.',
    position: 'left'
  },
  {
    target: 'nav-agent',
    title: '7. Coming Soon: AlphaGPT',
    desc: 'We are currently building the Intelligence Node: A specialized LLM that allows you to chat with your portfolio and get macro analysis in plain English.',
    position: 'right'
  }
];

// --- MOCK DATA GENERATORS ---
const generatePrice = (base, variance) => (base + (Math.random() * variance - variance/2)).toFixed(2);

const INITIAL_LOGS = [
  { agent: 'SYSTEM', message: 'SentinAL Engine v2.0 Initialized...', type: 'info', timestamp: '09:14:55' },
  { agent: 'COMPLIANCE', message: 'F&O Ban List Check: PASSED. 0 stocks in ban.', type: 'compliance', timestamp: '09:15:00' },
  { agent: 'RISK', message: 'Daily Loss Limit set to -₹50,000. Risk Override: DISABLED.', type: 'risk', timestamp: '09:15:01' },
];

const AGENT_MESSAGES = [
  { agent: 'ALPHA', message: 'Scanning BankNifty 15m. Momentum divergence detected.', type: 'alpha' },
  { agent: 'ALPHA', message: 'Proposal: BUY BANKNIFTY 47500 CE @ 340. Stop: 300. Target: 420.', type: 'alpha' },
  { agent: 'RISK', message: 'Analyzing Proposal... Volatility Check (VIX 14.5): PASS.', type: 'risk' },
  { agent: 'RISK', message: 'Calculated Risk: ₹600. Account Limit: ₹5000.', type: 'risk' },
  { agent: 'RISK', message: 'APPROVED. Sizing allowed: 8 lots.', type: 'risk_approved' },
  { agent: 'EXECUTION', message: 'Order Filled: 8 Lots BN 47500 CE @ 341.20.', type: 'execution' },
];

export default function SentinALDashboard() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('commander'); 
  const [pnl, setPnl] = useState(12450);
  const [riskUsed, setRiskUsed] = useState(24);
  const [nifty, setNifty] = useState(21450);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isKillSwitched, setIsKillSwitched] = useState(false);
  const [riskOverride, setRiskOverride] = useState(5000);
  const logsEndRef = useRef(null);

  // --- TOUR STATE ---
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // --- HELPERS ---
  const startTour = () => {
    setShowWelcome(false);
    setTourActive(true);
    setTourStep(0);
    setActiveTab('commander'); // Reset to main view
  };

  const nextStep = () => {
    const nextIdx = tourStep + 1;
    if (nextIdx < TOUR_STEPS.length) {
      const stepData = TOUR_STEPS[nextIdx];
      // Handle tab switching logic
      if (stepData.action === 'switch_sniper') setActiveTab('sniper');
      setTourStep(nextIdx);
    } else {
      setTourActive(false);
      setActiveTab('commander');
    }
  };

  const getSpotlightClass = (id) => {
    if (!tourActive) return '';
    return TOUR_STEPS[tourStep].target === id ? 'relative z-[60] ring-4 ring-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] bg-slate-900' : '';
  };

  // --- SIMULATION EFFECTS ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (isKillSwitched) return;
      setNifty(prev => parseFloat(generatePrice(prev, 5)));
      setPnl(prev => parseFloat(generatePrice(prev, 100)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isKillSwitched]);

  // --- RENDER HELPERS ---
  const getLogColor = (type) => {
    switch(type) {
      case 'alpha': return 'text-purple-400';
      case 'risk': return 'text-amber-400';
      case 'risk_approved': return 'text-green-400 font-bold';
      case 'execution': return 'text-emerald-400 bg-emerald-950/30 px-2 rounded';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30 relative">
      
      {/* --- WELCOME MODAL --- */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-500/30">
               <Bot size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to SentinAL</h1>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              The Multi-Agent Governance Ecosystem. <br/>
              Experience the logic, safety protocols, and future vision of algorithmic trading.
            </p>
            <div className="flex gap-3 flex-col">
              <button onClick={startTour} className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20">
                <Play size={16} fill="white" /> Start Interactive Tour
              </button>
              <button onClick={() => setShowWelcome(false)} className="text-slate-500 hover:text-white py-2 text-xs font-bold">
                Skip Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOUR TOOLTIP CARD --- */}
      {tourActive && (
        <div className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center">
             {/* We center it purely for simplicity in this React implementation, usually libraries position it absolutely. 
                 To make it clean, we put a floating card at bottom center which is safer for all screen sizes. */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 bg-slate-900/95 border border-blue-500/50 p-6 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto animate-in slide-in-from-bottom-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Product Tour • Step {tourStep + 1}/{TOUR_STEPS.length}</span>
                    <button onClick={() => setTourActive(false)} className="text-slate-500 hover:text-white"><X size={14}/></button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{TOUR_STEPS[tourStep].title}</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">{TOUR_STEPS[tourStep].desc}</p>
                <div className="flex justify-end">
                    <button onClick={nextStep} className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 flex items-center gap-2">
                        {tourStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
                    </button>
                </div>
             </div>
        </div>
      )}

      {/* --- GLOBAL HUD --- */}
      <header className={`h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 transition-all ${getSpotlightClass('tour-killswitch')}`}>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 rounded shadow-lg shadow-blue-900/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-slate-100 leading-tight">SENTIN<span className="text-blue-500">AL</span></h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isKillSwitched ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-medium tracking-widest">SYSTEM LIVE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-8 bg-slate-950/50 border border-slate-800 px-8 py-2 rounded-full shadow-inner">
             <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Net P&L</span>
                <span className="font-mono text-xl font-bold text-emerald-400">+₹{pnl.toLocaleString()}</span>
             </div>
             <div className="w-px h-8 bg-slate-800"></div>
             <div className="text-center">
                 <span className="text-[10px] text-slate-500 uppercase font-bold">Risk Used</span>
                 <span className="font-mono text-xl font-bold text-amber-400">{riskUsed}%</span>
             </div>
           </div>
           
           <div id="tour-killswitch" className={`rounded transition-all ${getSpotlightClass('tour-killswitch')}`}>
             <button 
                onClick={() => setIsKillSwitched(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500 flex items-center gap-2"
             >
               <Zap size={16} fill="white" /> KILL SWITCH
             </button>
           </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <nav className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-4 shrink-0 z-40">
          <NavButton id="nav-commander" icon={<LayoutDashboard />} label="Cmdr" active={activeTab === 'commander'} onClick={() => setActiveTab('commander')} />
          <NavButton id="nav-agent" icon={<Terminal />} label="Agents" active={activeTab === 'agent'} onClick={() => setActiveTab('agent')} spotlight={getSpotlightClass('nav-agent')} />
          <NavButton id="nav-sniper" icon={<Crosshair />} label="Sniper" active={activeTab === 'sniper'} onClick={() => setActiveTab('sniper')} spotlight={getSpotlightClass('nav-sniper')} />
          <div className="flex-1"></div>
          <NavButton icon={<Settings />} label="Settings" active={false} />
        </nav>

        {/* WORKSPACE */}
        <main className="flex-1 bg-slate-950 p-6 overflow-hidden relative">
          
          {/* TAB: COMMANDER VIEW */}
          {activeTab === 'commander' && (
            <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full animate-in fade-in duration-300">
              
              {/* Market Watch */}
              <div id="tour-market" className={`col-span-3 row-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden group ${getSpotlightClass('tour-market')}`}>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={14} /> Market Watch
                </h3>
                <div className="space-y-6">
                  <TickerRow name="NIFTY 50" price={nifty} change={0.45} />
                  <TickerRow name="BANK NIFTY" price={47890} change={-0.12} />
                  <div className="h-px bg-slate-800"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">INDIA VIX</span>
                    <span className="font-mono font-bold text-lg text-amber-500">14.20</span>
                  </div>
                </div>
              </div>

              {/* Positions */}
              <div id="tour-positions" className={`col-span-9 row-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-0 flex flex-col overflow-hidden ${getSpotlightClass('tour-positions')}`}>
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Positions</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/50 text-slate-500">
                    <tr><th className="p-4">Instrument</th><th className="p-4">Source</th><th className="p-4 text-right">P&L</th></tr>
                  </thead>
                  <tbody className="font-mono text-slate-300">
                    <tr className="border-b border-slate-800/50"><td className="p-4 font-bold">BANKNIFTY 47500 CE</td><td className="p-4"><Badge type="alpha">ALPHA_BOT</Badge></td><td className="p-4 text-right text-emerald-400">+₹4,500.00</td></tr>
                    <tr><td className="p-4 font-bold">RELIANCE FUT</td><td className="p-4"><Badge type="manual">MANUAL</Badge></td><td className="p-4 text-right text-red-400">-₹1,200.00</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Neural Stream (Mini) */}
              <div id="tour-neural" className={`col-span-12 row-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col ${getSpotlightClass('tour-neural')}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                       <Terminal size={14} /> Live Agent Operations
                    </h3>
                    <span className="text-[10px] text-green-500 font-mono animate-pulse">● ONLINE</span>
                </div>
                <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2 custom-scrollbar">
                   {logs.slice(-6).map((log, i) => (
                      <div key={i} className="flex gap-3 py-1 border-b border-slate-800/50 last:border-0">
                        <span className="text-slate-600 shrink-0 w-16">{log.timestamp}</span>
                        <span className={`font-bold shrink-0 w-24 ${log.agent === 'RISK' ? 'text-amber-500' : log.agent === 'ALPHA' ? 'text-purple-500' : 'text-blue-400'}`}>[{log.agent}]</span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SNIPER (MANUAL) */}
          {activeTab === 'sniper' && (
            <div className="h-full grid grid-cols-2 gap-6 animate-in zoom-in-95 duration-200">
               {/* Manual Entry */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Crosshair className="text-red-500" /> Manual Order Entry
                  </h3>
                  <div className="space-y-6 opacity-50 pointer-events-none">
                    <div className="h-10 bg-slate-800 rounded"></div>
                    <div className="grid grid-cols-2 gap-4"><div className="h-10 bg-slate-800 rounded"></div><div className="h-10 bg-slate-800 rounded"></div></div>
                  </div>
               </div>

               {/* Risk Override Panel */}
               <div id="tour-override" className={`bg-slate-900 border border-slate-800 rounded-xl p-8 ${getSpotlightClass('tour-override')}`}>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Settings className="text-blue-500" /> Risk Override Parameters
                  </h3>
                  <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-slate-400 font-bold">Max Risk Per Trade</label>
                      <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">Active</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <input type="number" value={riskOverride} readOnly className="w-full bg-slate-900 border border-slate-700 rounded p-4 pl-8 text-2xl font-mono font-bold text-white" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Standard Limit: ₹5,000. Override active.</p>
                  </div>
               </div>
            </div>
          )}
          
          {/* TAB: AGENT (Placeholder for tour) */}
          {activeTab === 'agent' && (
             <div className="flex items-center justify-center h-full text-slate-500">Agent Details View</div>
          )}

        </main>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
const NavButton = ({ id, icon, label, active, onClick, spotlight }) => (
  <button 
    id={id}
    onClick={onClick}
    className={`p-3 rounded-xl transition-all duration-200 group relative ${spotlight} ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {label}
    </span>
  </button>
);

const TickerRow = ({ name, price, change }) => (
  <div className="flex justify-between items-end">
    <div><p className="text-xs font-bold text-slate-500 mb-1">{name}</p><p className="text-xl font-mono font-bold text-slate-200">{price.toLocaleString()}</p></div>
    <div className={`font-mono text-sm font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{change >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {change}%</div>
  </div>
);

const Badge = ({ type, children }) => {
  const styles = type === 'alpha' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styles}`}>{children}</span>;
}
