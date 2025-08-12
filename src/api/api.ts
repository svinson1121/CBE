// src/api.ts
import axios from "axios";

// Vite Proxy i sused to add CORS Headers..


export const API_BASE = "/api/ecbe/v1";


const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CreateCbsPayload {
  cbe_name?: string;
  category?: "normal" | "high_priority" | "background";
  repetition_period: number;
  num_of_bcast: number;
  scope: { scope_plmn: Record<string, unknown> };
  smscb_message: {
    message_id: number;
    serial_nr: {
      serial_nr_decoded: {
        geo_scope: "plmn_wide" | "cell_wide" | "lac_sac_tac_wide" | "cell_wide_immediate";
        msg_code: number;
        update_nr: number;
      };
    };
    payload: {
      payload_decoded: {
        character_set: "gsm" | "ucs2" | "8bit";
        data_utf8: string;
      };
    };
  };
}

export interface CreateEtwsPayload {
  cbe_name?: string;
  category?: "normal" | "high_priority" | "background";
  repetition_period: number;
  num_of_bcast: number;
  scope: { scope_plmn: Record<string, unknown> };
  smscb_message: {
    message_id: number;
    serial_nr: {
      serial_nr_decoded: {
        geo_scope: "plmn_wide" | "cell_wide" | "lac_sac_tac_wide" | "cell_wide_immediate";
        msg_code: number;
        update_nr: number;
      };
    };
    payload: {
      payload_etws: {
        warning_type: {
          warning_type_decoded:
            | "earthquake"
            | "tsunami"
            | "earthquake_and_tsunami"
            | "test"
            | "other"
            | "rfu";
        };
        emergency_user_alert: boolean;
        popup_on_display: boolean;
      };
    };
  };
}

// POST /message
export const createCbs = async (data: CreateCbsPayload) => {
  const res = await api.post("/message", data);
  return res.data;
};

export const createEtws = async (data: CreateEtwsPayload) => {
  const res = await api.post("/message", data);
  return res.data;
};

// DELETE /message/:id
export const deleteMessage = async (msgId: number) => {
  const res = await api.delete(`/message/${msgId}`);
  return res.data;
};

// GET /broadcasts or similar endpoint (adjust to match your API)
export const listBroadcasts = async () => {
  const res = await api.get("/broadcasts");
  return res.data;
};

export default api;

