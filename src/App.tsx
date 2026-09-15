import React from 'react';
import { FatigueProvider, useFatigue } from './context/FatigueContext';
import { Navbar } from './components/common/Navbar';
import { LoginPage } from './components/auth/LoginPage';
import { PersonalDashboard } from './components/dashboard/PersonalDashboard';
import { AircrewCheckin } from './components/checkin/AircrewCheckin';
import { GroundCrewCheckin } from './components/checkin/GroundCrewCheckin';
import { RiskResultView } from './components/result/RiskResultView';
import { FatigueHistory } from './components/history/FatigueHistory';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { FutureSensorsHub } from './components/future/FutureSensorsHub';
import { ShieldCheck, Radio, Plane, Smartphone } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, currentUser } = useFatigue();

  if (activeTab === 'login') {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-aviation-darkest flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <PersonalDashboard />}

        {activeTab === 'checkin' && (
          currentUser.role === 'ground_crew' ? <GroundCrewCheckin /> : <AircrewCheckin />
        )}

        {activeTab === 'result' && <RiskResultView />}

        {activeTab === 'history' && <FatigueHistory />}

        {activeTab === 'supervisor' && <SupervisorDashboard />}

        {activeTab === 'future_sensors' && <FutureSensorsHub />}
      </main>

      {/* Global Aviation Operations Footer */}
      <footer className="border-t border-aviation-border/60 bg-aviation-dark/80 py-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-aviation-accent" />
            <span className="font-bold text-slate-200">AeroFatigue</span>
            <span>— Aviation Fatigue Risk Monitoring System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>TLS Encrypted Roster Sync</span>
            </span>
            <span>•</span>
            <span>ICAO / FAA FRMS Decision Support</span>
            <span>•</span>
            <span className="text-slate-500">v2.4.0 (Build 2026.08)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <FatigueProvider>
      <MainContent />
    </FatigueProvider>
  );
}

export default App;
