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
      albums: {
        Row: {
          created_at: string
          google_album_id: string | null
          id: number
          img_url: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          google_album_id?: string | null
          id?: number
          img_url?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          google_album_id?: string | null
          id?: number
          img_url?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          artist_url: string | null
          base64: string | null
          category: string | null
          created_at: string | null
          description: string | null
          end_year: string | null
          has_images: boolean | null
          id: number
          image_count: string | null
          img_url: string | null
          name: string | null
          region: string | null
          short_description: string | null
          start_year: string | null
        }
        Insert: {
          artist_url?: string | null
          base64?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_year?: string | null
          has_images?: boolean | null
          id: number
          image_count?: string | null
          img_url?: string | null
          name?: string | null
          region?: string | null
          short_description?: string | null
          start_year?: string | null
        }
        Update: {
          artist_url?: string | null
          base64?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_year?: string | null
          has_images?: boolean | null
          id?: number
          image_count?: string | null
          img_url?: string | null
          name?: string | null
          region?: string | null
          short_description?: string | null
          start_year?: string | null
        }
        Relationships: []
      }
      arts: {
        Row: {
          artist_id: number
          base64: string
          category: string | null
          created_at: string | null
          id: number
          popular: boolean
          sk: string | null
          title: string
        }
        Insert: {
          artist_id: number
          base64: string
          category?: string | null
          created_at?: string | null
          id: number
          popular?: boolean
          sk?: string | null
          title: string
        }
        Update: {
          artist_id?: number
          base64?: string
          category?: string | null
          created_at?: string | null
          id?: number
          popular?: boolean
          sk?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "arts_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      calendars: {
        Row: {
          created_at: string
          description: string | null
          google_id: string
          id: number
          is_selected: boolean | null
          summary: string | null
          summaryOverride: string | null
          timeZone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          google_id: string
          id?: number
          is_selected?: boolean | null
          summary?: string | null
          summaryOverride?: string | null
          timeZone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          google_id?: string
          id?: number
          is_selected?: boolean | null
          summary?: string | null
          summaryOverride?: string | null
          timeZone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          base64: string
          context: string
          date: string
          facts: string[]
          id: number
          image_query: string
          long_summary: string
          questions: string[]
          slug: string
          summary: string
          title: string
        }
        Insert: {
          base64?: string
          context?: string
          date?: string
          facts: string[]
          id: number
          image_query?: string
          long_summary?: string
          questions: string[]
          slug?: string
          summary?: string
          title?: string
        }
        Update: {
          base64?: string
          context?: string
          date?: string
          facts?: string[]
          id?: number
          image_query?: string
          long_summary?: string
          questions?: string[]
          slug?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      sentences: {
        Row: {
          base64: string
          created_at: string
          id: number
          text: string
        }
        Insert: {
          base64?: string
          created_at?: string
          id?: number
          text: string
        }
        Update: {
          base64?: string
          created_at?: string
          id?: number
          text?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_art_popular: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_artists: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_events_total: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_events_with_image: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_sentences: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_count_arts_with_image: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_random_art: {
        Args: Record<PropertyKey, never>
        Returns: {
          artist_id: number
          artist_name: string
          artist_url: string
          short_description: string
          start_year: string
          end_year: string
          region: string
          artist_category: string
          image_id: number
          sk: string
          title: string
          image_category: string
          image_url: string
          view_count: number
        }[]
      }
      get_random_event: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          title: string
          date: string
          summary: string
          long_summary: string
          facts: string[]
          questions: string[]
          base64: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
