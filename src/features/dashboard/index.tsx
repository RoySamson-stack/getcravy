import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

// Sample data for export and display
const exportData = {
  revenue: [
    { date: '2023-05-01', amount: 2840 },
    { date: '2023-05-02', amount: 2950 },
    { date: '2023-05-03', amount: 3247 },
  ],
  reservations: [
    { id: 1, name: 'John Doe', time: '19:00', guests: 4, status: 'confirmed' },
    { id: 2, name: 'Jane Smith', time: '20:30', guests: 2, status: 'confirmed' },
    { id: 3, name: 'Michael Brown', time: '18:00', guests: 6, status: 'pending' },
    { id: 4, name: 'Sarah Johnson', time: '21:00', guests: 2, status: 'confirmed' },
  ],
  staff: [
    { id: 1, name: 'Alice Johnson', role: 'Waiter', shift: 'Evening' },
    { id: 2, name: 'Bob Williams', role: 'Chef', shift: 'Day' },
    { id: 3, name: 'Charlie Davis', role: 'Manager', shift: 'Day' },
    { id: 4, name: 'Diana Miller', role: 'Waitress', shift: 'Evening' },
  ],
  recentOrders: [
    { id: 1, table: 'T4', items: 'Pasta Carbonara x2', amount: 34.50, status: 'Preparing' },
    { id: 2, table: 'T7', items: 'Steak & Wine', amount: 67.00, status: 'Ready' },
    { id: 3, table: 'T2', items: 'Caesar Salad', amount: 16.50, status: 'Completed' },
    { id: 4, table: 'T5', items: 'Burger, Fries', amount: 22.00, status: 'Preparing' },
  ]
}

export default function RestaurantDashboard() {
  const handleExport = (type: 'excel' | 'csv' | 'json') => {
    let data: Blob | string = ''
    const filename = `restaurant-report-${new Date().toISOString().slice(0, 10)}`
    
    if (type === 'json') {
      data = JSON.stringify(exportData, null, 2)
      saveAs(new Blob([data], { type: 'application/json' }), `${filename}.json`)
      return
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new()
    
    // Add worksheets for each data type
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(exportData.revenue),
      'Revenue'
    )
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(exportData.reservations),
      'Reservations'
    )
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(exportData.staff),
      'Staff'
    )
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(exportData.recentOrders),
      'Recent_Orders'
    )

    if (type === 'excel') {
      XLSX.writeFile(wb, `${filename}.xlsx`)
    } else {
      // For CSV, we'll export all data as separate files in a zip (simplified here as individual files)
      const csvRevenue = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportData.revenue))
      saveAs(new Blob([csvRevenue], { type: 'text/csv;charset=utf-8;' }), `${filename}-revenue.csv`)
      
      const csvReservations = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportData.reservations))
      saveAs(new Blob([csvReservations], { type: 'text/csv;charset=utf-8;' }), `${filename}-reservations.csv`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* ===== Top Heading ===== */}
      <Header className="bg-white/90 backdrop-blur-sm border-b border-red-100">
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className="p-6">
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Restaurant Dashboard</h1>
            <p className='text-gray-600 mt-1'>Monitor your restaurant's performance and reservations</p>
          </div>
          <div className='flex items-center space-x-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#E23744] hover:bg-[#C82C3A] text-white shadow-lg flex items-center gap-1">
                  Export Report
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white border border-red-100">
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-50"
                  onClick={() => handleExport('excel')}
                >
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-50"
                  onClick={() => handleExport('csv')}
                >
                  CSV (.csv)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-50"
                  onClick={() => handleExport('json')}
                >
                  JSON (.json)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-6'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList className="bg-white border border-red-100 shadow-sm">
              <TabsTrigger 
                value='overview' 
                className="data-[state=active]:bg-[#E23744] data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value='reservations' 
                className="data-[state=active]:bg-[#E23744] data-[state=active]:text-white"
              >
                Reservations
              </TabsTrigger>
              <TabsTrigger 
                value='menu' 
                className="data-[state=active]:bg-[#E23744] data-[state=active]:text-white"
              >
                Menu Management
              </TabsTrigger>
              <TabsTrigger 
                value='staff' 
                className="data-[state=active]:bg-[#E23744] data-[state=active]:text-white"
              >
                Staff
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-700'>
                    Today's Revenue
                  </CardTitle>
                  <div className="p-2 bg-gradient-to-br from-[#E23744] to-[#C82C3A] rounded-lg">
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      className='h-4 w-4'
                    >
                      <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-gray-900'>$3,247.50</div>
                  <p className='text-green-600 text-xs font-medium'>
                    +12.5% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-700'>
                    Active Reservations
                  </CardTitle>
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      className='h-4 w-4'
                    >
                      <path d='M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-gray-900'>47</div>
                  <p className='text-blue-600 text-xs font-medium'>
                    8 pending confirmations
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-700'>
                    Tables Occupied
                  </CardTitle>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      className='h-4 w-4'
                    >
                      <path d='M3 12h18m-9-9v18' />
                      <path d='M8 8h8v8H8z' />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-gray-900'>23/35</div>
                  <p className='text-green-600 text-xs font-medium'>
                    65.7% occupancy rate
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-700'>
                    Staff On Duty
                  </CardTitle>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      className='h-4 w-4'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                      <circle cx='9' cy='7' r='4' />
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-gray-900'>12</div>
                  <p className='text-gray-600 text-xs font-medium'>
                    2 waiters, 4 chefs, 6 support
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4 bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg'>
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-[#E23744] to-[#C82C3A] rounded-full"></div>
                    Daily Revenue Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Revenue trends for the past 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>

              <Card className='col-span-1 lg:col-span-3 bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg'>
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    Recent Orders
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Latest orders from your restaurant today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exportData.recentOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#E23744] to-[#C82C3A] rounded-full flex items-center justify-center text-white font-semibold">
                            {order.table}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Table {order.table.slice(1)}</p>
                            <p className="text-sm text-gray-600">{order.items}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${order.amount.toFixed(2)}</p>
                          <p className={`text-xs ${
                            order.status === 'Preparing' ? 'text-orange-600' :
                            order.status === 'Ready' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Section */}
            <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your restaurant operations efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-[#E23744] to-[#C82C3A] hover:from-[#C82C3A] hover:to-[#B01E2A] text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm font-medium">New Reservation</span>
                  </Button>
                  
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm font-medium">View Menu</span>
                  </Button>
                  
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium">Staff Schedule</span>
                  </Button>
                  
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='reservations' className='space-y-6'>
            <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Reservation Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage all restaurant reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportData.reservations.map((reservation) => (
                    <div 
                      key={reservation.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#E23744] to-[#C82C3A] rounded-full flex items-center justify-center text-white font-semibold">
                          {reservation.id}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reservation.name}</p>
                          <p className="text-sm text-gray-600">
                            {reservation.time} • {reservation.guests} guests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='menu' className='space-y-6'>
            <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Menu Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Update menu items and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <h3 className="font-medium text-gray-900">Appetizers</h3>
                    <p className="text-sm text-gray-600">5 items</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <h3 className="font-medium text-gray-900">Main Courses</h3>
                    <p className="text-sm text-gray-600">12 items</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <h3 className="font-medium text-gray-900">Desserts</h3>
                    <p className="text-sm text-gray-600">6 items</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <h3 className="font-medium text-gray-900">Beverages</h3>
                    <p className="text-sm text-gray-600">8 items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='staff' className='space-y-6'>
            <Card className="bg-white/80 backdrop-blur-sm border border-red-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Staff Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage staff schedules and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportData.staff.map((staff) => (
                    <div 
                      key={staff.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-600">{staff.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          staff.shift === 'Day' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {staff.shift} Shift
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </div>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Reservations',
    href: 'dashboard/reservations',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Menu',
    href: 'dashboard/menu',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Staff',
    href: 'dashboard/staff',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Reports',
    href: 'dashboard/reports',
    isActive: false,
    disabled: false,
  },
]