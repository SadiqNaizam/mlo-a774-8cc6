import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  CandlestickChart,
  Wallet,
  Settings,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trading', label: 'Trade', icon: CandlestickChart },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const LeftSidebar: React.FC = () => {
  console.log('LeftSidebar loaded');
  const isCollapsed = false; // This could be state managed by a parent component

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return cn(
      buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'sm' }),
      'justify-start',
      isActive && 'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white'
    );
  };

  return (
    <aside
      data-collapsed={isCollapsed}
      className="hidden md:flex flex-col gap-4 py-2 bg-background border-r h-full"
    >
      <nav className="grid gap-1 p-2">
        {navItems.map((item) => (
            <Tooltip key={item.to} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  end={item.to === '/'} // Use `end` for the root path
                  className={getNavLinkClass}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="ml-2">{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {item.label}
              </TooltipContent>
            </Tooltip>
        ))}
      </nav>
    </aside>
  );
};

export default LeftSidebar;