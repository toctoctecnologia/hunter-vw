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
      accounts: {
        Row: {
          active: boolean | null
          company_code: string | null
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company_code?: string | null
          created_at: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company_code?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      flyway_schema_history: {
        Row: {
          checksum: number | null
          description: string
          execution_time: number
          installed_by: string
          installed_on: string
          installed_rank: number
          script: string
          success: boolean
          type: string
          version: string | null
        }
        Insert: {
          checksum?: number | null
          description: string
          execution_time: number
          installed_by: string
          installed_on?: string
          installed_rank: number
          script: string
          success: boolean
          type: string
          version?: string | null
        }
        Update: {
          checksum?: number | null
          description?: string
          execution_time?: number
          installed_by?: string
          installed_on?: string
          installed_rank?: number
          script?: string
          success?: boolean
          type?: string
          version?: string | null
        }
        Relationships: []
      }
      r_account: {
        Row: {
          account_type: string
          active_properties_amount: number
          active_users_amount: number
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip_code: string | null
          asaas_customer_id: string | null
          company_account_id: number | null
          created_at: string | null
          email: string
          id: number
          name: string
          parent_account_id: number | null
          personal_account_id: number | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          account_type: string
          active_properties_amount: number
          active_users_amount: number
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          asaas_customer_id?: string | null
          company_account_id?: number | null
          created_at?: string | null
          email: string
          id?: number
          name: string
          parent_account_id?: number | null
          personal_account_id?: number | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          active_properties_amount?: number
          active_users_amount?: number
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          asaas_customer_id?: string | null
          company_account_id?: number | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          parent_account_id?: number | null
          personal_account_id?: number | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_account_company_account_id_fkey"
            columns: ["company_account_id"]
            isOneToOne: false
            referencedRelation: "r_company_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_account_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_account_personal_account_id_fkey"
            columns: ["personal_account_id"]
            isOneToOne: false
            referencedRelation: "r_personal_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_account_funnel_step_management: {
        Row: {
          account_id: number
          created_at: string
          funnel_step_id: number
          id: number
          target_percentage: number
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          funnel_step_id: number
          id?: number
          target_percentage: number
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          funnel_step_id?: number
          id?: number
          target_percentage?: number
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_account_funnel_step_management_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_account_funnel_step_management_funnel_step_id_fkey"
            columns: ["funnel_step_id"]
            isOneToOne: false
            referencedRelation: "r_funnel_step"
            referencedColumns: ["id"]
          },
        ]
      }
      r_account_upload_overlay: {
        Row: {
          account_id: number
          active: boolean
          created_at: string
          id: number
          margin: number
          opacity: number
          position: string
          scale: number
          updated_at: string
          watermark_image_path: string | null
        }
        Insert: {
          account_id: number
          active?: boolean
          created_at?: string
          id?: number
          margin?: number
          opacity?: number
          position: string
          scale?: number
          updated_at?: string
          watermark_image_path?: string | null
        }
        Update: {
          account_id?: number
          active?: boolean
          created_at?: string
          id?: number
          margin?: number
          opacity?: number
          position?: string
          scale?: number
          updated_at?: string
          watermark_image_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_account_upload_overlay_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_api_imoview_integration: {
        Row: {
          access_code: string | null
          access_code_expired_at: string | null
          account_id: number
          api_key: string | null
          created_at: string | null
          email: string | null
          id: number
          is_active: boolean
          password: string | null
          updated_at: string | null
          user_code: string | null
          user_code_expired_at: string | null
          uuid: string
        }
        Insert: {
          access_code?: string | null
          access_code_expired_at?: string | null
          account_id: number
          api_key?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          password?: string | null
          updated_at?: string | null
          user_code?: string | null
          user_code_expired_at?: string | null
          uuid: string
        }
        Update: {
          access_code?: string | null
          access_code_expired_at?: string | null
          account_id?: number
          api_key?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          password?: string | null
          updated_at?: string | null
          user_code?: string | null
          user_code_expired_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_api_imoview_integration_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_api_integration_cnm: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          is_active: boolean
          token: string | null
          updated_at: string | null
          uuid: string
          xml_path: string | null
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          is_active?: boolean
          token?: string | null
          updated_at?: string | null
          uuid: string
          xml_path?: string | null
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          is_active?: boolean
          token?: string | null
          updated_at?: string | null
          uuid?: string
          xml_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_api_integration_cnm_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_api_integration_dwv: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          is_active: boolean
          token: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          is_active?: boolean
          token?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          is_active?: boolean
          token?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_api_integration_dwv_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_api_integration_lais: {
        Row: {
          account_id: number
          created_at: string
          id: number
          integration_key: string
          is_active: boolean
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          id?: number
          integration_key: string
          is_active?: boolean
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          id?: number
          integration_key?: string
          is_active?: boolean
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_api_integration_lais_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_appointment: {
        Row: {
          account_id: number
          apple_calendar_url: string | null
          apple_event_id: string | null
          appointment_date: string
          color: string
          created_at: string | null
          description: string | null
          ending_time: string
          google_event_id: string | null
          id: number
          starting_time: string
          title: string
          updated_at: string | null
          user_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          apple_calendar_url?: string | null
          apple_event_id?: string | null
          appointment_date: string
          color: string
          created_at?: string | null
          description?: string | null
          ending_time: string
          google_event_id?: string | null
          id?: number
          starting_time: string
          title: string
          updated_at?: string | null
          user_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          apple_calendar_url?: string | null
          apple_event_id?: string | null
          appointment_date?: string
          color?: string
          created_at?: string | null
          description?: string | null
          ending_time?: string
          google_event_id?: string | null
          id?: number
          starting_time?: string
          title?: string
          updated_at?: string | null
          user_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_appointment_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_appointment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_archive_reason: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          reason: string
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          reason: string
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          reason?: string
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_archive_reason_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_assigned_user_offer: {
        Row: {
          account_id: number
          created_at: string | null
          expires_at: string | null
          id: number
          offered_at: string | null
          queue_assigned_offer_id: number
          queue_assigned_user_id: number
          status: string
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          expires_at?: string | null
          id?: number
          offered_at?: string | null
          queue_assigned_offer_id: number
          queue_assigned_user_id: number
          status: string
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          expires_at?: string | null
          id?: number
          offered_at?: string | null
          queue_assigned_offer_id?: number
          queue_assigned_user_id?: number
          status?: string
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_assigned_user_offer_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_assigned_user_offer_queue_assigned_offer_id_fkey"
            columns: ["queue_assigned_offer_id"]
            isOneToOne: false
            referencedRelation: "r_queue_assigned_offer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_assigned_user_offer_queue_assigned_user_id_fkey"
            columns: ["queue_assigned_user_id"]
            isOneToOne: false
            referencedRelation: "r_queue_assigned_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_bank: {
        Row: {
          code: string
          created_at: string
          id: number
          is_active: boolean
          name: string
          updated_at: string
          uuid: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string
          uuid: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      r_closed_deal: {
        Row: {
          account_id: number
          additional_info: string | null
          closed_date: string
          created_at: string
          id: number
          lead_id: number
          negotiation_type: string
          property_id: number
          proposal_id: number | null
          revenue_generation_date: string | null
          total_commission: number
          total_value: number
          uuid: string
        }
        Insert: {
          account_id: number
          additional_info?: string | null
          closed_date?: string
          created_at?: string
          id?: number
          lead_id: number
          negotiation_type: string
          property_id: number
          proposal_id?: number | null
          revenue_generation_date?: string | null
          total_commission: number
          total_value: number
          uuid: string
        }
        Update: {
          account_id?: number
          additional_info?: string | null
          closed_date?: string
          created_at?: string
          id?: number
          lead_id?: number
          negotiation_type?: string
          property_id?: number
          proposal_id?: number | null
          revenue_generation_date?: string | null
          total_commission?: number
          total_value?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_closed_deal_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_closed_deal_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_closed_deal_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_closed_deal_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_closed_deal_commission: {
        Row: {
          account_id: number
          agent_email: string | null
          agent_id: number | null
          agent_name: string
          agent_type: string
          closed_deal_id: number
          commission_percentage: number
          commission_value: number
          created_at: string
          federal_document: string | null
          id: number
          main_responsible: boolean
          property_id: number
        }
        Insert: {
          account_id: number
          agent_email?: string | null
          agent_id?: number | null
          agent_name: string
          agent_type: string
          closed_deal_id: number
          commission_percentage: number
          commission_value: number
          created_at?: string
          federal_document?: string | null
          id?: number
          main_responsible?: boolean
          property_id: number
        }
        Update: {
          account_id?: number
          agent_email?: string | null
          agent_id?: number | null
          agent_name?: string
          agent_type?: string
          closed_deal_id?: number
          commission_percentage?: number
          commission_value?: number
          created_at?: string
          federal_document?: string | null
          id?: number
          main_responsible?: boolean
          property_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_closed_deal_commission_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_closed_deal_commission_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_closed_deal_commission_closed_deal_id_fkey"
            columns: ["closed_deal_id"]
            isOneToOne: false
            referencedRelation: "r_closed_deal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_closed_deal_commission_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_company_account: {
        Row: {
          federal_document: string
          id: number
          municipal_registration: string | null
          social_reason: string
          state_registration: string | null
          unit_amount: number | null
          website: string | null
        }
        Insert: {
          federal_document: string
          id?: number
          municipal_registration?: string | null
          social_reason: string
          state_registration?: string | null
          unit_amount?: number | null
          website?: string | null
        }
        Update: {
          federal_document?: string
          id?: number
          municipal_registration?: string | null
          social_reason?: string
          state_registration?: string | null
          unit_amount?: number | null
          website?: string | null
        }
        Relationships: []
      }
      r_company_unit: {
        Row: {
          company_account_id: number
          created_at: string | null
          federal_document: string
          id: number
          is_active: boolean
          municipal_registration: string | null
          social_reason: string
          state_registration: string | null
          updated_at: string | null
          uuid: string
          website: string | null
        }
        Insert: {
          company_account_id: number
          created_at?: string | null
          federal_document: string
          id?: number
          is_active?: boolean
          municipal_registration?: string | null
          social_reason: string
          state_registration?: string | null
          updated_at?: string | null
          uuid: string
          website?: string | null
        }
        Update: {
          company_account_id?: number
          created_at?: string | null
          federal_document?: string
          id?: number
          is_active?: boolean
          municipal_registration?: string | null
          social_reason?: string
          state_registration?: string | null
          updated_at?: string | null
          uuid?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_company_unit_company_account_id_fkey"
            columns: ["company_account_id"]
            isOneToOne: false
            referencedRelation: "r_company_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_condominium: {
        Row: {
          account_id: number
          builder_id: number | null
          created_at: string | null
          description: string | null
          edifice_name: string | null
          external_code: number | null
          id: number
          manager: string | null
          name: string
          origin_type: string | null
          price: number | null
          principal_media_id: number | null
          updated_at: string | null
          uuid: string
          years: number | null
        }
        Insert: {
          account_id: number
          builder_id?: number | null
          created_at?: string | null
          description?: string | null
          edifice_name?: string | null
          external_code?: number | null
          id?: number
          manager?: string | null
          name: string
          origin_type?: string | null
          price?: number | null
          principal_media_id?: number | null
          updated_at?: string | null
          uuid: string
          years?: number | null
        }
        Update: {
          account_id?: number
          builder_id?: number | null
          created_at?: string | null
          description?: string | null
          edifice_name?: string | null
          external_code?: number | null
          id?: number
          manager?: string | null
          name?: string
          origin_type?: string | null
          price?: number | null
          principal_media_id?: number | null
          updated_at?: string | null
          uuid?: string
          years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_r_condominium_builder"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "r_property_builder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_r_condominium_principal_media"
            columns: ["principal_media_id"]
            isOneToOne: false
            referencedRelation: "r_condominium_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_condominium_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_condominium_feature: {
        Row: {
          account_id: number
          created_at: string | null
          description: string | null
          id: number
          name: string
          type: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          type?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          type?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_condominium_feature_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_condominium_feature_association: {
        Row: {
          condominium_id: number
          feature_id: number
        }
        Insert: {
          condominium_id: number
          feature_id: number
        }
        Update: {
          condominium_id?: number
          feature_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_condominium_feature_association_condominium_id_fkey"
            columns: ["condominium_id"]
            isOneToOne: false
            referencedRelation: "r_condominium"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_condominium_feature_association_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "r_condominium_feature"
            referencedColumns: ["id"]
          },
        ]
      }
      r_condominium_media: {
        Row: {
          account_id: number
          condominium_id: number
          created_at: string
          description: string | null
          id: number
          media_feature: string
          media_type: string
          media_url: string
          order: number
          status: string
          updated_at: string
        }
        Insert: {
          account_id: number
          condominium_id: number
          created_at?: string
          description?: string | null
          id?: number
          media_feature: string
          media_type: string
          media_url: string
          order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: number
          condominium_id?: number
          created_at?: string
          description?: string | null
          id?: number
          media_feature?: string
          media_type?: string
          media_url?: string
          order?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_condominium_media_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_condominium_media_condominium_id_fkey"
            columns: ["condominium_id"]
            isOneToOne: false
            referencedRelation: "r_condominium"
            referencedColumns: ["id"]
          },
        ]
      }
      r_coupon: {
        Row: {
          code: string
          coupon_type: string
          created_at: string
          created_by_user_id: number | null
          deactivated_at: string | null
          deactivated_by_user_id: number | null
          description: string | null
          discount_percentage: number
          expiration_date: string | null
          id: number
          is_active: boolean
          max_usage_count: number | null
          usage_count: number
          uuid: string
        }
        Insert: {
          code: string
          coupon_type: string
          created_at?: string
          created_by_user_id?: number | null
          deactivated_at?: string | null
          deactivated_by_user_id?: number | null
          description?: string | null
          discount_percentage: number
          expiration_date?: string | null
          id?: number
          is_active?: boolean
          max_usage_count?: number | null
          usage_count?: number
          uuid: string
        }
        Update: {
          code?: string
          coupon_type?: string
          created_at?: string
          created_by_user_id?: number | null
          deactivated_at?: string | null
          deactivated_by_user_id?: number | null
          description?: string | null
          discount_percentage?: number
          expiration_date?: string | null
          id?: number
          is_active?: boolean
          max_usage_count?: number | null
          usage_count?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_coupon_created_by_user"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_coupon_deactivated_by_user"
            columns: ["deactivated_by_user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_coupon_usage: {
        Row: {
          account_id: number
          asaas_payment_id: string | null
          coupon_id: number
          discount_applied: number
          final_amount: number
          id: number
          original_amount: number
          used_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          asaas_payment_id?: string | null
          coupon_id: number
          discount_applied: number
          final_amount: number
          id?: number
          original_amount: number
          used_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          asaas_payment_id?: string | null
          coupon_id?: number
          discount_applied?: number
          final_amount?: number
          id?: number
          original_amount?: number
          used_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_coupon_usage_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_coupon_usage_coupon"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "r_coupon"
            referencedColumns: ["id"]
          },
        ]
      }
      r_credit_analyse_documents: {
        Row: {
          account_id: number
          created_at: string
          credit_analyse_id: number
          file_name: string
          id: number
          media_type: string
          media_url: string
          status: string
          updated_at: string
        }
        Insert: {
          account_id: number
          created_at?: string
          credit_analyse_id: number
          file_name: string
          id?: number
          media_type: string
          media_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: number
          created_at?: string
          credit_analyse_id?: number
          file_name?: string
          id?: number
          media_type?: string
          media_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_credit_analyse_documents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_credit_analyse_documents_credit_analyse_id_fkey"
            columns: ["credit_analyse_id"]
            isOneToOne: false
            referencedRelation: "r_lead_credit_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      r_funnel_step: {
        Row: {
          can_update_lead_property: boolean
          code: string
          created_at: string
          display_name: string
          display_order: number
          id: number
          uuid: string
        }
        Insert: {
          can_update_lead_property?: boolean
          code: string
          created_at?: string
          display_name: string
          display_order: number
          id?: number
          uuid: string
        }
        Update: {
          can_update_lead_property?: boolean
          code?: string
          created_at?: string
          display_name?: string
          display_order?: number
          id?: number
          uuid?: string
        }
        Relationships: []
      }
      r_integration_job: {
        Row: {
          account_id: number
          created_at: string | null
          error_message: string | null
          finished_at: string | null
          id: number
          integration_type: string
          started_at: string | null
          status: string
          step: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: number
          integration_type: string
          started_at?: string | null
          status?: string
          step?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: number
          integration_type?: string
          started_at?: string | null
          status?: string
          step?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_integration_job_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead: {
        Row: {
          account_id: number
          ad_url: string | null
          archive_reason_id: number | null
          archived_by: number | null
          can_join_roletao: boolean | null
          can_modify_queue: boolean | null
          catcher_id: number | null
          contact_origin_type: string | null
          conversation_summary: string | null
          created_at: string
          email: string | null
          external_code: string | null
          first_contacted_at: string | null
          funnel_step: string | null
          funnel_step_id: number | null
          id: number
          intensity_type: string | null
          is_accessor_enabled: boolean
          is_after_roulette_distribution: boolean
          is_summary_processed: boolean | null
          last_contacted_at: string | null
          last_whatsapp_contact_at: string | null
          message_to_catcher: string | null
          name: string
          negotiation_type: string | null
          origin_type: string | null
          phone_1: string | null
          phone_2: string | null
          phone1: string | null
          phone2: string | null
          product_price: number | null
          product_title: string | null
          property_code: string | null
          property_id: number | null
          queue_id: number | null
          status: string
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          ad_url?: string | null
          archive_reason_id?: number | null
          archived_by?: number | null
          can_join_roletao?: boolean | null
          can_modify_queue?: boolean | null
          catcher_id?: number | null
          contact_origin_type?: string | null
          conversation_summary?: string | null
          created_at?: string
          email?: string | null
          external_code?: string | null
          first_contacted_at?: string | null
          funnel_step?: string | null
          funnel_step_id?: number | null
          id?: number
          intensity_type?: string | null
          is_accessor_enabled?: boolean
          is_after_roulette_distribution?: boolean
          is_summary_processed?: boolean | null
          last_contacted_at?: string | null
          last_whatsapp_contact_at?: string | null
          message_to_catcher?: string | null
          name: string
          negotiation_type?: string | null
          origin_type?: string | null
          phone_1?: string | null
          phone_2?: string | null
          phone1?: string | null
          phone2?: string | null
          product_price?: number | null
          product_title?: string | null
          property_code?: string | null
          property_id?: number | null
          queue_id?: number | null
          status: string
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          ad_url?: string | null
          archive_reason_id?: number | null
          archived_by?: number | null
          can_join_roletao?: boolean | null
          can_modify_queue?: boolean | null
          catcher_id?: number | null
          contact_origin_type?: string | null
          conversation_summary?: string | null
          created_at?: string
          email?: string | null
          external_code?: string | null
          first_contacted_at?: string | null
          funnel_step?: string | null
          funnel_step_id?: number | null
          id?: number
          intensity_type?: string | null
          is_accessor_enabled?: boolean
          is_after_roulette_distribution?: boolean
          is_summary_processed?: boolean | null
          last_contacted_at?: string | null
          last_whatsapp_contact_at?: string | null
          message_to_catcher?: string | null
          name?: string
          negotiation_type?: string | null
          origin_type?: string | null
          phone_1?: string | null
          phone_2?: string | null
          phone1?: string | null
          phone2?: string | null
          product_price?: number | null
          product_title?: string | null
          property_code?: string | null
          property_id?: number | null
          queue_id?: number | null
          status?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_archive_reason_id_fkey"
            columns: ["archive_reason_id"]
            isOneToOne: false
            referencedRelation: "r_lead_archive_reason"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_catcher_id_fkey"
            columns: ["catcher_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_funnel_step_id_fkey"
            columns: ["funnel_step_id"]
            isOneToOne: false
            referencedRelation: "r_funnel_step"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_additional_info: {
        Row: {
          account_id: number
          created_at: string
          created_by: number | null
          description: string
          id: number
          lead_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          created_by?: number | null
          description: string
          id?: number
          lead_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          created_by?: number | null
          description?: string
          id?: number
          lead_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_additional_info_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_additional_info_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_additional_info_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_archive_reason: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          reason: string
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          reason: string
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          reason?: string
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_archive_reason_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_credit_analysis: {
        Row: {
          account_id: number
          created_at: string
          credit_approval_status: string
          declared_invoice: number | null
          id: number
          lead_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          credit_approval_status: string
          declared_invoice?: number | null
          id?: number
          lead_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          credit_approval_status?: string
          declared_invoice?: number | null
          id?: number
          lead_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_credit_analysis_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_credit_analysis_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_import_batch_job: {
        Row: {
          account_id: number
          created_at: string
          error_count: number | null
          error_message: string | null
          file_name: string
          finished_at: string | null
          id: number
          processed_records: number | null
          started_at: string | null
          status: string
          total_records: number | null
          updated_at: string
          user_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          error_count?: number | null
          error_message?: string | null
          file_name: string
          finished_at?: string | null
          id?: number
          processed_records?: number | null
          started_at?: string | null
          status?: string
          total_records?: number | null
          updated_at?: string
          user_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          error_count?: number | null
          error_message?: string | null
          file_name?: string
          finished_at?: string | null
          id?: number
          processed_records?: number | null
          started_at?: string | null
          status?: string
          total_records?: number | null
          updated_at?: string
          user_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_import_batch_job_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_import_batch_job_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_property: {
        Row: {
          created_at: string
          id: number
          lead_id: number
          property_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          lead_id: number
          property_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          lead_id?: number
          property_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_property_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_property_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_property_preference_history: {
        Row: {
          account_id: number
          area: number | null
          bathrooms: number | null
          city: string | null
          created_at: string
          external_area: number | null
          garage_spots: number | null
          id: number
          internal_area: number | null
          lead_id: number
          lot_area: number | null
          neighborhood: string | null
          property_type: string | null
          property_value: number | null
          rooms: number | null
          state: string | null
          suites: number | null
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          area?: number | null
          bathrooms?: number | null
          city?: string | null
          created_at?: string
          external_area?: number | null
          garage_spots?: number | null
          id?: number
          internal_area?: number | null
          lead_id: number
          lot_area?: number | null
          neighborhood?: string | null
          property_type?: string | null
          property_value?: number | null
          rooms?: number | null
          state?: string | null
          suites?: number | null
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          area?: number | null
          bathrooms?: number | null
          city?: string | null
          created_at?: string
          external_area?: number | null
          garage_spots?: number | null
          id?: number
          internal_area?: number | null
          lead_id?: number
          lot_area?: number | null
          neighborhood?: string | null
          property_type?: string | null
          property_value?: number | null
          rooms?: number | null
          state?: string | null
          suites?: number | null
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lead_property_preference_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_qualification_times_management: {
        Row: {
          account_id: number
          attention_max_days: number
          attention_min_days: number
          created_at: string
          id: number
          recent_max_days: number
          updated_at: string
          urgent_min_days: number
        }
        Insert: {
          account_id: number
          attention_max_days?: number
          attention_min_days?: number
          created_at?: string
          id?: number
          recent_max_days?: number
          updated_at?: string
          urgent_min_days?: number
        }
        Update: {
          account_id?: number
          attention_max_days?: number
          attention_min_days?: number
          created_at?: string
          id?: number
          recent_max_days?: number
          updated_at?: string
          urgent_min_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_lead_qualification_times_management_account"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_lead_updates: {
        Row: {
          account_id: number
          created_at: string
          created_by: number | null
          description: string
          id: number
          lead_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          created_by?: number | null
          description: string
          id?: number
          lead_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          created_by?: number | null
          description?: string
          id?: number
          lead_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_lead_updates_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_lead_updates_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
        ]
      }
      r_notification: {
        Row: {
          account_id: number
          created_at: string | null
          description: string | null
          id: number
          is_viewed: boolean | null
          target_entity_type: string | null
          target_entity_uuid: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: number
          uuid: string
          viewed_at: string | null
        }
        Insert: {
          account_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          is_viewed?: boolean | null
          target_entity_type?: string | null
          target_entity_uuid?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: number
          uuid: string
          viewed_at?: string | null
        }
        Update: {
          account_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          is_viewed?: boolean | null
          target_entity_type?: string | null
          target_entity_uuid?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: number
          uuid?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_notification_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_notification_campaign: {
        Row: {
          account_id: number
          channels: string
          content: string
          created_at: string
          created_by_user_id: number
          day_of_month: number | null
          day_of_week: string | null
          delivered_count: number | null
          end_date: string | null
          failed_count: number | null
          filter_cities: string | null
          filter_districts: string | null
          filter_max_services: number | null
          filter_min_services: number | null
          filter_states: string | null
          frequency: string | null
          id: number
          name: string | null
          next_execution_at: string | null
          recipient_count: number | null
          send_time: string | null
          sent_at: string | null
          start_date: string | null
          status: string
          template_uuid: string | null
          title: string
          type: string
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          channels: string
          content: string
          created_at?: string
          created_by_user_id: number
          day_of_month?: number | null
          day_of_week?: string | null
          delivered_count?: number | null
          end_date?: string | null
          failed_count?: number | null
          filter_cities?: string | null
          filter_districts?: string | null
          filter_max_services?: number | null
          filter_min_services?: number | null
          filter_states?: string | null
          frequency?: string | null
          id?: number
          name?: string | null
          next_execution_at?: string | null
          recipient_count?: number | null
          send_time?: string | null
          sent_at?: string | null
          start_date?: string | null
          status?: string
          template_uuid?: string | null
          title: string
          type: string
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          channels?: string
          content?: string
          created_at?: string
          created_by_user_id?: number
          day_of_month?: number | null
          day_of_week?: string | null
          delivered_count?: number | null
          end_date?: string | null
          failed_count?: number | null
          filter_cities?: string | null
          filter_districts?: string | null
          filter_max_services?: number | null
          filter_min_services?: number | null
          filter_states?: string | null
          frequency?: string | null
          id?: number
          name?: string | null
          next_execution_at?: string | null
          recipient_count?: number | null
          send_time?: string | null
          sent_at?: string | null
          start_date?: string | null
          status?: string
          template_uuid?: string | null
          title?: string
          type?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notification_campaign_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notification_campaign_user"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_notification_campaign_recipient: {
        Row: {
          campaign_id: number
          channel: string
          delivered_at: string | null
          error_message: string | null
          id: number
          sent_at: string | null
          status: string
          user_id: number
        }
        Insert: {
          campaign_id: number
          channel: string
          delivered_at?: string | null
          error_message?: string | null
          id?: number
          sent_at?: string | null
          status?: string
          user_id: number
        }
        Update: {
          campaign_id?: number
          channel?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: number
          sent_at?: string | null
          status?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_recipient_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "r_notification_campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campaign_recipient_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_notification_campaign_template: {
        Row: {
          account_id: number
          channel: string
          content: string
          content_type: string
          created_at: string
          id: number
          is_active: boolean
          name: string
          subject: string | null
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          channel: string
          content: string
          content_type?: string
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          subject?: string | null
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          channel?: string
          content?: string
          content_type?: string
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          subject?: string | null
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaign_template_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_notification_channel_config: {
        Row: {
          account_id: number
          channel: string
          config_json: Json | null
          created_at: string
          id: number
          is_enabled: boolean
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          channel: string
          config_json?: Json | null
          created_at?: string
          id?: number
          is_enabled?: boolean
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          channel?: string
          config_json?: Json | null
          created_at?: string
          id?: number
          is_enabled?: boolean
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notification_channel_config_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_notification_template: {
        Row: {
          created_at: string
          created_by_user_id: number | null
          id: number
          is_active: boolean
          message_text: string
          name: string
          notification_type: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: number | null
          id?: number
          is_active?: boolean
          message_text: string
          name: string
          notification_type: string
          updated_at?: string
          uuid: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: number | null
          id?: number
          is_active?: boolean
          message_text?: string
          name?: string
          notification_type?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_notification_template_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_pending_plan_change: {
        Row: {
          account_id: number
          asaas_payment_id: string | null
          asaas_subscription_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          current_payment_period: string
          current_plan_id: number
          effective_date: string
          id: number
          new_payment_period: string
          new_plan_id: number
          new_signature_price: number
          payment_link: string | null
          processed_at: string | null
          status: string
          uuid: string
        }
        Insert: {
          account_id: number
          asaas_payment_id?: string | null
          asaas_subscription_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_payment_period: string
          current_plan_id: number
          effective_date: string
          id?: number
          new_payment_period: string
          new_plan_id: number
          new_signature_price: number
          payment_link?: string | null
          processed_at?: string | null
          status?: string
          uuid: string
        }
        Update: {
          account_id?: number
          asaas_payment_id?: string | null
          asaas_subscription_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_payment_period?: string
          current_plan_id?: number
          effective_date?: string
          id?: number
          new_payment_period?: string
          new_plan_id?: number
          new_signature_price?: number
          payment_link?: string | null
          processed_at?: string | null
          status?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_pending_plan_change_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_pending_plan_change_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "r_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_pending_plan_change_new_plan_id_fkey"
            columns: ["new_plan_id"]
            isOneToOne: false
            referencedRelation: "r_plan"
            referencedColumns: ["id"]
          },
        ]
      }
      r_permission: {
        Row: {
          code: string
          description: string
          id: number
          name: string
          permission_group_id: number
          tier: number
        }
        Insert: {
          code: string
          description: string
          id?: number
          name: string
          permission_group_id: number
          tier: number
        }
        Update: {
          code?: string
          description?: string
          id?: number
          name?: string
          permission_group_id?: number
          tier?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_permission_group"
            columns: ["permission_group_id"]
            isOneToOne: false
            referencedRelation: "r_permission_group"
            referencedColumns: ["id"]
          },
        ]
      }
      r_permission_group: {
        Row: {
          code: string
          description: string
          id: number
          name: string
        }
        Insert: {
          code: string
          description: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      r_personal_account: {
        Row: {
          city: string
          creci: string
          federal_document: string
          id: number
        }
        Insert: {
          city: string
          creci: string
          federal_document: string
          id?: number
        }
        Update: {
          city?: string
          creci?: string
          federal_document?: string
          id?: number
        }
        Relationships: []
      }
      r_plan: {
        Row: {
          active_properties_amount: number | null
          active_users_amount: number | null
          annual_signature_price: number | null
          description: string
          id: number
          monthly_signature_price: number | null
          name: string
          tier: number
          uuid: string
        }
        Insert: {
          active_properties_amount?: number | null
          active_users_amount?: number | null
          annual_signature_price?: number | null
          description: string
          id?: number
          monthly_signature_price?: number | null
          name: string
          tier: number
          uuid: string
        }
        Update: {
          active_properties_amount?: number | null
          active_users_amount?: number | null
          annual_signature_price?: number | null
          description?: string
          id?: number
          monthly_signature_price?: number | null
          name?: string
          tier?: number
          uuid?: string
        }
        Relationships: []
      }
      r_presigned_action_url: {
        Row: {
          access_token: string
          account_id: number
          action: string
          created_at: string | null
          expires_at: string
          id: number
          token_used: boolean | null
          user_id: number
        }
        Insert: {
          access_token: string
          account_id: number
          action: string
          created_at?: string | null
          expires_at: string
          id?: number
          token_used?: boolean | null
          user_id: number
        }
        Update: {
          access_token?: string
          account_id?: number
          action?: string
          created_at?: string | null
          expires_at?: string
          id?: number
          token_used?: boolean | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_presigned_action_url_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_presigned_action_url_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_profile: {
        Row: {
          account_id: number
          code: string
          description: string
          id: number
          name: string
        }
        Insert: {
          account_id: number
          code: string
          description: string
          id?: number
          name: string
        }
        Update: {
          account_id?: number
          code?: string
          description?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_profile_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_profile_permission: {
        Row: {
          granted_at: string | null
          permission_id: number
          profile_id: number
        }
        Insert: {
          granted_at?: string | null
          permission_id: number
          profile_id: number
        }
        Update: {
          granted_at?: string | null
          permission_id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_profile_permission_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "r_permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_profile_permission_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "r_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property: {
        Row: {
          accepts_financing: boolean | null
          accepts_permuta: boolean | null
          access: string | null
          account_id: number | null
          ad_description: string | null
          ad_title: string | null
          archive_reason_id: number | null
          area: number | null
          balconies: number | null
          bathrooms: number | null
          builder_id: number | null
          city: string | null
          code: number
          commission: number | null
          company_unit_id: number | null
          condominium: number | null
          condominium_id: number | null
          construction_status: string | null
          created_at: string | null
          description: string | null
          destination: string | null
          direct_with_owner: boolean | null
          displayed_on_portal: boolean | null
          district: string | null
          elevators_count: number | null
          external_area: number | null
          external_code: number | null
          floor: string | null
          floor_finish: string | null
          floors_count: number | null
          furnished_status: string | null
          garage_location: string | null
          garage_spots: number | null
          garage_type: string | null
          id: number
          internal_area: number | null
          internet_publication: boolean | null
          iptu_value: number | null
          is_available: boolean | null
          is_available_for_rent: boolean | null
          is_highlighted: boolean | null
          key_identifier: string | null
          key_location: string | null
          keys_amount: number | null
          last_contact: string | null
          launch_type: string | null
          living_rooms: number | null
          lot_area: number | null
          meta_description: string | null
          name: string
          number: string | null
          origin_type: string | null
          payment_methods: string | null
          previous_price: number | null
          price: number | null
          principal_media_id: number | null
          property_position: string | null
          property_position_type: string | null
          property_type: string
          purpose: string | null
          readiness_status: string | null
          region: string | null
          rooms: number | null
          secondary_district_id: number | null
          secondary_type: string | null
          sign_authorized: boolean | null
          sign_details: string | null
          sign_status: string | null
          situation: string | null
          state: string | null
          status: string | null
          status_justification: string | null
          street: string | null
          sub_region: string | null
          suites: number | null
          team_id: number | null
          termination_date: string | null
          total_units: number | null
          towers_count: number | null
          unit: string | null
          units_per_floor: number | null
          updated_at: string | null
          usage_zone: string | null
          uuid: string
          zip_code: string | null
        }
        Insert: {
          accepts_financing?: boolean | null
          accepts_permuta?: boolean | null
          access?: string | null
          account_id?: number | null
          ad_description?: string | null
          ad_title?: string | null
          archive_reason_id?: number | null
          area?: number | null
          balconies?: number | null
          bathrooms?: number | null
          builder_id?: number | null
          city?: string | null
          code: number
          commission?: number | null
          company_unit_id?: number | null
          condominium?: number | null
          condominium_id?: number | null
          construction_status?: string | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          direct_with_owner?: boolean | null
          displayed_on_portal?: boolean | null
          district?: string | null
          elevators_count?: number | null
          external_area?: number | null
          external_code?: number | null
          floor?: string | null
          floor_finish?: string | null
          floors_count?: number | null
          furnished_status?: string | null
          garage_location?: string | null
          garage_spots?: number | null
          garage_type?: string | null
          id?: number
          internal_area?: number | null
          internet_publication?: boolean | null
          iptu_value?: number | null
          is_available?: boolean | null
          is_available_for_rent?: boolean | null
          is_highlighted?: boolean | null
          key_identifier?: string | null
          key_location?: string | null
          keys_amount?: number | null
          last_contact?: string | null
          launch_type?: string | null
          living_rooms?: number | null
          lot_area?: number | null
          meta_description?: string | null
          name: string
          number?: string | null
          origin_type?: string | null
          payment_methods?: string | null
          previous_price?: number | null
          price?: number | null
          principal_media_id?: number | null
          property_position?: string | null
          property_position_type?: string | null
          property_type: string
          purpose?: string | null
          readiness_status?: string | null
          region?: string | null
          rooms?: number | null
          secondary_district_id?: number | null
          secondary_type?: string | null
          sign_authorized?: boolean | null
          sign_details?: string | null
          sign_status?: string | null
          situation?: string | null
          state?: string | null
          status?: string | null
          status_justification?: string | null
          street?: string | null
          sub_region?: string | null
          suites?: number | null
          team_id?: number | null
          termination_date?: string | null
          total_units?: number | null
          towers_count?: number | null
          unit?: string | null
          units_per_floor?: number | null
          updated_at?: string | null
          usage_zone?: string | null
          uuid: string
          zip_code?: string | null
        }
        Update: {
          accepts_financing?: boolean | null
          accepts_permuta?: boolean | null
          access?: string | null
          account_id?: number | null
          ad_description?: string | null
          ad_title?: string | null
          archive_reason_id?: number | null
          area?: number | null
          balconies?: number | null
          bathrooms?: number | null
          builder_id?: number | null
          city?: string | null
          code?: number
          commission?: number | null
          company_unit_id?: number | null
          condominium?: number | null
          condominium_id?: number | null
          construction_status?: string | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          direct_with_owner?: boolean | null
          displayed_on_portal?: boolean | null
          district?: string | null
          elevators_count?: number | null
          external_area?: number | null
          external_code?: number | null
          floor?: string | null
          floor_finish?: string | null
          floors_count?: number | null
          furnished_status?: string | null
          garage_location?: string | null
          garage_spots?: number | null
          garage_type?: string | null
          id?: number
          internal_area?: number | null
          internet_publication?: boolean | null
          iptu_value?: number | null
          is_available?: boolean | null
          is_available_for_rent?: boolean | null
          is_highlighted?: boolean | null
          key_identifier?: string | null
          key_location?: string | null
          keys_amount?: number | null
          last_contact?: string | null
          launch_type?: string | null
          living_rooms?: number | null
          lot_area?: number | null
          meta_description?: string | null
          name?: string
          number?: string | null
          origin_type?: string | null
          payment_methods?: string | null
          previous_price?: number | null
          price?: number | null
          principal_media_id?: number | null
          property_position?: string | null
          property_position_type?: string | null
          property_type?: string
          purpose?: string | null
          readiness_status?: string | null
          region?: string | null
          rooms?: number | null
          secondary_district_id?: number | null
          secondary_type?: string | null
          sign_authorized?: boolean | null
          sign_details?: string | null
          sign_status?: string | null
          situation?: string | null
          state?: string | null
          status?: string | null
          status_justification?: string | null
          street?: string | null
          sub_region?: string | null
          suites?: number | null
          team_id?: number | null
          termination_date?: string | null
          total_units?: number | null
          towers_count?: number | null
          unit?: string | null
          units_per_floor?: number | null
          updated_at?: string | null
          usage_zone?: string | null
          uuid?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_property_company_unit"
            columns: ["company_unit_id"]
            isOneToOne: false
            referencedRelation: "r_company_unit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_property_secondary_district"
            columns: ["secondary_district_id"]
            isOneToOne: false
            referencedRelation: "r_secondary_district"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_r_property_principal_media"
            columns: ["principal_media_id"]
            isOneToOne: false
            referencedRelation: "r_property_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_archive_reason_id_fkey"
            columns: ["archive_reason_id"]
            isOneToOne: false
            referencedRelation: "r_archive_reason"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_builder_id_fkey"
            columns: ["builder_id"]
            isOneToOne: false
            referencedRelation: "r_property_builder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_condominium_id_fkey"
            columns: ["condominium_id"]
            isOneToOne: false
            referencedRelation: "r_condominium"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "r_team"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_builder: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
          uuid: string
          years_of_experience: number | null
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
          uuid: string
          years_of_experience?: number | null
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          uuid?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "r_property_builder_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_catcher: {
        Row: {
          catcher_id: number
          created_at: string | null
          id: number
          is_main: boolean | null
          percentage: number
          property_id: number
          referred_by: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          catcher_id: number
          created_at?: string | null
          id?: number
          is_main?: boolean | null
          percentage: number
          property_id: number
          referred_by?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          catcher_id?: number
          created_at?: string | null
          id?: number
          is_main?: boolean | null
          percentage?: number
          property_id?: number
          referred_by?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_catcher_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_property_catcher_user"
            columns: ["catcher_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_code_sequence: {
        Row: {
          account_id: number
          next_code: number
        }
        Insert: {
          account_id: number
          next_code?: number
        }
        Update: {
          account_id?: number
          next_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_property_code_sequence_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_feature: {
        Row: {
          account_id: number
          created_at: string | null
          description: string | null
          id: number
          name: string
          type: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          type?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          type?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_property_feature_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_feature_association: {
        Row: {
          feature_id: number
          property_id: number
        }
        Insert: {
          feature_id: number
          property_id: number
        }
        Update: {
          feature_id?: number
          property_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_property_feature_association_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "r_property_feature"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_feature_association_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_keychain_assignment: {
        Row: {
          board: string | null
          board_position: string | null
          created_at: string
          id: number
          key_quantity: number | null
          observation: string | null
          property_id: number
          seal_number: string | null
          status: string
          unit: string | null
          updated_at: string
          uuid: string
        }
        Insert: {
          board?: string | null
          board_position?: string | null
          created_at?: string
          id?: number
          key_quantity?: number | null
          observation?: string | null
          property_id: number
          seal_number?: string | null
          status: string
          unit?: string | null
          updated_at?: string
          uuid: string
        }
        Update: {
          board?: string | null
          board_position?: string | null
          created_at?: string
          id?: number
          key_quantity?: number | null
          observation?: string | null
          property_id?: number
          seal_number?: string | null
          status?: string
          unit?: string | null
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_keychain_assignment_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_media: {
        Row: {
          account_id: number
          created_at: string
          description: string | null
          external_url: string | null
          id: number
          media_feature: string
          media_type: string
          media_url: string
          order: number
          property_id: number
          status: string
          updated_at: string
        }
        Insert: {
          account_id: number
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: number
          media_feature: string
          media_type: string
          media_url: string
          order?: number
          property_id: number
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: number
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: number
          media_feature?: string
          media_type?: string
          media_url?: string
          order?: number
          property_id?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_property_media_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_note: {
        Row: {
          account_id: number
          created_at: string | null
          description: string
          id: number
          note_type: string
          property_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          account_id: number
          created_at?: string | null
          description: string
          id?: number
          note_type: string
          property_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          account_id?: number
          created_at?: string | null
          description?: string
          id?: number
          note_type?: string
          property_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_property_note_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_note_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_note_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_owner: {
        Row: {
          cpf_cnpj: string | null
          created_at: string | null
          id: number
          name: string
          percentage: number
          phone: string | null
          property_id: number
          updated_at: string | null
          uuid: string
        }
        Insert: {
          cpf_cnpj?: string | null
          created_at?: string | null
          id?: number
          name: string
          percentage: number
          phone?: string | null
          property_id: number
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          cpf_cnpj?: string | null
          created_at?: string | null
          id?: number
          name?: string
          percentage?: number
          phone?: string | null
          property_id?: number
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_owner_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_qualification_times_management: {
        Row: {
          account_id: number
          attention_max_days: number
          attention_min_days: number
          created_at: string
          id: number
          recent_max_days: number
          updated_at: string
          urgent_min_days: number
        }
        Insert: {
          account_id: number
          attention_max_days?: number
          attention_min_days?: number
          created_at?: string
          id?: number
          recent_max_days?: number
          updated_at?: string
          urgent_min_days?: number
        }
        Update: {
          account_id?: number
          attention_max_days?: number
          attention_min_days?: number
          created_at?: string
          id?: number
          recent_max_days?: number
          updated_at?: string
          urgent_min_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_qualification_times_management_account"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_user: {
        Row: {
          property_id: number
          user_id: number
        }
        Insert: {
          property_id: number
          user_id: number
        }
        Update: {
          property_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_property_user_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_property_visiting_hours: {
        Row: {
          account_id: number
          created_at: string | null
          day_of_week: string
          end_time: string | null
          id: number
          property_id: number
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: number
          created_at?: string | null
          day_of_week: string
          end_time?: string | null
          id?: number
          property_id: number
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: number
          created_at?: string | null
          day_of_week?: string
          end_time?: string | null
          id?: number
          property_id?: number
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_property_visiting_hours_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_property_visiting_hours_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal: {
        Row: {
          account_id: number
          created_at: string
          id: number
          lead_id: number
          property_id: number | null
          proposal_total_value: number | null
          status: string | null
          updated_at: string
          uuid: string
          validity: string
        }
        Insert: {
          account_id: number
          created_at?: string
          id?: number
          lead_id: number
          property_id?: number | null
          proposal_total_value?: number | null
          status?: string | null
          updated_at?: string
          uuid: string
          validity: string
        }
        Update: {
          account_id?: number
          created_at?: string
          id?: number
          lead_id?: number
          property_id?: number | null
          proposal_total_value?: number | null
          status?: string | null
          updated_at?: string
          uuid?: string
          validity?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_consortium: {
        Row: {
          account_id: number
          consortium_contemplated: boolean
          consortium_value: number
          created_at: string
          id: number
          proposal_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          consortium_contemplated: boolean
          consortium_value: number
          created_at?: string
          id?: number
          proposal_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          consortium_contemplated?: boolean
          consortium_value?: number
          created_at?: string
          id?: number
          proposal_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_consortium_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_consortium_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_exchange: {
        Row: {
          account_id: number
          created_at: string
          exchange_type: string
          exchange_value: number
          id: number
          observations: string | null
          proposal_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          exchange_type: string
          exchange_value: number
          id?: number
          observations?: string | null
          proposal_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          exchange_type?: string
          exchange_value?: number
          id?: number
          observations?: string | null
          proposal_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_exchange_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_exchange_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_financing: {
        Row: {
          account_id: number
          bank_id: number | null
          created_at: string
          fgts_value: number | null
          financing_percent: number
          id: number
          proposal_id: number
          signal_value: number
          tax_rate: number
          term: number
          uuid: string
        }
        Insert: {
          account_id: number
          bank_id?: number | null
          created_at?: string
          fgts_value?: number | null
          financing_percent: number
          id?: number
          proposal_id: number
          signal_value: number
          tax_rate: number
          term: number
          uuid: string
        }
        Update: {
          account_id?: number
          bank_id?: number | null
          created_at?: string
          fgts_value?: number | null
          financing_percent?: number
          id?: number
          proposal_id?: number
          signal_value?: number
          tax_rate?: number
          term?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_financing_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_financing_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "r_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_financing_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_other: {
        Row: {
          account_id: number
          amount: number
          created_at: string
          description: string
          id: number
          proposal_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          amount: number
          created_at?: string
          description: string
          id?: number
          proposal_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          amount?: number
          created_at?: string
          description?: string
          id?: number
          proposal_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_other_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_other_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_own_resources: {
        Row: {
          account_id: number
          balance: number | null
          created_at: string
          id: number
          proposal_id: number
          resource_amount: number
          uuid: string
        }
        Insert: {
          account_id: number
          balance?: number | null
          created_at?: string
          id?: number
          proposal_id: number
          resource_amount: number
          uuid: string
        }
        Update: {
          account_id?: number
          balance?: number | null
          created_at?: string
          id?: number
          proposal_id?: number
          resource_amount?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_own_resources_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_own_resources_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_payment_conditions: {
        Row: {
          account_id: number
          condition_type: string
          created_at: string
          id: number
          proposal_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          condition_type: string
          created_at?: string
          id?: number
          proposal_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          condition_type?: string
          created_at?: string
          id?: number
          proposal_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_payment_conditions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_payment_conditions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_proposal_signal: {
        Row: {
          account_id: number
          created_at: string
          id: number
          observations: string | null
          price_index: string
          proposal_id: number
          signal_date: string | null
          signal_value: number | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          id?: number
          observations?: string | null
          price_index: string
          proposal_id: number
          signal_date?: string | null
          signal_value?: number | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          id?: number
          observations?: string | null
          price_index?: string
          proposal_id?: number
          signal_date?: string | null
          signal_value?: number | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_proposal_signal_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_proposal_signal_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "r_proposal"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue: {
        Row: {
          account_id: number
          check_in_required: boolean
          color: string | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          is_default: boolean | null
          is_deleted: boolean
          name: string
          next_user_enabled: boolean | null
          queue_order: number
          time_limit_minutes: number | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          check_in_required?: boolean
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          is_deleted?: boolean
          name: string
          next_user_enabled?: boolean | null
          queue_order: number
          time_limit_minutes?: number | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          check_in_required?: boolean
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          is_deleted?: boolean
          name?: string
          next_user_enabled?: boolean | null
          queue_order?: number
          time_limit_minutes?: number | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue_assigned_offer: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          lead_id: number
          queue_id: number
          terminated_at: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          lead_id: number
          queue_id: number
          terminated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          lead_id?: number
          queue_id?: number
          terminated_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_assigned_offer_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_assigned_offer_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_assigned_offer_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "r_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue_assigned_user: {
        Row: {
          account_id: number
          checkin_at: string | null
          created_at: string | null
          id: number
          queue_execution_id: number
          updated_at: string | null
          user_id: number
          user_order: number
        }
        Insert: {
          account_id: number
          checkin_at?: string | null
          created_at?: string | null
          id?: number
          queue_execution_id: number
          updated_at?: string | null
          user_id: number
          user_order: number
        }
        Update: {
          account_id?: number
          checkin_at?: string | null
          created_at?: string | null
          id?: number
          queue_execution_id?: number
          updated_at?: string | null
          user_id?: number
          user_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_assigned_user_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_assigned_user_queue_execution_id_fkey"
            columns: ["queue_execution_id"]
            isOneToOne: false
            referencedRelation: "r_queue_execution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_assigned_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue_checkin: {
        Row: {
          account_id: number
          created_at: string | null
          days_of_week: string
          ending_time: string | null
          id: number
          is_active: boolean | null
          qr_code_enabled: boolean | null
          queue_id: number
          starting_time: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          days_of_week: string
          ending_time?: string | null
          id?: number
          is_active?: boolean | null
          qr_code_enabled?: boolean | null
          queue_id: number
          starting_time?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          days_of_week?: string
          ending_time?: string | null
          id?: number
          is_active?: boolean | null
          qr_code_enabled?: boolean | null
          queue_id?: number
          starting_time?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_checkin_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_checkin_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "r_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue_execution: {
        Row: {
          account_id: number
          created_at: string | null
          finished_at: string | null
          id: number
          queue_id: number
          started_at: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          finished_at?: string | null
          id?: number
          queue_id: number
          started_at?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          finished_at?: string | null
          id?: number
          queue_id?: number
          started_at?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_execution_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_execution_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "r_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue_rule: {
        Row: {
          account_id: number
          created_at: string | null
          expected_value: string | null
          id: number
          operation: string
          r_queue_id: number
          r_rule_id: number
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          expected_value?: string | null
          id?: number
          operation: string
          r_queue_id: number
          r_rule_id: number
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          expected_value?: string | null
          id?: number
          operation?: string
          r_queue_id?: number
          r_rule_id?: number
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_rule_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_rule_r_queue_id_fkey"
            columns: ["r_queue_id"]
            isOneToOne: false
            referencedRelation: "r_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_rule_r_rule_id_fkey"
            columns: ["r_rule_id"]
            isOneToOne: false
            referencedRelation: "r_rule"
            referencedColumns: ["id"]
          },
        ]
      }
      r_queue_user: {
        Row: {
          account_id: number
          created_at: string | null
          id: number
          is_active: boolean | null
          observation: string | null
          opened_leads_limit: number | null
          queue_id: number
          updated_at: string | null
          user_id: number
          user_order: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          observation?: string | null
          opened_leads_limit?: number | null
          queue_id: number
          updated_at?: string | null
          user_id: number
          user_order: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          observation?: string | null
          opened_leads_limit?: number | null
          queue_id?: number
          updated_at?: string | null
          user_id?: number
          user_order?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_queue_user_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_user_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "r_queue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_queue_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_redistribution_batch_job: {
        Row: {
          account_id: number
          created_at: string
          error_message: string | null
          file_name: string
          finished_at: string | null
          id: number
          started_at: string | null
          status: string
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          error_message?: string | null
          file_name: string
          finished_at?: string | null
          id?: number
          started_at?: string | null
          status?: string
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          error_message?: string | null
          file_name?: string
          finished_at?: string | null
          id?: number
          started_at?: string | null
          status?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_redistribution_batch_job_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_report_job: {
        Row: {
          account_id: number
          columns: string[]
          created_at: string
          file_path: string | null
          filters: string
          format: string
          id: string
          processed_at: string | null
          report_type: string
          status: string
        }
        Insert: {
          account_id: number
          columns: string[]
          created_at?: string
          file_path?: string | null
          filters: string
          format: string
          id: string
          processed_at?: string | null
          report_type: string
          status: string
        }
        Update: {
          account_id?: number
          columns?: string[]
          created_at?: string
          file_path?: string | null
          filters?: string
          format?: string
          id?: string
          processed_at?: string | null
          report_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_report_job_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_roulette_execution: {
        Row: {
          account_id: number
          created_at: string | null
          finished_at: string | null
          id: number
          started_at: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string | null
          finished_at?: string | null
          id?: number
          started_at?: string | null
          updated_at?: string | null
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string | null
          finished_at?: string | null
          id?: number
          started_at?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_roulette_execution_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_roulette_offers: {
        Row: {
          account_id: number
          catcher_id: number | null
          created_at: string | null
          id: number
          lead_id: number
          queue_id: number | null
          status: string
          terminated_at: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: number
          catcher_id?: number | null
          created_at?: string | null
          id?: number
          lead_id: number
          queue_id?: number | null
          status: string
          terminated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: number
          catcher_id?: number | null
          created_at?: string | null
          id?: number
          lead_id?: number
          queue_id?: number | null
          status?: string
          terminated_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_roulette_offers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_roulette_offers_catcher_id_fkey"
            columns: ["catcher_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_roulette_offers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_roulette_offers_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "r_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      r_roullete_settings: {
        Row: {
          account_id: number
          available_days: string
          created_at: string
          end_time: string
          id: number
          is_active: boolean
          only_queue_users_distribution: boolean
          start_time: string
          time_limit_minutes: number
          updated_at: string
        }
        Insert: {
          account_id: number
          available_days: string
          created_at?: string
          end_time: string
          id?: number
          is_active?: boolean
          only_queue_users_distribution?: boolean
          start_time: string
          time_limit_minutes?: number
          updated_at?: string
        }
        Update: {
          account_id?: number
          available_days?: string
          created_at?: string
          end_time?: string
          id?: number
          is_active?: boolean
          only_queue_users_distribution?: boolean
          start_time?: string
          time_limit_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_roullete_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_rule: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
          uuid: string
          value_type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
          uuid: string
          value_type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          uuid?: string
          value_type?: string | null
        }
        Relationships: []
      }
      r_rule_operations_expected: {
        Row: {
          id: number
          operation: string
          rule_id: number
        }
        Insert: {
          id?: number
          operation: string
          rule_id: number
        }
        Update: {
          id?: number
          operation?: string
          rule_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_rule_operations_expected_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "r_rule"
            referencedColumns: ["id"]
          },
        ]
      }
      r_search_index: {
        Row: {
          account_id: number
          created_at: string
          entity_id: number
          entity_type: string
          entity_uuid: string
          id: number
          metadata: Json | null
          search_content: string | null
          search_vector: unknown
          subtitle: string | null
          title: string
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          entity_id: number
          entity_type: string
          entity_uuid: string
          id?: number
          metadata?: Json | null
          search_content?: string | null
          search_vector?: unknown
          subtitle?: string | null
          title: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          account_id?: number
          created_at?: string
          entity_id?: number
          entity_type?: string
          entity_uuid?: string
          id?: number
          metadata?: Json | null
          search_content?: string | null
          search_vector?: unknown
          subtitle?: string | null
          title?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      r_secondary_district: {
        Row: {
          account_id: number
          created_at: string
          id: number
          name: string
          updated_at: string
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          id?: number
          name: string
          updated_at?: string
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "r_secondary_district_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
        ]
      }
      r_signature: {
        Row: {
          account_id: number
          asaas_subscription_id: string | null
          expiration_date: string
          id: number
          payment_period: string | null
          plan_id: number
          signature_price: number | null
          status: string | null
          test_period_active: boolean | null
        }
        Insert: {
          account_id: number
          asaas_subscription_id?: string | null
          expiration_date: string
          id?: number
          payment_period?: string | null
          plan_id: number
          signature_price?: number | null
          status?: string | null
          test_period_active?: boolean | null
        }
        Update: {
          account_id?: number
          asaas_subscription_id?: string | null
          expiration_date?: string
          id?: number
          payment_period?: string | null
          plan_id?: number
          signature_price?: number | null
          status?: string | null
          test_period_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "r_signature_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_signature_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "r_plan"
            referencedColumns: ["id"]
          },
        ]
      }
      r_task: {
        Row: {
          account_id: number
          color: string
          created_at: string | null
          description: string | null
          id: number
          is_completed: boolean | null
          lead_id: number | null
          property_id: number | null
          task_date: string
          task_time: string
          task_type_id: number
          title: string
          updated_at: string | null
          user_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          color: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_completed?: boolean | null
          lead_id?: number | null
          property_id?: number | null
          task_date: string
          task_time: string
          task_type_id: number
          title: string
          updated_at?: string | null
          user_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          color?: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_completed?: boolean | null
          lead_id?: number | null
          property_id?: number | null
          task_date?: string
          task_time?: string
          task_type_id?: number
          title?: string
          updated_at?: string | null
          user_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_r_schedule_task_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "r_property"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_task_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "r_lead"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_task_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_task_task_type_id_fkey"
            columns: ["task_type_id"]
            isOneToOne: false
            referencedRelation: "r_task_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_task_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_task_type: {
        Row: {
          code: string
          description: string | null
          id: number
          lead_required: boolean
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          id?: number
          lead_required?: boolean
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: number
          lead_required?: boolean
          name?: string
        }
        Relationships: []
      }
      r_team: {
        Row: {
          account_id: number | null
          branch: string | null
          city: string | null
          company_unit_id: number | null
          complement: string | null
          created_at: string
          id: number
          is_active: boolean
          name: string
          neighborhood: string | null
          notes: string | null
          number: string | null
          state: string | null
          street: string | null
          updated_at: string
          uuid: string
          zip_code: string | null
        }
        Insert: {
          account_id?: number | null
          branch?: string | null
          city?: string | null
          company_unit_id?: number | null
          complement?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          uuid: string
          zip_code?: string | null
        }
        Update: {
          account_id?: number | null
          branch?: string | null
          city?: string | null
          company_unit_id?: number | null
          complement?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          uuid?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "r_team_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_team_company_unit_id_fkey"
            columns: ["company_unit_id"]
            isOneToOne: false
            referencedRelation: "r_company_unit"
            referencedColumns: ["id"]
          },
        ]
      }
      r_team_user: {
        Row: {
          team_id: number
          user_id: number
        }
        Insert: {
          team_id: number
          user_id: number
        }
        Update: {
          team_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_team_user_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "r_team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_team_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      r_user: {
        Row: {
          accept_automatically_distributed_leads: boolean | null
          accessed_at: string | null
          account_id: number
          apple_calendar_connected_at: string | null
          apple_calendar_token: string | null
          apple_calendar_url: string | null
          company_unit_id: number | null
          created_at: string | null
          email: string
          external_code: string | null
          id: number
          is_active: boolean | null
          is_super_admin: boolean | null
          name: string
          ocupation: string | null
          origin_type: string | null
          phone: string | null
          profile_id: number | null
          profile_picture_url: string | null
          roulette_signed: boolean | null
          scheduled_termination_at: string | null
          show_roulette_popup: boolean | null
          updated_at: string | null
          uuid: string
          whatsapp_history_session: string | null
        }
        Insert: {
          accept_automatically_distributed_leads?: boolean | null
          accessed_at?: string | null
          account_id: number
          apple_calendar_connected_at?: string | null
          apple_calendar_token?: string | null
          apple_calendar_url?: string | null
          company_unit_id?: number | null
          created_at?: string | null
          email: string
          external_code?: string | null
          id?: number
          is_active?: boolean | null
          is_super_admin?: boolean | null
          name: string
          ocupation?: string | null
          origin_type?: string | null
          phone?: string | null
          profile_id?: number | null
          profile_picture_url?: string | null
          roulette_signed?: boolean | null
          scheduled_termination_at?: string | null
          show_roulette_popup?: boolean | null
          updated_at?: string | null
          uuid: string
          whatsapp_history_session?: string | null
        }
        Update: {
          accept_automatically_distributed_leads?: boolean | null
          accessed_at?: string | null
          account_id?: number
          apple_calendar_connected_at?: string | null
          apple_calendar_token?: string | null
          apple_calendar_url?: string | null
          company_unit_id?: number | null
          created_at?: string | null
          email?: string
          external_code?: string | null
          id?: number
          is_active?: boolean | null
          is_super_admin?: boolean | null
          name?: string
          ocupation?: string | null
          origin_type?: string | null
          phone?: string | null
          profile_id?: number | null
          profile_picture_url?: string | null
          roulette_signed?: boolean | null
          scheduled_termination_at?: string | null
          show_roulette_popup?: boolean | null
          updated_at?: string | null
          uuid?: string
          whatsapp_history_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_company_unit"
            columns: ["company_unit_id"]
            isOneToOne: false
            referencedRelation: "r_company_unit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_user_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_user_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "r_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      r_user_invite: {
        Row: {
          account_id: number
          company_unit_id: number | null
          created_at: string | null
          details: string | null
          email: string
          expires_at: string
          id: number
          is_expired: boolean
          name: string
          origin_type: string | null
          phone: string | null
          profile_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          company_unit_id?: number | null
          created_at?: string | null
          details?: string | null
          email: string
          expires_at: string
          id?: number
          is_expired?: boolean
          name: string
          origin_type?: string | null
          phone?: string | null
          profile_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          company_unit_id?: number | null
          created_at?: string | null
          details?: string | null
          email?: string
          expires_at?: string
          id?: number
          is_expired?: boolean
          name?: string
          origin_type?: string | null
          phone?: string | null
          profile_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_invite_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_invite_company_unit"
            columns: ["company_unit_id"]
            isOneToOne: false
            referencedRelation: "r_company_unit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_invite_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "r_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      r_user_notification_reminder: {
        Row: {
          account_id: number
          created_at: string
          day_of_month: number | null
          day_of_week: string | null
          frequency: string
          id: number
          is_active: boolean
          is_enabled: boolean
          notification_template_id: number | null
          notification_type: string
          reminder_time: string
          updated_at: string
          user_id: number
          uuid: string
        }
        Insert: {
          account_id: number
          created_at?: string
          day_of_month?: number | null
          day_of_week?: string | null
          frequency?: string
          id?: number
          is_active?: boolean
          is_enabled?: boolean
          notification_template_id?: number | null
          notification_type?: string
          reminder_time: string
          updated_at?: string
          user_id: number
          uuid: string
        }
        Update: {
          account_id?: number
          created_at?: string
          day_of_month?: number | null
          day_of_week?: string | null
          frequency?: string
          id?: number
          is_active?: boolean
          is_enabled?: boolean
          notification_template_id?: number | null
          notification_type?: string
          reminder_time?: string
          updated_at?: string
          user_id?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_notification_reminder_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_notification_reminder_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_user_notification_reminder_notification_template_id_fkey"
            columns: ["notification_template_id"]
            isOneToOne: false
            referencedRelation: "r_notification_template"
            referencedColumns: ["id"]
          },
        ]
      }
      r_user_whatsapp_session: {
        Row: {
          access_token: string | null
          account_id: number
          created_at: string | null
          expires_at: string | null
          id: number
          phone_number: string
          user_id: number
          validated_at: string | null
          validation_attempt: number | null
          validation_token: number
        }
        Insert: {
          access_token?: string | null
          account_id: number
          created_at?: string | null
          expires_at?: string | null
          id?: number
          phone_number: string
          user_id: number
          validated_at?: string | null
          validation_attempt?: number | null
          validation_token: number
        }
        Update: {
          access_token?: string | null
          account_id?: number
          created_at?: string | null
          expires_at?: string | null
          id?: number
          phone_number?: string
          user_id?: number
          validated_at?: string | null
          validation_attempt?: number | null
          validation_token?: number
        }
        Relationships: [
          {
            foreignKeyName: "r_user_whatsapp_session_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "r_account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "r_user_whatsapp_session_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "r_user"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_id: string | null
          active: boolean | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          active?: boolean | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          active?: boolean | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_search_vector: {
        Args: { p_search_content: string; p_subtitle: string; p_title: string }
        Returns: unknown
      }
      get_next_property_code: {
        Args: { p_account_id: number }
        Returns: number
      }
      normalize_phone: { Args: { phone: string }; Returns: string }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
