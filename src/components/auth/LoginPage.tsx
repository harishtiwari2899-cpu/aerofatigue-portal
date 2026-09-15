import React, { useState } from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { UserRole, UserProfile } from '../../types/fatigue';
import { MOCK_PROFILES } from '../../utils/mockData';
import {
  Plane,
  Wrench,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Lock,
  BadgeAlert,
  CheckCircle2,
  Cpu,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, setActiveTab } = useFatigue();
  const [selectedRole, setSelectedRole] = useState<UserRole>('aircrew');
  const [selectedProfileId, setSelectedProfileId] = useState<string>(MOCK_PROFILES[0].id);
  const [badgeId, setBadgeId] = useState<string>('AC-8842');
  const [pinCode, setPinCode] = useState<string>('••••');
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);

  const roleProfiles = MOCK_PROFILES.filter(p => p.role === selectedRole);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const firstForRole = MOCK_PROFILES.find(p => p.role === role);
    if (firstForRole) {
      setSelectedProfileId(firstForRole.id);
      setBadgeId(firstForRole.badgeId);
    }
  };

  const handleProfileSelect = (profile: UserProfile) => {
    setSelectedProfileId(profile.id);
    setBadgeId(profile.badgeId);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = MOCK_PROFILES.find(p => p.id === selectedProfileId) || MOCK_PROFILES.find(p => p.role === selectedRole) || MOCK_PROFILES[0];
    setCurrentUser(profile);
    if (profile.role === 'supervisor') {
      setActiveTab('supervisor');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8 bg-gradient-to-b from-aviation-darkest via-aviation-dark to-aviation-darkest">
      <div className="w-full max-w-4xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-aviation-navy border border-aviation-border shadow-glow-cyan mb-4">
            <Plane className="w-9 h-9 text-aviation-accent transform -rotate-45" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono tracking-wider">
            AERO<span className="text-aviation-accent">FATIGUE</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
            Aviation Fatigue Risk Monitoring System
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>ICAO Annex 6 / FAA AC 120-103A FRMS Standard Architecture</span>
          </div>
        </div>

        {/* Login Container */}
        <div className="bg-aviation-navy/80 border border-aviation-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Step 1: Select Role */}
          <div className="mb-6">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Step 1 — Select Operational User Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aircrew Card */}
              <button
                type="button"
                onClick={() => handleRoleChange('aircrew')}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  selectedRole === 'aircrew'
                    ? 'bg-cyan-500/10 border-aviation-accent ring-1 ring-aviation-accent/50 shadow-glow-cyan/40'
                    : 'bg-aviation-dark/70 border-aviation-border hover:border-aviation-borderLight hover:bg-aviation-card/60'
                }`}
              >
                {selectedRole === 'aircrew' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-aviation-accent" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <Plane className="w-5 h-5 transform -rotate-45" />
                </div>
                <div className="font-bold text-slate-100 text-sm">1. Aircrew</div>
                <div className="text-xs text-slate-400 mt-1">
                  Pilots, First Officers & Helicopter SAR Flight Crew
                </div>
                <div className="mt-3 pt-2 border-t border-aviation-border/60 text-[10px] font-mono text-cyan-400">
                  • Sortie & flight telemetry<br />• Controlled rest protocols
                </div>
              </button>

              {/* Ground Crew Card */}
              <button
                type="button"
                onClick={() => handleRoleChange('ground_crew')}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  selectedRole === 'ground_crew'
                    ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50 shadow-glow-amber/40'
                    : 'bg-aviation-dark/70 border-aviation-border hover:border-aviation-borderLight hover:bg-aviation-card/60'
                }`}
              >
                {selectedRole === 'ground_crew' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-100 text-sm">2. Ground Crew</div>
                <div className="text-xs text-slate-400 mt-1">
                  Line Maintenance, Avionics & Engine Technicians
                </div>
                <div className="mt-3 pt-2 border-t border-aviation-border/60 text-[10px] font-mono text-amber-400">
                  • Overtime & shift fatigue<br />• Physical ergonomic tracking
                </div>
              </button>

              {/* Supervisor Card */}
              <button
                type="button"
                onClick={() => handleRoleChange('supervisor')}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  selectedRole === 'supervisor'
                    ? 'bg-emerald-500/10 border-emerald-400 ring-1 ring-emerald-400/50 shadow-glow-green/40'
                    : 'bg-aviation-dark/70 border-aviation-border hover:border-aviation-borderLight hover:bg-aviation-card/60'
                }`}
              >
                {selectedRole === 'supervisor' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-100 text-sm">3. Supervisor / Admin</div>
                <div className="text-xs text-slate-400 mt-1">
                  Flight Ops Leads, FRMS Officers & Chief Pilots
                </div>
                <div className="mt-3 pt-2 border-t border-aviation-border/60 text-[10px] font-mono text-emerald-400">
                  • Fleet risk distribution<br />• Anonymized mitigation actions
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Quick Persona Switcher / Credentials */}
          <div className="pt-4 border-t border-aviation-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Step 2 — Select Personnel Profile or Enter Duty Credentials
              </label>
              <span className="text-[11px] text-aviation-accent">
                1-Click Demo Profiles Available
              </span>
            </div>

            {/* Quick Profile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {roleProfiles.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProfileSelect(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    selectedProfileId === p.id
                      ? 'bg-aviation-card border-aviation-accent text-slate-100 shadow-sm'
                      : 'bg-aviation-darkest/70 border-aviation-border/60 text-slate-300 hover:bg-aviation-dark'
                  }`}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover ring-1 ring-aviation-border"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.roleTitle}</div>
                    <div className="text-[9px] font-mono text-aviation-accent">{p.badgeId} • {p.baseStation.split(' ')[0]}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Aviation Crew / Tech Badge ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={badgeId}
                      onChange={e => setBadgeId(e.target.value)}
                      required
                      className="cockpit-input w-full pl-9 font-mono"
                      placeholder="e.g. AC-8842"
                    />
                    <BadgeAlert className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Security Duty PIN / SSO Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={pinCode}
                      onChange={e => setPinCode(e.target.value)}
                      required
                      className="cockpit-input w-full pl-9 font-mono"
                      placeholder="4-digit PIN"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={e => setRememberDevice(e.target.checked)}
                    className="rounded bg-aviation-darkest border-aviation-border text-aviation-accent focus:ring-0"
                  />
                  <span>Remember this duty tablet / terminal</span>
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  Encrypted TLS 1.3
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2 mt-4"
              >
                <UserCheck className="w-5 h-5" />
                <span>ACCESS {selectedRole.toUpperCase().replace('_', ' ')} DASHBOARD</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        </div>

        {/* Safety Disclaimer Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p>
            AeroFatigue is a specialized operational decision-support tool. It does not provide medical diagnosis.
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Designed for commercial airline & helicopter operations, military flight safety, and line maintenance engineering.
          </p>
        </div>
      </div>
    </div>
  );
};
