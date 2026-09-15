import React, { useState } from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { UserRole } from '../../types/fatigue';
import {
  Plane,
  Wrench,
  ShieldCheck,
  ClipboardCheck,
  LayoutDashboard,
  History,
  Users,
  Activity,
  LogOut,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Gauge
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    switchRole,
    allProfiles,
    activeTab,
    setActiveTab,
    resetAllDemoData,
    latestUserRecord
  } = useFatigue();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'aircrew':
        return <Plane className="w-4 h-4 text-aviation-accent" />;
      case 'ground_crew':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'supervisor':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'aircrew':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Aircrew</span>;
      case 'ground_crew':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Ground Crew</span>;
      case 'supervisor':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Supervisor</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-aviation-darkest/95 backdrop-blur-md border-b border-aviation-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(currentUser.role === 'supervisor' ? 'supervisor' : 'dashboard')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-aviation-card to-aviation-navy border border-aviation-border flex items-center justify-center shadow-glow-cyan/30 group">
              <Plane className="w-6 h-6 text-aviation-accent transform -rotate-45 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-aviation-darkest animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-slate-100 font-mono">
                  AERO<span className="text-aviation-accent">FATIGUE</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-aviation-navy text-slate-400 border border-aviation-border">
                  FRMS v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden md:block">
                Aviation Fatigue Risk Monitoring System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-aviation-dark/80 p-1 rounded-xl border border-aviation-border">
            {currentUser.role !== 'supervisor' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-aviation-accent text-aviation-darkest shadow-glow-cyan'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-aviation-card/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Personal Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('checkin')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'checkin' || activeTab === 'result'
                      ? 'bg-aviation-accent text-aviation-darkest shadow-glow-cyan'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-aviation-card/60'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Daily Check-In</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-aviation-accent text-aviation-darkest shadow-glow-cyan'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-aviation-card/60'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Fatigue History</span>
                </button>
              </>
            )}

            {currentUser.role === 'supervisor' && (
              <>
                <button
                  onClick={() => setActiveTab('supervisor')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'supervisor'
                      ? 'bg-aviation-accent text-aviation-darkest shadow-glow-cyan'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-aviation-card/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Supervisor Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-aviation-accent text-aviation-darkest shadow-glow-cyan'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-aviation-card/60'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Squadron Logs</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('future_sensors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'future_sensors'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-aviation-card/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sensors & PVT</span>
              <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">LAB</span>
            </button>
          </nav>

          {/* Right Profile / Quick Switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Status Pill */}
            {currentUser.role !== 'supervisor' && latestUserRecord && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-aviation-navy border border-aviation-border rounded-lg text-xs">
                <span className="text-slate-400 text-[11px]">Today:</span>
                <span className="font-mono font-bold text-slate-200">{latestUserRecord.score}/100</span>
                <span className={`w-2 h-2 rounded-full ${
                  latestUserRecord.category === 'LOW' ? 'bg-emerald-400' :
                  latestUserRecord.category === 'MODERATE' ? 'bg-amber-400' :
                  latestUserRecord.category === 'HIGH' ? 'bg-orange-400' : 'bg-rose-500 animate-ping'
                }`} />
              </div>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-aviation-navy/90 hover:bg-aviation-card border border-aviation-border hover:border-aviation-borderLight transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-aviation-accent/50"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {currentUser.badgeId}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-aviation-darkest border border-aviation-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-aviation-navy/90 border-b border-aviation-border">
                    <div className="flex items-center gap-2 mb-1.5">
                      {getRoleBadge(currentUser.role)}
                      <span className="text-[11px] font-mono text-slate-400">{currentUser.baseStation}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-100">{currentUser.name}</div>
                    <div className="text-xs text-slate-400">{currentUser.roleTitle}</div>
                    <div className="text-[11px] text-aviation-accent font-mono mt-1">
                      Unit: {currentUser.fleetOrUnit}
                    </div>
                  </div>

                  {/* Switch Demo Persona */}
                  <div className="p-2 border-b border-aviation-border/60">
                    <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1">
                      Switch Active Persona / Role
                    </div>
                    <div className="space-y-1 max-h-56 overflow-y-auto">
                      {allProfiles.map(profile => (
                        <button
                          key={profile.id}
                          onClick={() => {
                            setCurrentUser(profile);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                            profile.id === currentUser.id
                              ? 'bg-aviation-accent/15 text-aviation-accent border border-aviation-accent/30 font-semibold'
                              : 'hover:bg-aviation-card text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={profile.avatar}
                              alt={profile.name}
                              className="w-6 h-6 rounded-md object-cover"
                            />
                            <div>
                              <div className="text-xs leading-none font-medium">{profile.name}</div>
                              <div className="text-[10px] text-slate-400 capitalize">{profile.role.replace('_', ' ')}</div>
                            </div>
                          </div>
                          {getRoleIcon(profile.role)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-2 bg-aviation-dark space-y-1">
                    <button
                      onClick={() => {
                        resetAllDemoData();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-aviation-card rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset to Clean Demo Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Role Selection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-aviation-border/60 text-xs">
          {currentUser.role !== 'supervisor' ? (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-[10px]">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('checkin')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'checkin' || activeTab === 'result' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span className="text-[10px]">Check-In</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <History className="w-4 h-4" />
                <span className="text-[10px]">History</span>
              </button>
              <button
                onClick={() => setActiveTab('future_sensors')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'future_sensors' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-[10px]">Sensors</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('supervisor')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'supervisor' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <Users className="w-4 h-4" />
                <span className="text-[10px]">Supervisor</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <History className="w-4 h-4" />
                <span className="text-[10px]">History</span>
              </button>
              <button
                onClick={() => setActiveTab('future_sensors')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'future_sensors' ? 'text-aviation-accent' : 'text-slate-400'}`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-[10px]">Sensors</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
