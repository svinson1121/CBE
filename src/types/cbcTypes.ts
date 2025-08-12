export type CBCMessage = {
  cbe_name: string;
  category: "normal" | "high_priority" | "background";
  repetition_period: number;
  num_of_bcast: number;
  smscb_message: SmscbMessage;
};

export type SmscbMessage = {
  serial_nr: number | { geo_scope: GeographicScope; msg_code: number; update_nr: number };
  message_id: number;
  payload: PayloadEncoded | PayloadDecoded | PayloadEtws;
};

type GeographicScope = "cell_wide_immediate" | "plmn_wide" | "lac_sac_tac_wide" | "cell_wide";
type PayloadDecoded = { character_set: "gsm" | "8bit" | "ucs2"; data_utf8: string; language?: string };
type PayloadEtws = { warning_type: string; emergency_user_alert: boolean; popup_on_display: boolean };
