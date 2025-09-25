import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import doctorImage from "@/assets/doctor-consultation.jpg";
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock,
  Filter,
  Search,
  Heart,
  Brain,
  Stethoscope,
  Eye,
  Bone
} from "lucide-react";
import { Suspense, lazy } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  location: string;
  price: number;
  available: boolean;
  languages: string[];
  image: string;
}

const DoctorConnect = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [consultationType, setConsultationType] = useState<"video" | "audio" | "chat">("video");
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const MapView = useMemo(() => lazy(async () => ({ default: (await import('@/components/MapView')).default })), []);
  const navigate = useNavigate();

  const specialties = [
    { value: "cardiology", label: "Cardiology", icon: Heart },
    { value: "neurology", label: "Neurology", icon: Brain },
    { value: "general", label: "General Medicine", icon: Stethoscope },
    { value: "ophthalmology", label: "Ophthalmology", icon: Eye },
    { value: "orthopedics", label: "Orthopedics", icon: Bone },
  ];

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Vinod Raina",
      specialty: "Cardiology",
      rating: 4.9,
      experience: 12,
      location: "2.3 km away",
      price: 550,
      available: true,
      languages: ["English", "Hindi"],
      image: "/api/placeholder/150/150"
    },
    {
      id: "2",
      name: "Dr. Sakshi Mehta",
      specialty: "Neurology",
      rating: 4.8,
      experience: 15,
      location: "1.8 km away",
      price: 700,
      available: true,
      languages: ["Hindi", "English", "Marathi"],
      image: "/api/placeholder/150/150"
    },
    {
      id: "3",
      name: "Dr. Priya Patel",
      specialty: "General Medicine",
      rating: 4.7,
      experience: 8,
      location: "3.1 km away",
      price: 375,
      available: false,
      languages: ["English", "Hindi"],
      image: "/api/placeholder/150/150"
    },
    {
      id: "4",
      name: "Dr. Niral Shah",
      specialty: "Ophthalmology",
      rating: 4.9,
      experience: 20,
      location: "4.2 km away",
      price: 550,
      available: true,
      languages: ["English", "Hindi", "Gujarati"],
      image: "/api/placeholder/150/150"
    }
  ];

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(doctor => 
    selectedSpecialty === "all" || !selectedSpecialty || doctor.specialty.toLowerCase().includes(selectedSpecialty)
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => setGeoError(err.message || 'Failed to get location'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const ConsultationTypeButton = ({ type, icon: Icon, label }: { 
    type: "video" | "audio" | "chat", 
    icon: any, 
    label: string 
  }) => (
    <Button
      variant={consultationType === type ? "hero" : "outline"}
      onClick={() => setConsultationType(type)}
      className="flex-1"
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Connect with <span className="text-primary">Expert Doctors</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get instant access to qualified healthcare professionals through video calls, voice consultations, or chat.
              </p>
              
              {/* Consultation Type Selector */}
              <div className="flex space-x-2 mb-6">
                <ConsultationTypeButton type="video" icon={Video} label="Video Call" />
                <ConsultationTypeButton type="audio" icon={Phone} label="Voice Call" />
                <ConsultationTypeButton type="chat" icon={MessageCircle} label="Chat" />
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={doctorImage} 
                alt="Doctor consultation" 
                className="rounded-2xl shadow-[var(--shadow-lg)] hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="healthcare-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      <span className="flex items-center gap-2">
                        {spec.icon && <span className="inline-flex items-center justify-center w-5 h-5"><spec.icon className="w-4 h-4" /></span>}
                        {spec.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Nearest Doctors Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2 h-96 rounded-xl overflow-hidden border">
              <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading map...</div>}>
                <MapView
                  userPosition={userPosition}
                  onBook={() => navigate('/payment')}
                  markers={(userPosition ? [
                    { id: 'm1', pos: [userPosition[0] + 0.01, userPosition[1] + 0.01], name: 'Dr. Nearby A' },
                    { id: 'm2', pos: [userPosition[0] - 0.008, userPosition[1] + 0.006], name: 'Dr. Nearby B' },
                    { id: 'm3', pos: [userPosition[0] + 0.006, userPosition[1] - 0.01], name: 'Dr. Nearby C' },
                  ] : [
                    { id: 'd1', pos: [28.6139, 77.2090], name: 'Dr. Delhi' },
                    { id: 'd2', pos: [19.0760, 72.8777], name: 'Dr. Mumbai' },
                    { id: 'd3', pos: [13.0827, 80.2707], name: 'Dr. Chennai' },
                  ]) as any}
                />
              </Suspense>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Nearest Doctors</h3>
              <p className="text-sm text-muted-foreground">We use your location to suggest doctors close to you.</p>
              {geoError && <div className="text-sm text-destructive">{geoError}</div>}
            </div>
          </div>

          {/* Specialties Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {specialties.map((specialty) => {
              const Icon = specialty.icon;
              return (
                <Button
                  key={specialty.value}
                  variant={selectedSpecialty === specialty.value ? "hero" : "outline"}
                  onClick={() => setSelectedSpecialty(specialty.value)}
                  className="flex flex-col h-24 card-hover"
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <span className="text-xs">{specialty.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="healthcare-card card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{doctor.rating}</span>
                        </div>
                        <Badge variant="secondary">{doctor.experience} years</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm ${doctor.available ? "text-success" : "text-muted-foreground"}`}>
                      {doctor.available ? "Available now" : "Busy"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{doctor.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">/ session</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {consultationType === "video" && <Video className="h-4 w-4 text-primary" />}
                      {consultationType === "audio" && <Phone className="h-4 w-4 text-primary" />}
                      {consultationType === "chat" && <MessageCircle className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={doctor.available ? "hero" : "outline"}
                    disabled={!doctor.available}
                    onClick={() => doctor.available && navigate("/payment", {
                      state: {
                        doctorId: doctor.id,
                        doctorName: doctor.name,
                        fee: doctor.price,
                        consultationType
                      }
                    })}
                  >
                    {doctor.available ? "Book Consultation" : "Schedule Later"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DoctorConnect;
