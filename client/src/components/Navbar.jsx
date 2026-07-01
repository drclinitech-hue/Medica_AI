import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, User, LogOut, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isHome = location.pathname === '/';
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`print:hidden fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
            MediCheck AI
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          {isHome && (
            <>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#diseases" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Supported Diseases</a>
              <button onClick={() => window.dispatchEvent(new Event('open-chatbot'))} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">AI Assistant</button>
            </>
          )}
          <Link to="/detect" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/detect') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>Disease Detection</Link>
          <Link to="/doctors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Find Doctors</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 pl-2 pr-4 py-1.5 rounded-full border transition-all"
              >
                <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate hidden sm:block">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-xl shadow-lg py-1 overflow-hidden">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                  </div>
                  
                  {user.role === 'doctor' && (
                    <Link to="/doctor" className="block px-4 py-2 text-sm hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                      Doctor Portal
                    </Link>
                  )}
                  {user.role === 'patient' && (
                    <>
                      <Link to="/appointments" className="block px-4 py-2 text-sm hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                        My Appointments
                      </Link>
                      <Link to="/history" className="block px-4 py-2 text-sm hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                        Detection History
                      </Link>
                    </>
                  )}
                  
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-muted" onClick={() => setDropdownOpen(false)}>
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary hidden sm:block">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-all">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
