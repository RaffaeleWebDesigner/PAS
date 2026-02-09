// ==============================
// PAS Countdown - FLUIDO
// Cambia SOLO questa data (ISO):
// es: "2026-09-15T20:30:00"
// ==============================
const SEASON_START = "2026-09-15T20:30:00"; // <-- CAMBIA QUI

const dd = document.getElementById("dd");
const hh = document.getElementById("hh");
const mm = document.getElementById("mm");
const ss = document.getElementById("ss");
const cs = document.getElementById("cs");
const startHuman = document.getElementById("startHuman");
const year = document.getElementById("year");
const statusPill = document.getElementById("statusPill");
const note = document.getElementById("note");

const addToCalendar = document.getElementById("addToCalendar");
const copyLink = document.getElementById("copyLink");

year.textContent = new Date().getFullYear();

function pad2(n){ return String(n).padStart(2,"0"); }

const target = new Date(SEASON_START);

function setError(msg){
  statusPill.textContent = "Errore";
  note.textContent = msg;
  dd.textContent = hh.textContent = mm.textContent = ss.textContent = cs.textContent = "--";
}

if (Number.isNaN(target.getTime())){
  setError("Data non valida in script.js. Usa formato tipo 2026-09-15T20:30:00");
} else {
  startHuman.textContent = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(target);
}

// Loop fluido (60fps circa)
function loop(){
  if (Number.isNaN(target.getTime())) return;

  const diff = target.getTime() - Date.now();

  if (diff <= 0){
    statusPill.textContent = "Stagione iniziata";
    note.textContent = "La stagione è iniziata. Ora la parte difficile: vincere. ⚽️";
    dd.textContent = hh.textContent = mm.textContent = ss.textContent = cs.textContent = "00";
    requestAnimationFrame(loop);
    return;
  }

  const totalSeconds = diff / 1000;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const centis = Math.floor((diff % 1000) / 10);

  dd.textContent = pad2(days);
  hh.textContent = pad2(hours);
  mm.textContent = pad2(mins);
  ss.textContent = pad2(secs);
  cs.textContent = pad2(centis);

  statusPill.textContent = "Prossima stagione";
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// Copia link
copyLink.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(window.location.href);
    copyLink.textContent = "Copiato ✅";
    setTimeout(() => (copyLink.textContent = "Copia link"), 1100);
  }catch{
    copyLink.textContent = "Non copiabile";
    setTimeout(() => (copyLink.textContent = "Copia link"), 1100);
  }
});

// ICS (aggiungi al calendario)
function downloadICS(){
  if (Number.isNaN(target.getTime())) return;

  const dtStart = target.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtEnd = new Date(target.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `pas-season-${dtStart}@raffaelewebdesigner.github.io`;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PAS Ponte agli Stolli//Countdown//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    "SUMMARY:Inizio stagione PAS (Ponte agli Stolli)",
    "DESCRIPTION:Inizio ufficiale della nuova stagione. Forza PAS!",
    "LOCATION:Da definire",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "PAS_inizio_stagione.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

addToCalendar.addEventListener("click", downloadICS);
