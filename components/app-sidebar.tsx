import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

export function AppSidebar() {
  const items = [
    {
      title: 'Home',
      url: '/',
      icon: Home
    },
    {
      title: 'Stock',
      url: '/stock',
      icon: Inbox
    },
    {
      title: 'Delivery',
      url: '/delivery',
      icon: Settings
    },
    {
      title: 'BoM',
      url: '/bom',
      icon: Calendar
    },
    {
      title: 'Quarantine',
      url: '/quarantine',
      icon: Search
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings
    }
  ];
  return (
    <Sidebar className='mt-12'>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}