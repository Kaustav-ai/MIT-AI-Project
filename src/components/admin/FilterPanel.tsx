import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface FilterState {
  ageGroup: string;
  location: string;
  diseaseType: string;
}

export function FilterPanel() {
  const [filters, setFilters] = useState<FilterState>({
    ageGroup: "",
    location: "",
    diseaseType: ""
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    if (value && !activeFilters.includes(`${key}:${value}`)) {
      setActiveFilters(prev => [...prev, `${key}:${value}`]);
    }
  };

  const removeFilter = (filterKey: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filterKey));
    const [key] = filterKey.split(':');
    setFilters(prev => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({ ageGroup: "", location: "", diseaseType: "" });
    setActiveFilters([]);
  };

  return (
    <Card className="healthcare-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <span>Advanced Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Age Group Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Age Group</label>
            <Select value={filters.ageGroup} onValueChange={(value) => handleFilterChange('ageGroup', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="children">Children (0-12)</SelectItem>
                <SelectItem value="teens">Teens (13-19)</SelectItem>
                <SelectItem value="adults">Adults (20-64)</SelectItem>
                <SelectItem value="elderly">Elderly (65+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Disease Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Disease Type</label>
            <Select value={filters.diseaseType} onValueChange={(value) => handleFilterChange('diseaseType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select disease type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                <SelectItem value="respiratory">Respiratory</SelectItem>
                <SelectItem value="diabetes">Diabetes</SelectItem>
                <SelectItem value="hypertension">Hypertension</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="infectious">Infectious Diseases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Active Filters</label>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => {
                const [key, value] = filter.split(':');
                const displayValue = value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <Badge key={filter} variant="secondary" className="flex items-center space-x-1">
                    <span>{displayValue}</span>
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
