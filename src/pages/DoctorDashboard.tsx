import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  Stethoscope, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Award,
  Calendar,
  Clock,
  Phone,
  Video,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MapPin,
  DollarSign,
  Gift,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DoctorDashboard = () => {
  // Enhanced mock data for comprehensive dashboard
  const todayStats = {
    totalPatients: 18,
    newAppointments: 6,
    pendingRequests: 3,
    totalEarnings: 18500,
    completedConsultations: 12,
    avgRating: 4.8
  }

  const weeklyData = [
    { day: 'Mon', consultations: 8, earnings: 4800 },
    { day: 'Tue', consultations: 12, earnings: 7200 },
    { day: 'Wed', consultations: 6, earnings: 3600 },
    { day: 'Thu', consultations: 15, earnings: 9000 },
    { day: 'Fri', consultations: 10, earnings: 6000 },
    { day: 'Sat', consultations: 18, earnings: 10800 },
    { day: 'Sun', consultations: 5, earnings: 3000 }
  ]

  const revenue = {
    gross: 22000,
    discounts: 3500,
    net: 18500,
  }

  const rewardsData = {
    patientsUsedRewards: 8,
    totalDiscountGiven: 3500,
    averageDiscount: 437.5,
    rewardUsageRate: 44.4 // percentage of patients who used rewards
  }

  const consultationRequests = [
    { id: 'CR-001', patientName: 'Priya Sharma', age: 28, issue: 'Chest pain', type: 'video', fee: 600, status: 'pending', urgency: 'high' },
    { id: 'CR-002', patientName: 'Arjun Patel', age: 35, issue: 'Migraine', type: 'audio', fee: 500, status: 'pending', urgency: 'medium' },
    { id: 'CR-003', patientName: 'Kavya Reddy', age: 42, issue: 'Regular checkup', type: 'video', fee: 600, status: 'pending', urgency: 'low' }
  ]

  const upcomingConsultations = [
    { id: 'UC-001', time: '10:30 AM', patientName: 'Rohit Kumar', type: 'video', issue: 'Follow-up', duration: '30 min' },
    { id: 'UC-002', time: '11:15 AM', patientName: 'Neha Singh', type: 'audio', issue: 'Blood pressure', duration: '20 min' },
    { id: 'UC-003', time: '2:00 PM', patientName: 'Amit Joshi', type: 'video', issue: 'Diabetes checkup', duration: '25 min' },
    { id: 'UC-004', time: '3:30 PM', patientName: 'Sita Devi', type: 'chat', issue: 'Prescription refill', duration: '15 min' }
  ]

  const patients = [
    { 
      id: 'P-1023', 
      name: 'Rahul Verma', 
      age: 34, 
      condition: 'Hypertension', 
      status: 'Completed', 
      rewardsUsed: 120, 
      originalFee: 600,
      feeAfterDiscount: 480,
      lastVisit: '2024-01-15',
      consultationType: 'video',
      rating: 5 
    },
    { 
      id: 'P-1044', 
      name: 'Asha Nair', 
      age: 42, 
      condition: 'Diabetes', 
      status: 'In Progress', 
      rewardsUsed: 0, 
      originalFee: 600,
      feeAfterDiscount: 600,
      lastVisit: '2024-01-14',
      consultationType: 'audio',
      rating: 4 
    },
    { 
      id: 'P-1031', 
      name: 'Imran Khan', 
      age: 29, 
      condition: 'Migraine', 
      status: 'Scheduled', 
      rewardsUsed: 50, 
      originalFee: 550,
      feeAfterDiscount: 500,
      lastVisit: '2024-01-13',
      consultationType: 'video',
      rating: 5 
    },
    { 
      id: 'P-1055', 
      name: 'Deepika Roy', 
      age: 38, 
      condition: 'Anxiety', 
      status: 'Completed', 
      rewardsUsed: 200, 
      originalFee: 700,
      feeAfterDiscount: 500,
      lastVisit: '2024-01-12',
      consultationType: 'video',
      rating: 5 
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Phone className="h-4 w-4" />
      case 'chat': return <MessageCircle className="h-4 w-4" />
      default: return <Stethoscope className="h-4 w-4" />
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block bg-card border rounded-xl h-fit sticky top-24">
            <nav className="p-4 space-y-1">
              <a href="#overview" className="block px-3 py-2 rounded hover:bg-muted">Overview</a>
              <a href="#patients" className="block px-3 py-2 rounded hover:bg-muted">Patients</a>
              <a href="#consultations" className="block px-3 py-2 rounded hover:bg-muted">Consultations</a>
              <a href="#rewards" className="block px-3 py-2 rounded hover:bg-muted">Rewards</a>
              <a href="#analytics" className="block px-3 py-2 rounded hover:bg-muted">Analytics</a>
            </nav>
          </aside>
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Smith. Here's your practice overview</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> 
              Schedule
            </Button>
            <Button variant="hero" className="gap-2">
              <Stethoscope className="h-4 w-4" /> 
              Start Consultation
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div id="overview" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="healthcare-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{todayStats.totalPatients}</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Active patients</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{todayStats.completedConsultations}</span>
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-amber-600">{todayStats.pendingRequests}</span>
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">₹{todayStats.totalEarnings}</span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Net earnings</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Patient Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">{todayStats.avgRating}</span>
                <Star className="h-5 w-5 text-yellow-600 fill-current" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average rating</p>
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rewards Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">{rewardsData.rewardUsageRate}%</span>
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Patient usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Summary */}
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Revenue Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Gross Revenue</span>
                    <span className="font-bold">₹{revenue.gross}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-600">
                    <span>Rewards Discounts</span>
                    <span className="font-bold">-₹{revenue.discounts}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center text-green-600">
                    <span className="font-semibold">Net Revenue</span>
                    <span className="font-bold text-lg">₹{revenue.net}</span>
                  </div>
                  <Progress value={84} className="mt-4" />
                  <p className="text-sm text-muted-foreground">84% of monthly target achieved</p>
                </CardContent>
              </Card>

              {/* Upcoming Consultations */}
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-primary">
                            {getConsultationIcon(consultation.type)}
                            <Clock className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="font-medium">{consultation.patientName}</p>
                            <p className="text-sm text-muted-foreground">{consultation.issue}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{consultation.time}</p>
                          <p className="text-sm text-muted-foreground">{consultation.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Consultation Requests */}
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pending Consultation Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultationRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getConsultationIcon(request.type)}
                          <div>
                            <p className="font-medium">{request.patientName}</p>
                            <p className="text-sm text-muted-foreground">Age: {request.age}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{request.issue}</p>
                          <p className={`text-sm ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">₹{request.fee}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="hero">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div id="patients" />
            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-3 px-2">Patient ID</th>
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Age</th>
                        <th className="py-3 px-2">Condition</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Fee Details</th>
                        <th className="py-3 px-2">Rating</th>
                        <th className="py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b">
                          <td className="py-3 px-2 font-mono">{patient.id}</td>
                          <td className="py-3 px-2 font-medium">{patient.name}</td>
                          <td className="py-3 px-2">{patient.age}</td>
                          <td className="py-3 px-2">{patient.condition}</td>
                          <td className="py-3 px-2">
                            <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground line-through">₹{patient.originalFee}</span>
                                {patient.rewardsUsed > 0 && (
                                  <Badge variant="outline" className="text-xs">-₹{patient.rewardsUsed}</Badge>
                                )}
                              </div>
                              <div className="font-bold text-green-600">₹{patient.feeAfterDiscount}</div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{patient.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                {getConsultationIcon(patient.consultationType)}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations" className="space-y-6">
            <div id="consultations" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation, index) => (
                      <div key={consultation.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{consultation.patientName}</p>
                            <p className="text-sm text-muted-foreground">{consultation.issue}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{consultation.time}</p>
                          <div className="flex items-center gap-1 text-primary">
                            {getConsultationIcon(consultation.type)}
                            <span className="text-xs">{consultation.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Video className="h-4 w-4" />
                    Start Video Consultation
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Phone className="h-4 w-4" />
                    Start Audio Call
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    Open Chat Support
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Calendar className="h-4 w-4" />
                    Reschedule Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div id="rewards" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="healthcare-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Patients Used Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{rewardsData.patientsUsedRewards}</span>
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Discount Given</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">₹{rewardsData.totalDiscountGiven}</span>
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average Discount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">₹{rewardsData.averageDiscount}</span>
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Per patient</p>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Usage Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">{rewardsData.rewardUsageRate}%</span>
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Of all patients</p>
                </CardContent>
              </Card>
            </div>

            <Card className="healthcare-card">
              <CardHeader>
                <CardTitle>Rewards Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-800">Patient Retention</h4>
                      <p className="text-sm text-green-600">Patients using rewards are 73% more likely to return</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-blue-800">Satisfaction Score</h4>
                      <p className="text-sm text-blue-600">Average rating increased by 0.8 points with rewards</p>
                    </div>
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div id="analytics" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle>Weekly Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="consultations" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle>Weekly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle className="text-lg">Patient Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>18-30 years</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-16" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>31-45 years</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-16" />
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>46-60 years</span>
                    <div className="flex items-center gap-2">
                      <Progress value={22} className="w-16" />
                      <span className="text-sm">22%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>60+ years</span>
                    <div className="flex items-center gap-2">
                      <Progress value={8} className="w-16" />
                      <span className="text-sm">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle className="text-lg">Top Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Hypertension</span>
                    <Badge variant="secondary">28%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Diabetes</span>
                    <Badge variant="secondary">22%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Anxiety</span>
                    <Badge variant="secondary">18%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Migraine</span>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Others</span>
                    <Badge variant="secondary">17%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">98.5%</div>
                    <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">24min</div>
                    <p className="text-sm text-muted-foreground">Avg. Consultation Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">92%</div>
                    <p className="text-sm text-muted-foreground">Appointment Show Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DoctorDashboard;