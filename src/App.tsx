import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { KanbanPage } from './pages/KanbanPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

const AppContent: React.FC = () => {
  const { activeTab, currentUser, isAuthenticated, setIsAuthenticated } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewState, setViewState] = useState<'app' | 'landing' | 'login'>(
    isAuthenticated ? 'app' : 'login'
  );

  // If user signed out, route to login page
  if (!isAuthenticated && viewState === 'app') {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setViewState('app');
        }}
        onGoToLanding={() => setViewState('landing')}
      />
    );
  }

  if (viewState === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          setIsAuthenticated(true);
          setViewState('app');
        }}
        onOpenLogin={() => setViewState('login')}
      />
    );
  }

  if (viewState === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setViewState('app');
        }}
        onGoToLanding={() => setViewState('landing')}
      />
    );
  }

  const renderActivePage = () => {
    if (currentUser.role === 'student' && activeTab === 'student-portal') {
      return <StudentDashboard />;
    }

    switch (activeTab) {
      case 'dashboard':
        return currentUser.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
      case 'student-portal':
        return <StudentDashboard />;
      case 'projects':
        return <ProjectsPage />;
      case 'kanban':
        return <KanbanPage />;
      case 'submissions':
        return <SubmissionsPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      default:
        return currentUser.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
