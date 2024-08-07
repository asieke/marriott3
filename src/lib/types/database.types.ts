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
      artists: {
        Row: {
          base64: string
          birth: string
          category: string
          description: string
          died: string
          id: number
          location: string
          name: string
        }
        Insert: {
          base64?: string
          birth?: string
          category?: string
          description?: string
          died?: string
          id: number
          location?: string
          name?: string
        }
        Update: {
          base64?: string
          birth?: string
          category?: string
          description?: string
          died?: string
          id?: number
          location?: string
          name?: string
        }
        Relationships: []
      }
      arts: {
        Row: {
          artist: string
          base64: string
          facts: string[]
          id: number
          summary: string
          title: string
          year: string
        }
        Insert: {
          artist?: string
          base64?: string
          facts: string[]
          id: number
          summary?: string
          title?: string
          year?: string
        }
        Update: {
          artist?: string
          base64?: string
          facts?: string[]
          id?: number
          summary?: string
          title?: string
          year?: string
        }
        Relationships: []
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
          id: number
          text: string
        }
        Insert: {
          base64?: string
          id?: number
          text?: string
        }
        Update: {
          base64?: string
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
      count_artists: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_arts: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_events_with_images: {
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
