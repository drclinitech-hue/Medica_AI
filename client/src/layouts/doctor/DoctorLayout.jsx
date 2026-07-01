import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, User, Activity, Settings, ShieldAlert,
  LogOut, Menu, Bell, Search, ChevronLeft 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const DOCTOR_LINKS = [
  { path: '/doctor', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/doctor/appointments', name: 'Appointments', icon: Calendar },
  { path: '/doctor/profile', name: 'My Profile', icon: User },
  { path: '/doctor/settings', name: 'Settings', icon: Settings },
];

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not doctor
  if (user && user.role !== 'doctor') {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center p-8 border rounded-2xl bg-card shadow-2xl">
          <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have permission to view the Doctor Panel.</p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground selection:bg-primary/20">
      
      {/* Sidebar */}
      <aside 
        className={`relative z-20 flex-shrink-0 transition-all duration-300 ease-in-out bg-card border-r shadow-lg flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className={`flex items-center gap-2 overflow-hidden transition-all ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <Activity className="h-6 w-6 text-primary shrink-0" />
            <span className="font-black tracking-tight whitespace-nowrap">Doctor Portal</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            {sidebarOpen ? <ChevronLeft className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 hide-scrollbar flex flex-col gap-1 px-3">
          {DOCTOR_LINKS.map(link => {
            const isActive = location.pathname === link.path || (link.path !== '/doctor' && location.pathname.startsWith(link.path));
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={!sidebarOpen ? link.name : ''}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden'}`}>
                  {link.name}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100 inline-block' : 'opacity-0 hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/30">
        
        {/* Top Navbar */}
        <header className="h-16 bg-card/80 backdrop-blur-md border-b flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="w-full bg-muted border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
            </button>
            <div className="w-px h-6 bg-border mx-2"></div>
            <div className="flex items-center gap-3 group relative cursor-pointer" onClick={handleLogout}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none group-hover:text-red-500 transition-colors">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Doctor</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary group-hover:bg-red-500 text-primary-foreground flex items-center justify-center font-bold shadow-md transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
