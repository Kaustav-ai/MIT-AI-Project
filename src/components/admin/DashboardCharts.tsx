import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Sample data - in real app, this would come from API
const userGrowthData = [
  { month: 'Jan', users: 1200, active: 800 },
  { month: 'Feb', users: 1800, active: 1200 },
  { month: 'Mar', users: 2400, active: 1600 },
  { month: 'Apr', users: 3200, active: 2100 },
  { month: 'May', users: 4100, active: 2800 },
  { month: 'Jun', users: 5200, active: 3500 },
];

const chatbotUsageData = [
  { hour: '00:00', queries: 12 },
  { hour: '04:00', queries: 8 },
  { hour: '08:00', queries: 45 },
  { hour: '12:00', queries: 78 },
  { hour: '16:00', queries: 65 },
  { hour: '20:00', queries: 32 },
];

const diseaseData = [
  { name: 'Diabetes', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Hypertension', value: 28, color: 'hsl(var(--secondary))' },
  { name: 'Respiratory', value: 20, color: 'hsl(var(--accent))' },
  { name: 'Mental Health', value: 12, color: 'hsl(var(--warning))' },
  { name: 'Others', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const monthlyDiseaseData = [
  { month: 'Jan', diabetes: 120, hypertension: 98, respiratory: 85 },
  { month: 'Feb', diabetes: 145, hypertension: 112, respiratory: 92 },
  { month: 'Mar', diabetes: 168, hypertension: 125, respiratory: 88 },
  { month: 'Apr', diabetes: 185, hypertension: 140, respiratory: 95 },
  { month: 'May', diabetes: 192, hypertension: 155, respiratory: 102 },
  { month: 'Jun', diabetes: 210, hypertension: 168, respiratory: 108 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="text-foreground">User Growth & Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="totalUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#totalUsers)"
                name="Total Users"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="hsl(var(--secondary))"
                fillOpacity={1}
                fill="url(#activeUsers)"
                name="Active Users"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chatbot Usage Chart */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="text-foreground">Chatbot Usage (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chatbotUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="queries"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Disease Distribution Pie Chart */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="text-foreground">Disease Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Disease Trends */}
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Disease Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyDiseaseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="diabetes" fill="hsl(var(--primary))" name="Diabetes" radius={[2, 2, 0, 0]} />
              <Bar dataKey="hypertension" fill="hsl(var(--secondary))" name="Hypertension" radius={[2, 2, 0, 0]} />
              <Bar dataKey="respiratory" fill="hsl(var(--accent))" name="Respiratory" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}