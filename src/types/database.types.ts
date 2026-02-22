export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applicant_documents: {
        Row: {
          applicant_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          status: Database["public"]["Enums"]["document_status"]
          uploaded_at: string
        }
        Insert: {
          applicant_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          uploaded_at?: string
        }
        Update: {
          applicant_id?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicant_documents_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          address: string
          admission_type: string | null
          application_id: string
          board_institute: string
          city: string
          cnic: string
          created_at: string
          date_of_birth: string
          declaration_agreed: boolean
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          extra_activities: string | null
          faculty: string
          father_name: string
          first_name: string
          gender: string
          id: string
          last_name: string
          obtained_marks: number
          passing_year: number
          percentage: number | null
          phone: string
          photo_url: string | null
          program: string
          province: string | null
          qualification: string
          religion: string | null
          result_status: string | null
          roll_number: string | null
          selected_subjects: string[] | null
          signature_date: string
          signature_name: string
          status: Database["public"]["Enums"]["application_status"]
          study_mode: string | null
          total_marks: number | null
        }
        Insert: {
          address: string
          admission_type?: string | null
          application_id: string
          board_institute: string
          city: string
          cnic: string
          created_at?: string
          date_of_birth: string
          declaration_agreed?: boolean
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          extra_activities?: string | null
          faculty: string
          father_name: string
          first_name: string
          gender: string
          id?: string
          last_name: string
          obtained_marks: number
          passing_year: number
          percentage?: number | null
          phone: string
          photo_url?: string | null
          program: string
          province?: string | null
          qualification: string
          religion?: string | null
          result_status?: string | null
          roll_number?: string | null
          selected_subjects?: string[] | null
          signature_date: string
          signature_name: string
          status?: Database["public"]["Enums"]["application_status"]
          study_mode?: string | null
          total_marks?: number | null
        }
        Update: {
          address?: string
          admission_type?: string | null
          application_id?: string
          board_institute?: string
          city?: string
          cnic?: string
          created_at?: string
          date_of_birth?: string
          declaration_agreed?: boolean
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          extra_activities?: string | null
          faculty?: string
          father_name?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          obtained_marks?: number
          passing_year?: number
          percentage?: number | null
          phone?: string
          photo_url?: string | null
          program?: string
          province?: string | null
          qualification?: string
          religion?: string | null
          result_status?: string | null
          roll_number?: string | null
          selected_subjects?: string[] | null
          signature_date?: string
          signature_name?: string
          status?: Database["public"]["Enums"]["application_status"]
          study_mode?: string | null
          total_marks?: number | null
        }
        Relationships: []
      }
      application_reviews: {
        Row: {
          applicant_id: string
          decision: string
          id: string
          merit_score: number | null
          remarks: string | null
          review_date: string
          reviewed_by: string
        }
        Insert: {
          applicant_id: string
          decision: string
          id?: string
          merit_score?: number | null
          remarks?: string | null
          review_date?: string
          reviewed_by: string
        }
        Update: {
          applicant_id?: string
          decision?: string
          id?: string
          merit_score?: number | null
          remarks?: string | null
          review_date?: string
          reviewed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_reviews_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_reviews_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_users: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: [
          {
            foreignKeyName: "staff_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "accepted"
        | "rejected"
        | "waitlisted"
      document_status: "pending" | "uploaded" | "verified" | "rejected"
      document_type:
        | "cnic_copy"
        | "matric_cert"
        | "fsc_cert"
        | "domicile"
        | "photos"
        | "challan"
        | "character_cert"
      staff_role: "admin" | "reviewer" | "data_entry"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
