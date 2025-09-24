import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import dashboardImage from "@/assets/dashboard-medical.jpg";
import { 
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Heart,
  Pill,
  Activity,
  User,
  Bell,
  Settings,
  Users,
  BarChart3,
  FileText,
  Stethoscope
} from "lucide-react";
import { useEffect } from 'react';
import { requestNotificationPermission, sendBrowserNotification } from '@/lib/notifications';
import { sendSms } from '@/lib/sms';
import { sendTelegramMessage } from '@/lib/telegram';

interface HealthMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: any;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"patient" | "doctor" | "admin">("patient");

  const healthMetrics: HealthMetric[] = [
    { label: "Heart Rate", value: "72 bpm", change: "+2%", trend: "up", icon: Heart },
    { label: "Blood Pressure", value: "120/80", change: "stable", trend: "stable", icon: Activity },
    { label: "Medication Adherence", value: "94%", change: "+5%", trend: "up", icon: Pill },
    { label: "Steps Today", value: "8,542", change: "+12%", trend: "up", icon: TrendingUp },
  ];

  const appointments = [
    { id: 1, doctor: "Dr. Vinod Raina ", specialty: "Cardiology", date: "Today, 2:00 PM", status: "upcoming" },
    { id: 2, doctor: "Dr. Sakshi Mehta ", specialty: "Neurology", date: "Tomorrow, 10:00 AM", status: "scheduled" },
    { id: 3, doctor: "Dr. Priya Patel", specialty: "General", date: "Mar 25, 3:30 PM", status: "scheduled" },
  ];

  const medications = [
    { id: 1, name: "Lisinopril", dosage: "10mg", schedule: "Once daily", taken: true },
    { id: 2, name: "Metformin", dosage: "500mg", schedule: "Twice daily", taken: true },
    { id: 3, name: "Vitamin D", dosage: "1000 IU", schedule: "Once daily", taken: false },
  ];

  const [reminders, setReminders] = useState<{ id: string; text: string }[]>([
    { id: 'r1', text: 'Take your vaccination today' },
    { id: 'r2', text: 'Take your medicine at 8 PM' },
  ]);
  const [newReminder, setNewReminder] = useState('');

  const TabButton = ({ tab, label, icon: Icon }: { tab: typeof activeTab, label: string, icon: any }) => (
    <Button
      variant={activeTab === tab ? "hero" : "outline"}
      onClick={() => setActiveTab(tab)}
      className="flex-1"
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const PatientDashboard = () => (
    <div className="space-y-6">
      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="healthcare-card card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-sm ${
                      metric.trend === "up" ? "text-success" : 
                      metric.trend === "down" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className="primary-gradient p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{appointment.doctor}</p>
                  <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {appointment.date}
                  </p>
                </div>
                <Badge variant={appointment.status === "upcoming" ? "success" : "secondary"}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>

        {/* Medication Tracker */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="h-5 w-5 mr-2" />
              Today's Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-muted-foreground">{med.dosage} - {med.schedule}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={med.taken ? "success" : "warning"}>
                    {med.taken ? "Taken" : "Pending"}
                  </Badge>
                  {!med.taken && (
                  <Button size="sm" variant="hero" onClick={() => {
                    sendBrowserNotification({ title: 'Medicine Taken', body: `${med.name} marked as taken.` });
                  }}>Mark Taken</Button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-sm">Adherence Rate</span>
              <div className="flex items-center space-x-2">
                <Progress value={94} className="w-20" />
                <span className="text-sm font-medium">94%</span>
              </div>
            </div>
            <div className="pt-4">
              <Button variant="outline" onClick={() => {
                sendBrowserNotification({ title: 'Reminder Set', body: 'Take your medicine at 8 PM' });
                sendSms({ to: '+10000000000', message: 'Take your medicine at 8 PM' });
                sendTelegramMessage({ chatId: 'YOUR_CHAT_ID', text: 'Take your medicine at 8 PM' });
              }}>Set 8 PM Medicine Reminder</Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders & Alerts */}
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Reminders & Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {reminders.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span>{r.text}</span>
                  <Button size="sm" variant="outline" onClick={() => {
                    sendBrowserNotification({ title: 'Reminder', body: r.text });
                    sendSmsStub({ to: '+10000000000', message: r.text });
                  }}>Notify</Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 rounded border px-3 py-2 bg-background" placeholder="Add custom reminder..." value={newReminder} onChange={(e) => setNewReminder(e.target.value)} />
              <Button onClick={() => {
                if (!newReminder.trim()) return;
                const item = { id: Math.random().toString(36).slice(2), text: newReminder.trim() };
                setReminders(prev => [item, ...prev]);
                setNewReminder('');
                sendBrowserNotification({ title: 'Reminder Added', body: item.text });
              }}>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Points */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Health Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">1,250 Points</p>
              <p className="text-sm text-muted-foreground">Keep up the great work!</p>
            </div>
            <Button variant="medical">Redeem Rewards</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DoctorDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Patients</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Pre-screenings</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Activity className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center py-12">
        <img src={dashboardImage} alt="Doctor Dashboard" className="mx-auto rounded-xl shadow-[var(--shadow-lg)] max-w-lg" />
        <h3 className="text-xl font-semibold mt-6">Doctor Dashboard Features</h3>
        <p className="text-muted-foreground mt-2">Advanced patient management and AI-assisted diagnostics</p>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">15,247</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chatbot Usage</p>
                <p className="text-3xl font-bold">2,540</p>
              </div>
              <BarChart3 className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doctors Online</p>
                <p className="text-3xl font-bold">342</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">94.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle>Disease Trends & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Respiratory Issues</span>
              <div className="flex items-center space-x-2">
                <Progress value={75} className="w-32" />
                <span className="text-sm">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Cardiovascular</span>
              <div className="flex items-center space-x-2">
                <Progress value={60} className="w-32" />
                <span className="text-sm">60%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Mental Health</span>
              <div className="flex items-center space-x-2">
                <Progress value={45} className="w-32" />
                <span className="text-sm">45%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your health overview.</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 mb-8">
          <TabButton tab="patient" label="Patient View" icon={User} />
          <TabButton tab="doctor" label="Doctor View" icon={Stethoscope} />
          <TabButton tab="admin" label="Admin View" icon={Settings} />
        </div>

        {/* Dashboard Content */}
        {activeTab === "patient" && <PatientDashboard />}
        {activeTab === "doctor" && <DoctorDashboard />}
        {activeTab === "admin" && <AdminDashboard />}
      </div>
    </Layout>
  );
};

export default Dashboard;
