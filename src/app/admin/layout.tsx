'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Breadcrumb mapping for admin routes
const routeTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/posts': 'Posts',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/media': 'Media',
  '/admin/users': 'Users',
  '/admin/settings': 'Settings',
  '/admin/moderation': 'Moderation',
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      return {
        label: routeTitles[path] || segment.charAt(0).toUpperCase() + segment.slice(1),
        path,
        isLast: index === pathSegments.length - 1,
      };
    });
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const pageTitle = routeTitles[pathname] || 'Admin';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-charcoal-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 animate-slide-in">
            <Sidebar collapsed={false} />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-900" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-charcoal-800 border-b border-gray-200 dark:border-charcoal-700 sticky top-0 z-40">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Left Section - Mobile Menu + Breadcrumbs */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Breadcrumbs */}
              <nav className="hidden sm:flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center space-x-2">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                    {crumb.isLast ? (
                      <span className="font-medium text-gray-900 dark:text-white">
                        {crumb.label}
                      </span>
                    ) : (
                      <a
                        href={crumb.path}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {crumb.label}
                      </a>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Page Title */}
              <h1 className="sm:hidden font-semibold text-gray-900 dark:text-white">
                {pageTitle}
              </h1>
            </div>

            {/* Right Section - Search, Notifications, Profile */}
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="hidden lg:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 w-64 bg-gray-100 dark:bg-charcoal-700 border-0"
                />
              </div>

              {/* Search Button (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-muted-foreground">
                          Order #1234 - $89.99
                        </p>
                        <p className="text-xs text-muted-foreground">2 min ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">User registration</p>
                        <p className="text-xs text-muted-foreground">
                          john@example.com joined
                        </p>
                        <p className="text-xs text-muted-foreground">15 min ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Content reported</p>
                        <p className="text-xs text-muted-foreground">
                          Post requires moderation
                        </p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-persian-green">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/admin-avatar.png" alt="Admin" />
                      <AvatarFallback className="bg-persian-green text-white">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">
                        admin@rawgle.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Account Settings</DropdownMenuItem>
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => window.location.href = '/admin/login'}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
