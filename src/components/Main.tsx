import React, { useState } from "react";
import { createCbs, createEtws } from "../api/api"; // adjust import path

// ETWS Message ID options (from 3GPP TS 23.041)
const ETWS_MESSAGE_IDS = [
  { id: 919, label: "919 - Earthquake Warning (Primary Notification)" },
  { id: 920, label: "920 - Tsunami Warning (Primary Notification)" },
  { id: 921, label: "921 - Earthquake and Tsunami Warning (Primary Notification)" },
  { id: 922, label: "922 - Test Message (Primary Notification)" },
  { id: 923, label: "923 - Secondary Notification 1" },
  { id: 924, label: "924 - Secondary Notification 2" },
  { id: 925, label: "925 - Secondary Notification 3" },
];

// CBC Message ID options (selected important known IDs)
const CBC_MESSAGE_IDS = [
  { id: 0, label: "0 - Standard CBS Message (General)" },
  { id: 919, label: "919 - ETWS Earthquake Warning" },
  { id: 920, label: "920 - ETWS Tsunami Warning" },
  { id: 921, label: "921 - ETWS Earthquake and Tsunami Warning" },
  { id: 922, label: "922 - ETWS Test Message" },
  { id: 4370, label: "4370 - CMAS Emergency Alert" },
  { id: 4370, label: "4370 - CMAS Presidential Alert (US)" },
  { id: 4371, label: "4371 - CMAS Extreme Threat" },
  { id: 4372, label: "4372 - CMAS Severe Threat" },
  { id: 4373, label: "4373 - CMAS Amber Alert" },
  { id: 4374, label: "4374 - CMAS Test Message" },
];

// Geographic scope options for both forms
const GEOGRAPHIC_SCOPES = [
  { value: "cell_wide_immediate", label: "Cell Wide Immediate" },
  { value: "plmn_wide", label: "PLMN Wide" },
  { value: "lac_sac_tac_wide", label: "LAC/SAC/TAC Wide" },
  { value: "cell_wide", label: "Cell Wide" },
];

const CHARACTER_SETS = [
  { value: "gsm", label: "GSM" },
  { value: "ucs2", label: "UCS2" },
  { value: "8bit", label: "8-bit" },
];

// CBC Form Component
function CBCForm() {
  const [form, setForm] = useState({
    message_id: "",
    serial_msg_code: 768,
    serial_update_nr: 0,
    geographic_scope: "plmn_wide",
    character_set: "gsm",
    payload_data_utf8: "",
    repetition_period: 5,
    num_of_bcast: 999,
  });

  const onChange = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message_id) {
      alert("Please select a Message ID");
      return;
    }
    try {
      await createCbs({
        cbe_name: "cbc_apitool",
        category: "normal",
        repetition_period: form.repetition_period,
        num_of_bcast: form.num_of_bcast,
        scope: { scope_plmn: {} },
        smscb_message: {
          message_id: Number(form.message_id),
          serial_nr: {
            serial_nr_decoded: {
              geo_scope: form.geographic_scope,
              msg_code: form.serial_msg_code,
              update_nr: form.serial_update_nr,
            },
          },
          payload: {
            payload_decoded: {
              character_set: form.character_set,
              data_utf8: form.payload_data_utf8,
            },
          },
        },
      });
      alert("CBC message submitted!");
    } catch (error) {
      alert("Error submitting CBC message");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>CBC Message</h3>

      <div>
        <label>Message ID:</label>
        <select
          required
          value={form.message_id}
          onChange={(e) => onChange("message_id", e.target.value)}
        >
          <option value="">-- Select Message ID --</option>
          {CBC_MESSAGE_IDS.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Geographic Scope:</label>
        <select
          value={form.geographic_scope}
          onChange={(e) => onChange("geographic_scope", e.target.value)}
        >
          {GEOGRAPHIC_SCOPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Serial Message Code:</label>
        <input
          type="number"
          value={form.serial_msg_code}
          min={0}
          max={1023}
          onChange={(e) => onChange("serial_msg_code", Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Serial Update Number:</label>
        <input
          type="number"
          value={form.serial_update_nr}
          min={0}
          max={15}
          onChange={(e) => onChange("serial_update_nr", Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Character Set:</label>
        <select
          value={form.character_set}
          onChange={(e) => onChange("character_set", e.target.value)}
        >
          {CHARACTER_SETS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Message Content:</label>
        <textarea
          rows={4}
          value={form.payload_data_utf8}
          onChange={(e) => onChange("payload_data_utf8", e.target.value)}
          required
        />
      </div>

      <div>
        <label>Repetition Period (1-4095):</label>
        <input
          type="number"
          min={1}
          max={4095}
          value={form.repetition_period}
          onChange={(e) => onChange("repetition_period", Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Number of Broadcasts (0-65535):</label>
        <input
          type="number"
          min={0}
          max={65535}
          value={form.num_of_bcast}
          onChange={(e) => onChange("num_of_bcast", Number(e.target.value))}
          required
        />
      </div>

      <button type="submit">Submit CBC Message</button>
    </form>
  );
}

// ETWS Form Component
function ETWSForm() {
  const [form, setForm] = useState({
    message_id: "",
    serial_msg_code: 768,
    serial_update_nr: 0,
    geographic_scope: "plmn_wide",
    warning_type: "earthquake",
    emergency_user_alert: true,
    popup_on_display: true,
    repetition_period: 5,
    num_of_bcast: 999,
  });

  const WARNING_TYPES = [
    { value: "earthquake", label: "Earthquake" },
    { value: "tsunami", label: "Tsunami" },
    { value: "earthquake_and_tsunami", label: "Earthquake and Tsunami" },
    { value: "test", label: "Test" },
    { value: "other", label: "Other" },
    { value: "rfu", label: "RFU (Reserved for Future Use)" },
  ];

  const onChange = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message_id) {
      alert("Please select a Message ID");
      return;
    }
    try {
      await createEtws({
        cbe_name: "cbc_apitool",
        category: "normal",
        repetition_period: form.repetition_period,
        num_of_bcast: form.num_of_bcast,
        scope: { scope_plmn: {} },
        smscb_message: {
          message_id: Number(form.message_id),
          serial_nr: {
            serial_nr_decoded: {
              geo_scope: form.geographic_scope,
              msg_code: form.serial_msg_code,
              update_nr: form.serial_update_nr,
            },
          },
          payload: {
            payload_etws: {
              warning_type: { warning_type_decoded: form.warning_type },
              emergency_user_alert: form.emergency_user_alert,
              popup_on_display: form.popup_on_display,
            },
          },
        },
      });
      alert("ETWS message submitted!");
    } catch (error) {
      alert("Error submitting ETWS message");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>ETWS Message</h3>

      <div>
        <label>Message ID:</label>
        <select
          required
          value={form.message_id}
          onChange={(e) => onChange("message_id", e.target.value)}
        >
          <option value="">-- Select Message ID --</option>
          {ETWS_MESSAGE_IDS.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Geographic Scope:</label>
        <select
          value={form.geographic_scope}
          onChange={(e) => onChange("geographic_scope", e.target.value)}
        >
          {GEOGRAPHIC_SCOPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Serial Message Code:</label>
        <input
          type="number"
          value={form.serial_msg_code}
          min={0}
          max={1023}
          onChange={(e) => onChange("serial_msg_code", Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Serial Update Number:</label>
        <input
          type="number"
          value={form.serial_update_nr}
          min={0}
          max={15}
          onChange={(e) => onChange("serial_update_nr", Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Warning Type:</label>
        <select
          value={form.warning_type}
          onChange={(e) => onChange("warning_type", e.target.value)}
        >
          {WARNING_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={form.emergency_user_alert}
            onChange={(e) => onChange("emergency_user_alert", e.target.checked)}
          />
          Emergency User Alert
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={form.popup_on_display}
            onChange={(e) => onChange("popup_on_display", e.target.checked)}
          />
          Popup on Display
        </label>
      </div>

      <div>
        <label>Repetition Period (1-4095):</label>
        <input
          type="number"
          min={1}
          max={4095}
          value={form.repetition_period}
          onChange={(e) => onChange("repetition_period", Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Number of Broadcasts (0-65535):</label>
        <input
          type="number"
          min={0}
          max={65535}
          value={form.num_of_bcast}
          onChange={(e) => onChange("num_of_bcast", Number(e.target.value))}
          required
        />
      </div>

      <button type="submit">Submit ETWS Message</button>
    </form>
  );
}

export default function Main() {
  const [messageType, setMessageType] = useState("");

  return (
    <div>
      <label htmlFor="messageType">
        <strong>Message Type: </strong>
      </label>
      <select
        id="messageType"
        value={messageType}
        onChange={(e) => setMessageType(e.target.value)}
      >
        <option value="">-- Select --</option>
        <option value="CBC">CBC</option>
        <option value="ETWS">ETWS</option>
      </select>

      <div style={{ marginTop: 20 }}>
        {messageType === "CBC" && <CBCForm />}
        {messageType === "ETWS" && <ETWSForm />}
      </div>
    </div>
  );
}

