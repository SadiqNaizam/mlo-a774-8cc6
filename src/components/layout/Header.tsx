import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Bitcoin, ChevronsUpDown, Moon, Settings, Sun, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  console.log('Header loaded');
  // In a real app, this would come from a theme context
  const [isDarkMode, setIsDarkMode] = React.useState(true); 

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would also toggle the class on the `html` element
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">CryptoTradeStation</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                Select Market...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search market..." />
                <CommandList>
                  <CommandEmpty>No market found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem>BTC/USD</CommandItem>
                    <CommandItem>ETH/USD</CommandItem>
                    <CommandItem>SOL/USD</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">View notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@trader" />
                    <AvatarFallback>TR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Trader</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      trader@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;