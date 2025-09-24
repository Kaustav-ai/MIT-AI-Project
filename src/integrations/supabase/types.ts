export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points_reward: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points_reward?: number
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points_reward?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      consultations: {
        Row: {
          consultation_date: string
          consultation_fee: number
          consultation_type: string
          created_at: string
          discount_applied: number | null
          doctor_id: string
          final_fee: number
          id: string
          issue_description: string | null
          notes: string | null
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          consultation_date: string
          consultation_fee: number
          consultation_type?: string
          created_at?: string
          discount_applied?: number | null
          doctor_id: string
          final_fee: number
          id?: string
          issue_description?: string | null
          notes?: string | null
          patient_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          consultation_date?: string
          consultation_fee?: number
          consultation_type?: string
          created_at?: string
          discount_applied?: number | null
          doctor_id?: string
          final_fee?: number
          id?: string
          issue_description?: string | null
          notes?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      doctor_earnings: {
        Row: {
          consultation_id: string
          created_at: string
          discount_given: number
          doctor_id: string
          earned_date: string
          gross_amount: number
          id: string
          net_amount: number
        }
        Insert: {
          consultation_id: string
          created_at?: string
          discount_given?: number
          doctor_id: string
          earned_date?: string
          gross_amount: number
          id?: string
          net_amount: number
        }
        Update: {
          consultation_id?: string
          created_at?: string
          discount_given?: number
          doctor_id?: string
          earned_date?: string
          gross_amount?: number
          id?: string
          net_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "doctor_earnings_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_earnings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          created_at: string
          description: string
          id: string
          points_change: number
          related_session_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points_change: number
          related_session_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points_change?: number
          related_session_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_related_session_id_fkey"
            columns: ["related_session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability_hours: Json | null
          bio: string | null
          consultation_fee: number | null
          created_at: string | null
          department: string | null
          experience_years: number | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          patient_id: string | null
          phone: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability_hours?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          department?: string | null
          experience_years?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          patient_id?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability_hours?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          department?: string | null
          experience_years?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          patient_id?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          category: string
          correct_answer: number
          created_at: string
          difficulty: string
          explanation: string | null
          id: string
          options: Json
          points: number
          question: string
          updated_at: string
        }
        Insert: {
          category: string
          correct_answer: number
          created_at?: string
          difficulty: string
          explanation?: string | null
          id?: string
          options: Json
          points?: number
          question: string
          updated_at?: string
        }
        Update: {
          category?: string
          correct_answer?: number
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          options?: Json
          points?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          category: string
          completed_at: string | null
          correct_answers: number
          created_at: string
          difficulty: string
          id: string
          total_points: number
          total_questions: number
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          difficulty: string
          id?: string
          total_points?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          difficulty?: string
          id?: string
          total_points?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      user_quiz_attempts: {
        Row: {
          attempt_date: string
          id: string
          is_correct: boolean
          points_earned: number
          question_id: string
          quiz_session_id: string
          selected_answer: number
          user_id: string
        }
        Insert: {
          attempt_date?: string
          id?: string
          is_correct: boolean
          points_earned?: number
          question_id: string
          quiz_session_id: string
          selected_answer: number
          user_id: string
        }
        Update: {
          attempt_date?: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          question_id?: string
          quiz_session_id?: string
          selected_answer?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          badges: Json | null
          created_at: string
          current_streak: number
          id: string
          last_quiz_date: string | null
          lifetime_points: number
          longest_streak: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          badges?: Json | null
          created_at?: string
          current_streak?: number
          id?: string
          last_quiz_date?: string | null
          lifetime_points?: number
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          badges?: Json | null
          created_at?: string
          current_streak?: number
          id?: string
          last_quiz_date?: string | null
          lifetime_points?: number
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "doctor", "patient"],
    },
  },
} as const
