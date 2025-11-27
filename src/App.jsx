import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Crosshair, 
  Settings, 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Lock,
  Unlock,
  Zap
} from 'lucide-react';

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
  { agent: 'RISK', message: 'Calculating Sizing... Risk per lot: ₹600. Account Risk Limit: ₹5000.', type: 'risk' },
  { agent: 'RISK', message: 'APPROVED. Sizing allowed: 8 lots.', type: 'risk_approved' },
  { agent: 'COMPLIANCE', message: 'OTR Ratio 12.5. Margin Check Passed. Forwarding to Gateway.', type: 'compliance' },
  { agent: 'EXECUTION', message: 'Order Filled: 8 Lots BN 47500 CE @ 341.20.', type: 'execution' },
  { agent: 'ALPHA', message: 'Trade Active. Trailing SL activated at 310.', type: 'alpha' },
  { agent: 'RISK', message: 'Drawdown Warning! MTM dropped by 0.5% in 1 minute.', type: 'risk_warning' },
];

export default function SentinALDashboard() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('commander'); // 'commander', 'agent', 'sniper'
  const [pnl, setPnl] = useState(12450);
  const [riskUsed, setRiskUsed] = useState(24);
  const [nifty, setNifty] = useState(21450);
  const [bankNifty, setBankNifty] = useState(47890);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isKillSwitched, setIsKillSwitched] = useState(false);
  const [riskOverride, setRiskOverride] = useState(5000);
  const [isSandbox, setIsSandbox] = useState(false);
  const logsEndRef = useRef(null);

  // --- SIMULATION EFFECTS ---

  // 1. Market Data Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (isKillSwitched) return;
      setNifty(prev => parseFloat(generatePrice(prev, 5)));
      setBankNifty(prev => parseFloat(generatePrice(prev, 15)));
      setPnl(prev => parseFloat(generatePrice(prev, 100)));
      setRiskUsed(prev => Math.min(100, Math.max(0, prev + (Math.random() * 2 - 1))));
    }, 1000);
    return () => clearInterval(interval);
  }, [isKillSwitched]);

  // 2. Agent Chat Simulation
  useEffect(() => {
    if (isKillSwitched) return;
    const interval = setInterval(() => {
      const randomMsg = AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)];
      const newLog = { 
        ...randomMsg, 
        timestamp: new Date().toLocaleTimeString([], { hour12: false }) 
      };
      setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50
    }, 3500);
    return () => clearInterval(interval);
  }, [isKillSwitched]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- HANDLERS ---
  const handleKillSwitch = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to activate the KILL SWITCH? This will square off all positions immediately.")) {
      setIsKillSwitched(true);
      setLogs(prev => [...prev, { 
        agent: 'SYSTEM', 
        message: '!!! KILL SWITCH ACTIVATED BY USER. HALTING ALL AGENTS. !!!', 
        type: 'critical', 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    }
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'alpha': return 'text-purple-400';
      case 'risk': return 'text-amber-400';
      case 'risk_approved': return 'text-green-400 font-bold';
      case 'risk_warning': return 'text-orange-500 font-bold';
      case 'compliance': return 'text-cyan-400';
      case 'execution': return 'text-emerald-400 bg-emerald-950/30 px-2 rounded';
      case 'critical': return 'text-red-500 font-bold bg-red-950/50 px-2 animate-pulse';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- GLOBAL HUD --- */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-slate-100 leading-tight">SENTIN<span className="text-blue-500">AL</span></h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isKillSwitched ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isKillSwitched ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-medium tracking-widest">{isKillSwitched ? 'SYSTEM HALTED' : 'SYSTEM LIVE'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 bg-slate-950/50 border border-slate-800 px-8 py-2 rounded-full shadow-inner">
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Net P&L</span>
            <span className={`font-mono text-xl font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="flex flex-col items-center min-w-[100px]">
             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Risk Used</span>
             <div className="flex items-center gap-2">
                <span className={`font-mono text-xl font-bold ${riskUsed > 80 ? 'text-red-500' : 'text-amber-400'}`}>
                  {riskUsed.toFixed(1)}%
                </span>
                <Activity className="w-4 h-4 text-slate-600" />
             </div>
          </div>
        </div>

        <button 
          onClick={handleKillSwitch}
          disabled={isKillSwitched}
          className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition-all shadow-lg 
            ${isKillSwitched 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20 active:scale-95 border border-red-500'
            }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          {isKillSwitched ? 'KILLED' : 'KILL SWITCH'}
        </button>

      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <nav className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-4 shrink-0">
          <NavButton icon={<LayoutDashboard />} label="Cmdr" active={activeTab === 'commander'} onClick={() => setActiveTab('commander')} />
          <NavButton icon={<Terminal />} label="Agents" active={activeTab === 'agent'} onClick={() => setActiveTab('agent')} />
          <NavButton icon={<Crosshair />} label="Sniper" active={activeTab === 'sniper'} onClick={() => setActiveTab('sniper')} />
          <div className="flex-1"></div>
          <NavButton icon={<Settings />} label="Settings" active={false} />
        </nav>

        {/* WORKSPACE */}
        <main className="flex-1 bg-slate-950 p-6 overflow-hidden relative">
          
          {/* TAB: COMMANDER VIEW */}
          {activeTab === 'commander' && (
            <div className="grid grid-cols-12 grid-rows-6 gap-6 h-full animate-in fade-in duration-300">
              
              {/* Market Watch */}
              <div className="col-span-3 row-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp size={48} />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={14} /> Market Watch
                </h3>
                <div className="space-y-6">
                  <TickerRow name="NIFTY 50" price={nifty} change={0.45} />
                  <TickerRow name="BANK NIFTY" price={bankNifty} change={-0.12} />
                  <div className="h-px bg-slate-800"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">INDIA VIX</span>
                    <span className="font-mono text-amber-400 font-bold text-lg">14.20</span>
                  </div>
                </div>
              </div>

              {/* Positions */}
              <div className="col-span-9 row-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-0 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Positions</h3>
                  <span className="text-xs text-slate-500">2 Open / 5 Limit</span>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 text-slate-500">
                      <tr>
                        <th className="p-4 font-medium">Instrument</th>
                        <th className="p-4 font-medium">Source</th>
                        <th className="p-4 font-medium text-right">Qty</th>
                        <th className="p-4 font-medium text-right">LTP</th>
                        <th className="p-4 font-medium text-right">P&L</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-slate-200 font-bold">BANKNIFTY 47500 CE</td>
                        <td className="p-4"><Badge type="alpha">ALPHA</Badge></td>
                        <td className="p-4 text-right">200</td>
                        <td className="p-4 text-right text-emerald-400">345.20</td>
                        <td className="p-4 text-right text-emerald-400 font-bold">+₹4,500.00</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-slate-200 font-bold">RELIANCE FUT</td>
                        <td className="p-4"><Badge type="manual">MANUAL</Badge></td>
                        <td className="p-4 text-right">500</td>
                        <td className="p-4 text-right text-red-400">2,450.00</td>
                        <td className="p-4 text-right text-red-400 font-bold">-₹1,200.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Neural Stream (Mini) */}
              <div className="col-span-12 row-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Terminal size={14} className="text-blue-500" /> Live Agent Operations
                </h3>
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

          {/* TAB: AGENT VIEW */}
          {activeTab === 'agent' && (
            <div className="h-full flex gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                 <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center backdrop-blur">
                    <h3 className="text-blue-400 font-bold flex items-center gap-2">
                      <Terminal size={18} /> NEURAL DECISION STREAM
                    </h3>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-500 font-mono">LIVE FEED</span>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm bg-slate-950/50">
                    {logs.map((log, i) => (
                      <div key={i} className="flex gap-4 group hover:bg-slate-900/50 p-1 rounded transition-colors">
                        <span className="text-slate-600 text-xs py-1 select-none">{log.timestamp}</span>
                        <div className="flex-1 break-words">
                          <span className={`font-bold mr-3 ${log.agent === 'RISK' ? 'text-amber-500' : log.agent === 'ALPHA' ? 'text-purple-500' : log.agent === 'COMPLIANCE' ? 'text-cyan-500' : 'text-slate-400'}`}>
                            {log.agent}:
                          </span>
                          <span className={`${getLogColor(log.type)}`}>{log.message}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                 </div>
              </div>

              {/* Logic Inspector Panel */}
              <div className="w-80 flex flex-col gap-4">
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Risk Logic State</h4>
                    <div className="space-y-4">
                       <LogicItem label="Daily Limit" value="-₹50,000" status="ok" />
                       <LogicItem label="VIX Scaling" value="Active (>14)" status="warn" />
                       <LogicItem label="Drawdown" value="0.4%" status="ok" />
                       <LogicItem label="Ban List" value="Clean" status="ok" />
                    </div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1">
                    <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Rejection Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Risk (Sizing)</span>
                        <span className="text-red-400 font-bold">12</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                        <div className="bg-red-500 w-3/4 h-full"></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-300 mt-2">
                         <span>Compliance (OTR)</span>
                         <span className="text-amber-400 font-bold">2</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                        <div className="bg-amber-500 w-[10%] h-full"></div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* TAB: SNIPER (MANUAL) */}
          {activeTab === 'sniper' && (
            <div className="h-full grid grid-cols-2 gap-6 animate-in zoom-in-95 duration-200">
               {/* Manual Entry Form */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Crosshair className="text-red-500" /> Manual Order Entry
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Instrument</label>
                      <input type="text" value="BANKNIFTY 23FEB 47500 CE" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono focus:border-blue-500 focus:outline-none transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Quantity</label>
                        <input type="number" value="15" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono focus:border-blue-500 focus:outline-none" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Order Type</label>
                         <select className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono focus:border-blue-500 focus:outline-none">
                           <option>LIMIT</option>
                           <option>MARKET</option>
                           <option>SL-M</option>
                         </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">
                         BUY
                       </button>
                       <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded shadow-lg shadow-red-900/20 active:scale-95 transition-all">
                         SELL
                       </button>
                    </div>
                  </div>
               </div>

               {/* Risk Override Panel */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
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
                      <input 
                        type="number" 
                        value={riskOverride}
                        onChange={(e) => setRiskOverride(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-4 pl-8 text-2xl font-mono font-bold text-white focus:border-blue-500 focus:outline-none" 
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Standard Limit: ₹5,000. Your override allows larger position sizing by the Risk Warden.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer" onClick={() => setIsSandbox(!isSandbox)}>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${isSandbox ? 'bg-blue-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isSandbox ? 'left-7' : 'left-1'}`}></div>
                    </div>
                    <div>
                      <p className={`font-bold ${isSandbox ? 'text-blue-400' : 'text-slate-400'}`}>Sandbox Mode</p>
                      <p className="text-xs text-slate-500">Exclude manual trades from Algo Risk Limits</p>
                    </div>
                  </div>

               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all duration-200 group relative ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' 
        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
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
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1">{name}</p>
      <p className="text-xl font-mono font-bold text-slate-200">{price.toLocaleString()}</p>
    </div>
    <div className={`flex items-center gap-1 font-mono text-sm font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {change}%
    </div>
  </div>
);

const Badge = ({ type, children }) => {
  const styles = type === 'alpha' 
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
    : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styles}`}>
      {children}
    </span>
  );
}

const LogicItem = ({ label, value, status }) => (
  <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2 last:border-0">
    <span className="text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-mono text-slate-200">{value}</span>
      {status === 'ok' && <ShieldAlert size={12} className="text-emerald-500" />}
      {status === 'warn' && <AlertTriangle size={12} className="text-amber-500" />}
    </div>
  </div>
);