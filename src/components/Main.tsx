import React, { useState } from "react";
import { createCbs, createEtws } from "../api/api"; // adjust import path

// ETWS Message ID options (from 3GPP TS 23.041)
const ETWS_MESSAGE_IDS = [
  { id: 4352, label: "4352 - ETWS Earthquake Warning" },
  { id: 4353, label: "4353 - ETWS Tsunami Warning" },
  { id: 4354, label: "4354 - ETWS Earthquake and Tsunami Warning" },
  { id: 4355, label: "4355 - ETWS Test Message" },
  { id: 4356, label: "4356 - ETWS other emergency"},

];

// CBS Message ID options (selected important known IDs)
const CBS_MESSAGE_IDS = [
  { id: 4370, label: "4370 - WEA CMAS Presidential Alert (US) | EU-Alert Level 1 | (KPAS) Class 0" },
  { id: 4371, label: "4371 - WEA CMAS (Severity of Extreme, Urgency of Immediate, and Certainty of Observed) | EU-Alert Level 2 | (KPAS) Class 1" },
  { id: 4372, label: "4372 - WEA CMAS (Severity of Extreme, Urgency of Immediate, and Certainty of Likely) | EU-Alert Level 2 | (KPAS) Class 1" },
  { id: 4373, label: "4373 - WEA CMAS (Severity of Extreme, Urgency of Expected, and Certainty of Observed) | EU-Alert Level 3 | (KPAS) Class 1" },
  { id: 4374, label: "4374 - WEA CMAS (Severity of Extreme, Urgency of Expected, and Certainty of Likely) | EU-Alert Level 3 | (KPAS) Class 1" },
  { id: 4375, label: "4375 - WEA CMAS (Severity of Severe, Urgency of Immediate, and Certainty of Observed)| EU-Alert Level 3 | (KPAS) Class 1" },
  { id: 4376, label: "4376 - WEA CMAS (Severity of Severe, Urgency of Immediate, and Certainty of Likely) | EU-Alert Level 3 | (KPAS) Class 1" },
  { id: 4377, label: "4377 - WEA CMAS (Severity of Severe, Urgency of Expected, and Certainty of Observed) | EU-Alert Level 3 | (KPAS) Class 1" },
  { id: 4378, label: "4378 - WEA CMAS (Severity of Severe, Urgency of Expected, and Certainty of Likely) | EU-Alert Level 3 | (KPAS) Class 1" },
  { id: 4379, label: "4379 - WEA CMAS (Child Abduction Emergency) Amber Alert | EU--Amber | (KPAS) Class 1" },
  { id: 4380, label: "4380 - WEA CMAS Test | Required Monthly Test" },
  { id: 4381, label: "4381 - WEA CMAS Exercise" },
  { id: 4382, label: "4382 - WEA CMAS operator defined use" },
  { id: 4396, label: "4396 - WEA CMAS Public Safety Alerts | EU-Alert Level 4" },
  { id: 4398, label: "4309 - WEA CMAS State/Local WEA Test" },
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

const MESSAGE_CATEGORY = [
  { value: "normal", label: "normal" },
  { value: "high_priority", label: "high priority"},
  { value: "background", label: "background"},
];




// CBS Form Component
function CBSForm() {
  const [form, setForm] = useState({
    category: "normal",
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
        cbe_name: "vmwcbe-v01b",
        category: form.category,
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
      alert("CBS message submitted!");
    } catch (error) {
      alert("Error submitting CBS message");
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>CBS Message</h3>

      <div>
        <label>Message ID: </label>
        <select
          required
          value={form.message_id}
          onChange={(e) => onChange("message_id", e.target.value)}
        >
          <option value="">-- Select Message ID --</option>
          {CBS_MESSAGE_IDS.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
          &nbsp;(TS 123.041 V18.4.0)
      </div>

	<br />

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

	<br />
      <div>
        <label>Serial Message Code (0-1023):</label>
        <input
          type="number"
          value={form.serial_msg_code}
          min={0}
          max={1023}
          onChange={(e) => onChange("serial_msg_code", Number(e.target.value))}
          required
        />
	 &nbsp; &nbsp; &nbsp;
        <label>Serial Update Number (0-15):</label>
        <input
          type="number"
          value={form.serial_update_nr}
          min={0}
          max={15}
          onChange={(e) => onChange("serial_update_nr", Number(e.target.value))}
          required
        />
      </div>
	  <br />
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
	 <br />
      <div>
        <label>Message Content:</label>
        <textarea
          rows={4}
          cols="80" 
          value={form.payload_data_utf8}
          onChange={(e) => onChange("payload_data_utf8", e.target.value)}
          required
        />
      </div>
	 <br />
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
	 <br />
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
	 <br />
      <div>
        <label>Category</label>
        <select
          required
          value={form.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {MESSAGE_CATEGORY.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <br />
	 <br />
      <button type="submit">Submit CBS Message</button>
    </form>
  );
}

// ETWS Form Component
function ETWSForm() {
  const [form, setForm] = useState({
    category: "normal",
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
    // Typo in spelling of  tsunami as -> "tsuname" in osmoCBC 
    { value: "earthquake_and_tsuname", label: "Earthquake and Tsunami" },
    { value: "test", label: "Test" },
    { value: "other", label: "Other" },
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
        cbe_name: "vmwcbe-v01b",
        category: form.category,
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
	 &nbsp;(TS 123.041 V18.4.0)
      </div>
	<br />
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
	<br />
      <div>
        <label>Serial Message Code (0-1023):</label>
        <input
          type="number"
          value={form.serial_msg_code}
          min={0}
          max={1023}
          onChange={(e) => onChange("serial_msg_code", Number(e.target.value))}
          required
        />

	 &nbsp; &nbsp; &nbsp; &nbsp;

        <label>Serial Update Number (0-15):</label>
        <input
          type="number"
          value={form.serial_update_nr}
          min={0}
          max={15}
          onChange={(e) => onChange("serial_update_nr", Number(e.target.value))}
          required
        />
	</div>
	 <br />
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

	 &nbsp; &nbsp; &nbsp; &nbsp;	

        <label>
          <input
            type="checkbox"
            checked={form.popup_on_display}
            onChange={(e) => onChange("popup_on_display", e.target.checked)}
          />
          Popup on Display
        </label>
      </div>
	 <br />
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
	 <br />
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
	 <br />
        <div>
        <label>Category</label>
        <select
          required
          value={form.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {MESSAGE_CATEGORY.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
	 <br />
	  <br />
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
        <option value="CBS">CBS</option>
        <option value="ETWS">ETWS</option>
      </select>

      <div style={{ marginTop: 20 }}>
        {messageType === "CBS" && <CBSForm />}
        {messageType === "ETWS" && <ETWSForm />}
      </div>
    </div>
  );
}

