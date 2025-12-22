import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Image, Sparkles, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    path: '/chat',
    label: '智能对话',
    icon: MessageSquare,
  },
  {
    path: '/text-to-image',
    label: '图片生成',
    icon: Image,
  },
  {
    path: '/ai-comic',
    label: 'AI漫剧',
    icon: Clapperboard,
  },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
              AI Tools
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/25" />
                  )}
                  <Icon className={cn("w-4 h-4 relative z-10", isActive && "text-white")} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
