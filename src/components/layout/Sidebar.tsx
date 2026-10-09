import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Kanban,
  FileCheck2,
  Bot,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { activeTab, setActiveTab, currentUser, switchRole, riskAssessments, logout } = useApp();

  const isTeacher = currentUser.role === 'teacher';
  const highRiskCount = riskAssessments.filter(
    (r) => r.riskLevel === 'high' || r.riskLevel === 'critical'
  ).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Teacher Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Subjects & Projects', icon: FolderGit2 },
    { id: 'kanban', label: 'Group Tasks & Kanban', icon: Kanban },
    { id: 'submissions', label: 'Submissions & Review', icon: FileCheck2 },
    { id: 'ai-assistant', label: 'AI Risk & Assistant', icon: Bot, badge: highRiskCount > 0 ? `${highRiskCount} alerts` : undefined }
  ];

  const studentNavItems: NavItem[] = [
    { id: 'student-portal', label: 'My Project Hub', icon: GraduationCap },
    { id: 'kanban', label: 'Team Kanban Board', icon: Kanban },
    { id: 'submissions', label: 'My Deliverables', icon: FileCheck2 },
    { id: 'ai-assistant', label: 'AI Project Advisor', icon: Sparkles }
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-[#0d1527] text-slate-700 dark:text-slate-300 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 select-none ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-4.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#090f1d]">
            <div
              className="flex items-center gap-3 cursor-pointer overflow-hidden"
              onClick={() => setActiveTab(isTeacher ? 'dashboard' : 'student-portal')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                      Edu<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                      SaaS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    College Project Management
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Current Role Banner */}
          {!collapsed ? (
            <div className="mx-3.5 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isTeacher ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
                  }`}
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {isTeacher ? 'Faculty Portal' : 'Student Portal'}
                </span>
              </div>
              {isTeacher ? (
                <button
                  onClick={() => switchRole('student')}
                  className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  title="Preview student perspective"
                >
                  Preview Student
                </button>
              ) : (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800/80">
                  Role Locked
                </span>
              )}
            </div>
          ) : (
            <div className="flex justify-center my-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isTeacher
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                }`}
                title={isTeacher ? 'Faculty Account' : 'Student Account (Permissions Locked)'}
              >
                {isTeacher ? 'T' : 'S'}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-2.5 space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#090f1d]/50 space-y-2">
          {!collapsed && (
            <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-gradient-to-br dark:from-indigo-950/60 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/40">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continuous Assessment</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Autonomous rubrics & anti-copy telemetry active for 2026-27 batch.
              </p>
            </div>
          )}

          <div
            className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
            )}
            {!collapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">
                    ID: {currentUser.rollNumber || currentUser.collegeId || (currentUser.role === 'teacher' ? 'FAC-CSE-01' : '21CS042')}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                  title="Sign Out / Switch Profile"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
