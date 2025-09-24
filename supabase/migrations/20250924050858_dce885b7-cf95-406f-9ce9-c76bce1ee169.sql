-- Add doctor-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN experience_years INTEGER,
ADD COLUMN location TEXT,
ADD COLUMN consultation_fee DECIMAL(10,2),
ADD COLUMN bio TEXT,
ADD COLUMN availability_hours JSONB DEFAULT '{"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []}'::jsonb;

-- Create consultations table for doctor-patient consultations
CREATE TABLE public.consultations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    consultation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    issue_description TEXT,
    consultation_type TEXT NOT NULL DEFAULT 'video', -- video, audio, chat
    consultation_fee DECIMAL(10,2) NOT NULL,
    discount_applied DECIMAL(10,2) DEFAULT 0,
    final_fee DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create earnings table to track doctor earnings
CREATE TABLE public.doctor_earnings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID NOT NULL,
    consultation_id UUID NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    discount_given DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    earned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_earnings ENABLE ROW LEVEL SECURITY;

-- RLS policies for consultations
CREATE POLICY "Doctors can view their consultations" 
ON public.consultations 
FOR SELECT 
USING (doctor_id = auth.uid());

CREATE POLICY "Patients can view their consultations" 
ON public.consultations 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Doctors can update their consultations" 
ON public.consultations 
FOR UPDATE 
USING (doctor_id = auth.uid());

CREATE POLICY "Patients can insert consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Admins can view all consultations" 
ON public.consultations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for doctor earnings
CREATE POLICY "Doctors can view their earnings" 
ON public.doctor_earnings 
FOR SELECT 
USING (doctor_id = auth.uid());

CREATE POLICY "Admins can view all earnings" 
ON public.doctor_earnings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add foreign key constraints
ALTER TABLE public.consultations 
ADD CONSTRAINT consultations_doctor_id_fkey 
FOREIGN KEY (doctor_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.consultations 
ADD CONSTRAINT consultations_patient_id_fkey 
FOREIGN KEY (patient_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.doctor_earnings 
ADD CONSTRAINT doctor_earnings_doctor_id_fkey 
FOREIGN KEY (doctor_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.doctor_earnings 
ADD CONSTRAINT doctor_earnings_consultation_id_fkey 
FOREIGN KEY (consultation_id) REFERENCES public.consultations(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON public.consultations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_consultations_doctor_id ON public.consultations(doctor_id);
CREATE INDEX idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX idx_consultations_date ON public.consultations(consultation_date);
CREATE INDEX idx_doctor_earnings_doctor_id ON public.doctor_earnings(doctor_id);
CREATE INDEX idx_doctor_earnings_date ON public.doctor_earnings(earned_date);