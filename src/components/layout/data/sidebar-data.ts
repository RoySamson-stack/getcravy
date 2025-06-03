import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconCalendarEvent,
  IconChefHat,
  IconToolsKitchen2,
  IconClipboardList,
  IconReceipt,
  IconChartLine,
  IconUsersGroup,
  IconClock,
  IconCash,
  IconTable,
  IconBellRinging,
  IconStar,
  IconTrendingUp,
  IconBookmark,
  IconCreditCard,
  IconPhone,
  IconMail,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd, UtensilsCrossed, ChefHat } from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Chef Rodriguez',
    email: 'admin@goeat-restaurant.com',
    avatar: '/avatars/chef-avatar.jpg',
  },
  teams: [
    {
      name: 'GoEat Restaurant',
      logo: UtensilsCrossed,
      plan: 'Premium Management Suite',
    },
  ],
  navGroups: [
    {
      title: 'Restaurant Operations',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
          badge: 'Live',
          badgeColor: '#E23744',
        },
        {
          title: 'Reservations',
          url: '/reservations',
          icon: IconCalendarEvent,
          badge: '12',
          badgeColor: '#FF6B35',
        },
        {
          title: 'Table Management',
          url: '/tables',
          icon: IconTable,
        },
        {
          title: 'Live Orders',
          url: '/orders',
          icon: IconClipboardList,
          badge: '5',
          badgeColor: '#4CAF50',
        },
        {
          title: 'Kitchen Display',
          url: '/kitchen',
          icon: IconChefHat,
          badge: 'New',
          badgeColor: '#E23744',
        },
      ],
    },
    {
      title: 'Menu & Inventory',
      items: [
        {
          title: 'Menu Management',
          url: '/menu',
          icon: IconToolsKitchen2,
        },
        {
          title: 'Inventory',
          url: '/inventory',
          icon: IconPackages,
          badge: 'Low Stock',
          badgeColor: '#FF9800',
        },
        {
          title: 'Recipes',
          url: '/recipes',
          icon: IconBookmark,
        },
      ],
    },
    {
      title: 'Staff & Management',
      items: [
        {
          title: 'Staff Management',
          url: '/staff',
          icon: IconUsersGroup,
        },
        {
          title: 'Work Schedules',
          url: '/schedules',
          icon: IconClock,
        },
        {
          title: 'Customer Reviews',
          url: '/reviews',
          icon: IconStar,
          badge: '4.8★',
          badgeColor: '#FFD700',
        },
        {
          title: 'Notifications',
          url: '/notifications',
          icon: IconBellRinging,
          badge: '8',
          badgeColor: '#E23744',
        },
      ],
    },
    {
      title: 'Finance & Analytics',
      items: [
        {
          title: 'Sales Analytics',
          url: '/analytics',
          icon: IconChartLine,
        },
        {
          title: 'Revenue Reports',
          url: '/revenue',
          icon: IconTrendingUp,
        },
        {
          title: 'Daily Sales',
          url: '/sales',
          icon: IconCash,
        },
        {
          title: 'Payment Methods',
          url: '/payments',
          icon: IconCreditCard,
        },
        {
          title: 'Billing & Receipts',
          url: '/billing',
          icon: IconReceipt,
        },
      ],
    },
    {
      title: 'Customer Service',
      items: [
        {
          title: 'Customer Messages',
          url: '/messages',
          icon: IconMessages,
          badge: '3',
          badgeColor: '#2196F3',
        },
        {
          title: 'Customer Database',
          url: '/customers',
          icon: IconUsers,
        },
        {
          title: 'Feedback & Support',
          url: '/support',
          icon: IconPhone,
        },
        {
          title: 'Email Marketing',
          url: '/marketing',
          icon: IconMail,
        },
      ],
    },
    {
      title: 'Settings & System',
      items: [
        {
          title: 'Restaurant Settings',
          icon: IconSettings,
          items: [
            {
              title: 'General Settings',
              url: '/settings/general',
              icon: IconUserCog,
            },
            {
              title: 'Restaurant Profile',
              url: '/settings/profile',
              icon: IconTool,
            },
            {
              title: 'Theme & Branding',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'System Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display Settings',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Security & Access',
          icon: IconLockAccess,
          items: [
            {
              title: 'Admin Login',
              url: '/auth/sign-in',
            },
            {
              title: 'Staff Registration',
              url: '/auth/sign-up',
            },
            {
              title: 'Password Recovery',
              url: '/auth/forgot-password',
            },
            {
              title: 'Two-Factor Auth',
              url: '/auth/2fa',
            },
          ],
        },
        {
          title: 'System Status',
          icon: IconBug,
          items: [
            {
              title: 'Access Denied',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Permission Error',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Page Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'System Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Mode',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Support & Help',
      items: [
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
        {
          title: 'Contact Support',
          url: '/contact',
          icon: IconPhone,
          badge: '24/7',
          badgeColor: '#4CAF50',
        },
      ],
    },
  ],
}

// Enhanced sidebar styling configuration for restaurant theme
export const sidebarThemeConfig = {
  primaryColor: '#E23744',
  secondaryColor: '#FF6B35',
  accentColor: '#4CAF50',
  warningColor: '#FF9800',
  infoColor: '#2196F3',
  goldColor: '#FFD700',
  
  gradients: {
    primary: 'linear-gradient(135deg, #E23744 0%, #C82C3A 100%)',
    secondary: 'linear-gradient(135deg, #FF6B35 0%, #E55722 100%)',
    success: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
    warning: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    info: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  },
  
  shadows: {
    soft: '0 2px 8px rgba(226, 55, 68, 0.15)',
    medium: '0 4px 16px rgba(226, 55, 68, 0.2)',
    strong: '0 8px 32px rgba(226, 55, 68, 0.25)',
  },
  
  animations: {
    hover: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    scale: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }
}

// CSS-in-JS styles for enhanced sidebar appearance
export const sidebarStyles = `
  .sidebar-nav-item {
    position: relative;
    transition: ${sidebarThemeConfig.animations.hover};
    border-radius: 8px;
    margin: 2px 0;
  }
  
  .sidebar-nav-item:hover {
    background: linear-gradient(135deg, rgba(226, 55, 68, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
    transform: translateX(4px);
    box-shadow: ${sidebarThemeConfig.shadows.soft};
  }
  
  .sidebar-nav-item.active {
    background: ${sidebarThemeConfig.gradients.primary};
    color: white;
    box-shadow: ${sidebarThemeConfig.shadows.medium};
  }
  
  .sidebar-nav-item.active::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: white;
    border-radius: 2px;
  }
  
  .sidebar-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .sidebar-badge.primary { background: ${sidebarThemeConfig.gradients.primary}; }
  .sidebar-badge.secondary { background: ${sidebarThemeConfig.gradients.secondary}; }
  .sidebar-badge.success { background: ${sidebarThemeConfig.gradients.success}; }
  .sidebar-badge.warning { background: ${sidebarThemeConfig.gradients.warning}; }
  .sidebar-badge.info { background: ${sidebarThemeConfig.gradients.info}; }
  .sidebar-badge.gold { background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%); }
  
  .sidebar-group-title {
    color: #666;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 16px 0 8px 0;
    position: relative;
  }
  
  .sidebar-group-title::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 24px;
    height: 2px;
    background: ${sidebarThemeConfig.gradients.primary};
    border-radius: 1px;
  }
  
  .sidebar-icon {
    transition: ${sidebarThemeConfig.animations.scale};
  }
  
  .sidebar-nav-item:hover .sidebar-icon {
    transform: scale(1.1);
  }
  
  .sidebar-team-logo {
    background: ${sidebarThemeConfig.gradients.primary};
    border-radius: 8px;
    padding: 8px;
    color: white;
    box-shadow: ${sidebarThemeConfig.shadows.soft};
  }
`