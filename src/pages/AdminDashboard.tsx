import { useState } from "react";
import { Users, UserCheck, MessageCircle, Activity, Heart, TrendingUp } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { FilterPanel } from "@/components/admin/FilterPanel";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { ActivityTable } from "@/components/admin/ActivityTable";

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader title="HealthAI Admin Dashboard" />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value="5,234"
                change="+12% from last month"
                trend="up"
                icon={Users}
                colorScheme="primary"
              />
              <StatCard
                title="Active Users"
                value="3,456"
                change="+8% from last month"
                trend="up"
                icon={UserCheck}
                colorScheme="secondary"
              />
              <StatCard
                title="Chat Sessions"
                value="8,921"
                change="+23% from last month"
                trend="up"
                icon={MessageCircle}
                colorScheme="success"
              />
              <StatCard
                title="Health Alerts"
                value="145"
                change="-5% from last month"
                trend="down"
                icon={Heart}
                colorScheme="warning"
              />
            </div>

            {/* Advanced Filters */}
            <FilterPanel />

            {/* Charts Section */}
            <DashboardCharts />

            {/* Recent Activity Table */}
            <ActivityTable />

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Avg Response Time"
                value="2.3s"
                change="-0.5s from last week"
                trend="up"
                icon={TrendingUp}
                colorScheme="success"
              />
              <StatCard
                title="Doctor Consultations"
                value="892"
                change="+15% from last month"
                trend="up"
                icon={Activity}
                colorScheme="primary"
              />
              <StatCard
                title="System Uptime"
                value="99.9%"
                change="Perfect this month"
                trend="up"
                icon={Heart}
                colorScheme="success"
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}