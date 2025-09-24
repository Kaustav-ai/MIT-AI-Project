import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, MessageSquare, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data - in real app, this would come from API
const recentActivity = [
  {
    id: 1,
    user: { name: "Kartik Subramanian", email: "kartik123@email.com", avatar: null },
    queryType: "Symptom Check",
    query: "Chest pain and shortness of breath",
    date: "2024-01-15",
    time: "10:30 AM",
    status: "completed",
    priority: "high"
  },
  {
    id: 2,
    user: { name: "Pooja Shetty", email: "pooja575@email.com", avatar: null },
    queryType: "Drug Interaction",
    query: "Interaction between aspirin and warfarin",
    date: "2024-01-15",
    time: "09:45 AM",
    status: "pending",
    priority: "medium"
  },
  {
    id: 3,
    user: { name: "Harleen Kaur ", email: "Harleen492@email.com", avatar: null },
    queryType: "Diagnosis Assistance",
    query: "Recurring headaches and dizziness",
    date: "2024-01-15",
    time: "09:15 AM",
    status: "completed",
    priority: "medium"
  },
  {
    id: 4,
    user: { name: "Gauri Gaikwad ", email: "guarigaikwad@email.com", avatar: null },
    queryType: "Preventive Care",
    query: "Vaccination schedule for elderly",
    date: "2024-01-15",
    time: "08:30 AM",
    status: "completed",
    priority: "low"
  },
  {
    id: 5,
    user: { name: "Aditya Deshmukh ", email: "aditya657@email.com", avatar: null },
    queryType: "Emergency",
    query: "Severe allergic reaction symptoms",
    date: "2024-01-14",
    time: "11:45 PM",
    status: "completed",
    priority: "critical"
  }
];

const statusConfig = {
  completed: { label: "Completed", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
  failed: { label: "Failed", variant: "destructive" as const }
};

const priorityConfig = {
  critical: { label: "Critical", variant: "destructive" as const },
  high: { label: "High", variant: "destructive" as const },
  medium: { label: "Medium", variant: "warning" as const },
  low: { label: "Low", variant: "secondary" as const }
};

const queryTypeIcons = {
  "Symptom Check": MessageSquare,
  "Drug Interaction": FileText,
  "Diagnosis Assistance": Eye,
  "Preventive Care": FileText,
  "Emergency": MessageSquare,
};

export function ActivityTable() {
  return (
    <Card className="healthcare-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Query Type</TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity) => {
              const IconComponent = queryTypeIcons[activity.queryType as keyof typeof queryTypeIcons] || MessageSquare;
              
              return (
                <TableRow key={activity.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.user.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{activity.queryType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground max-w-xs truncate" title={activity.query}>
                      {activity.query}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{activity.date}</p>
                      <p className="text-muted-foreground">{activity.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityConfig[activity.priority as keyof typeof priorityConfig].variant}>
                      {priorityConfig[activity.priority as keyof typeof priorityConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[activity.status as keyof typeof statusConfig].variant}>
                      {statusConfig[activity.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
