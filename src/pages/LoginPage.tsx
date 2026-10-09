import React, { useState } from 'react';
import {
  GraduationCap,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  UserPlus,
  BadgeCheck,
  Building2,
  CheckCircle2,
  IdCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectNexus3D } from '../components/3d/ProjectNexus3D';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onGoToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToLanding }) => {
  const { allUsers, selectUser, registerUser, theme, toggleTheme } = useApp();

  const [activeTab, setActiveTab] = useState<'demo' | 'signin' | 'register'>('demo');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('teacher');
  const [email, setEmail] = useState('sharma.cse@engg.edu.in');
  const [password, setPassword] = useState('Prof@Sharma2026');
  const [showPassword, setShowPassword] = useState(false);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regId, setRegId] = useState(''); // College ID / Roll No / Faculty ID
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regRole, setRegRole] = useState<'teacher' | 'student'>('student');
  const [regSemester, setRegSemester] = useState('Semester VI');
  const [regDesignation, setRegDesignation] = useState('Assistant Professor');

  // Launching splash card state for real-time confirmation of the registered ID
  const [launchingUser, setLaunchingUser] = useState<{
    name: string;
    role: string;
    id: string;
    department: string;
  } | null>(null);

  const handleSelectDemo = (user: typeof allUsers[0]) => {
    setLaunchingUser({
      name: user.name,
      role: user.role === 'teacher' ? 'Faculty In-Charge' : 'Student',
      id: user.rollNumber || user.collegeId || (user.role === 'teacher' ? 'FAC-CSE-01' : '21CS042'),
      department: user.department
    });

    setTimeout(() => {
      selectUser(user.id);
      onLoginSuccess();
    }, 700);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser =
      allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
      (selectedRole === 'teacher'
        ? allUsers.find((u) => u.role === 'teacher') || allUsers[0]
        : allUsers.find((u) => u.role === 'student') || allUsers[1]);

    setLaunchingUser({
      name: matchedUser.name,
      role: matchedUser.role === 'teacher' ? 'Faculty In-Charge' : 'Student',
      id: matchedUser.rollNumber || matchedUser.collegeId || (matchedUser.role === 'teacher' ? 'FAC-CSE-01' : '21CS042'),
      department: matchedUser.department
    });

    setTimeout(() => {
      selectUser(matchedUser.id);
      onLoginSuccess();
    }, 700);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const assignedId =
      regId.trim() || (regRole === 'student' ? '21CS108' : 'FAC-CSE-09');

    const newUser = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      department: regDept,
      rollNumber: regRole === 'student' ? assignedId : undefined,
      collegeId: assignedId,
      semester: regRole === 'student' ? regSemester : undefined,
      designation: regRole === 'teacher' ? regDesignation : undefined
    });

    setLaunchingUser({
      name: newUser.name,
      role: newUser.role === 'teacher' ? 'Faculty In-Charge' : 'Student',
      id: assignedId,
      department: newUser.department
    });

    setTimeout(() => {
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Launching Overlay when account is selected or registered */}
      {launchingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              <BadgeCheck className="w-9 h-9 text-emerald-500 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Identity Verified • Launching Workspace
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {launchingUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {launchingUser.department}
              </p>
            </div>

            {/* Prominent Verified ID Card Display */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  Assigned College ID:
                </span>
                <span className="font-mono font-black text-indigo-700 dark:text-indigo-300 text-sm px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800">
                  {launchingUser.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  Portal Role:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {launchingUser.role}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Configuring telemetry nodes and opening workspace...</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between">
        <div
          onClick={onGoToLanding}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Edu<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onGoToLanding}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Landing Overview
          </button>
        </div>
      </header>

      {/* Main Grid: 3D Model Telemetry + Authentication Card */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (5 Cols): Interactive 3D Model & College Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Multi-Model 3D Telemetry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive 3D Project Nexus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Interact with the 3D model below: switch modes (Architecture, Velocity Helix, Risk Radar), rotate 360°, and click nodes to inspect live telemetry.
            </p>
          </div>

          {/* Interactive 3D Canvas */}
          <ProjectNexus3D height="370px" initialMode="architecture" />

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Role-Enforced Permissions Active</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Faculty accounts possess rubric and viva evaluation rights. Student accounts are partitioned strictly to assigned team repositories and personal Kanban tasks.
            </p>
          </div>
        </div>

        {/* Right Column (7 Cols): Authentication Card */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Academic Portal Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select an existing college account or register a new account with your College ID to launch your workspace.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'demo'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Available Accounts ({allUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Register New Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In With Password
              </button>
            </div>

            {/* TAB 1: Accounts List (includes newly registered accounts prominently!) */}
            {activeTab === 'demo' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Click Any Account to Launch Directly with Verified ID:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {allUsers.map((user, idx) => {
                    const isFaculty = user.role === 'teacher';
                    const isNew = idx === 0 && user.id.startsWith('usr_') && !['usr_t1', 'usr_s1', 'usr_s2', 'usr_s3'].includes(user.id);
                    const userDisplayId =
                      user.rollNumber || user.collegeId || (isFaculty ? 'FAC-CSE-01' : '21CS042');

                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectDemo(user)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group shadow-2xs relative ${
                          isNew
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-600 ring-2 ring-indigo-500/30'
                            : 'bg-slate-50/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-900'
                        }`}
                      >
                        {isNew && (
                          <span className="absolute -top-2.5 right-3 text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Newly Registered</span>
                          </span>
                        )}

                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              isFaculty
                                ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                            }`}
                          >
                            {isFaculty ? 'FACULTY IN-CHARGE' : 'STUDENT'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                            {user.name}
                          </h4>
                          {/* Prominent Verified ID Tag */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              ID: {userDisplayId}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate">
                              • {user.department.replace('Computer Science & Engineering', 'CSE')}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {isFaculty
                            ? 'Configure rubrics, evaluate milestones, and review risk alerts.'
                            : `Assigned capstone group. Track Kanban tasks and turn in project milestones.`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Register Account */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g., Ananya Deshmukh"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Role *
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="student">Student / Group Member</option>
                      <option value="teacher">Faculty In-Charge / Guide</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                      College Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g., ananya.21cs108@engg.edu.in"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Explicit College ID / Roll Number Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <IdCard className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{regRole === 'student' ? 'Student Roll Number / College ID *' : 'Faculty Employee ID *'}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      placeholder={regRole === 'student' ? 'e.g., 21CS108' : 'e.g., FAC-CSE-09'}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <select
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  {regRole === 'student' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Current Semester
                      </label>
                      <select
                        value={regSemester}
                        onChange={(e) => setRegSemester(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Semester VI">Semester VI (Phase I Capstone)</option>
                        <option value="Semester VII">Semester VII (Phase II Capstone)</option>
                        <option value="Semester VIII">Semester VIII (Final Viva)</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Academic Designation
                      </label>
                      <select
                        value={regDesignation}
                        onChange={(e) => setRegDesignation(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
                      >
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor & Project Coordinator">Professor & Project Coordinator</option>
                        <option value="Head of Department">Head of Department</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Registering will automatically enroll this ID into the active Capstone Project workspace with dedicated telemetry.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Launch My Project Portal</span>
                </button>
              </form>
            )}

            {/* TAB 3: Standard Sign In */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Select Your Role *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('teacher');
                        setEmail('sharma.cse@engg.edu.in');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        selectedRole === 'teacher'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Faculty / Teacher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('student');
                        setEmail('aditya.21cs042@engg.edu.in');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        selectedRole === 'student'
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student / Scholar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    College Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., sharma.cse@engg.edu.in"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Password *</span>
                    <button
                      type="button"
                      onClick={() => alert('Demo password is reset to: EduFlow@2026')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Authorize & Launch Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
