'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Handshake,
  Search,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/opportunities', icon: FolderOpen, label: 'Opportunities' },
  { href: '/timeline', icon: Calendar, label: 'Timeline' },
  { href: '/relationships', icon: Handshake, label: 'Relationships' },
  { href: '/search', icon: Search, label: 'Search' },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <Image
              src="/hcai-logo_white_no-text.png"
              alt="Health Copilot AI"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg">GrantFlow</h1>
            <p className="text-xs text-muted-foreground">Navigator</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>FIU HWCOM</p>
          <p>NeighborhoodHELP & FIU Thrive</p>
        </div>
      </div>
    </div>
  );
}
