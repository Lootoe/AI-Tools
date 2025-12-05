import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Workflow, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    path: '/chat',
    label: '智能对话',
    icon: MessageSquare,
  },
  {
    path: '/workflow',
    label: '工作流',
    icon: Workflow,
  },
  {
    path: '/text-to-image',
    label: '文生图',
    icon: Image,
  },
  {
    path: '/image-to-video',
    label: '图生视频',
    icon: Video,
  },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 左侧 */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">AI Tools</span>
          </Link>

          {/* Navigation Items - 右侧 */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
