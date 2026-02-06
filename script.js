// ==============================
// PAS (Ponte agli Stolli) - Countdown
// Imposta qui la data/ora di inizio stagione (Europe/Rome)
// Formato ISO consigliato: "2026-09-15T20:30:00"
// ==============================
const SEASON_START_ISO = "2026-09-15T20:30:00"; // <-- CAMBIA QUESTA DATA

const dd = document.getElementById("dd");
const hh = document.getElementById("hh");
const mm = document.getElementById("mm");
const ss = document.getElementById("ss");
const startHuman = document.getElementById("startHuman");
const statusText = document.getElementById("statusText");
const year = document.getElementById("year");
const addToCalendar = document.getElementById("addToCalendar");
const copyLink = document.getElementById("copyLink");
const seasonLabel = document.getElementById("seasonLabel");

year.textContent = new Date().getFullYear();

function pad2(n){ return String(n).padStart(2, "0"); }

function toRomeHuman(iso){
  const d = new Date(iso);
  // Mostra in formato italiano, usando fuso Europa/Roma
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

startHuman.textContent = toRomeHuman(SEASON_START_ISO);

// Countdown logic
let timer = null;

function tick(){
  const now = new Date();
  const target = new Date(SEASON_START_ISO);

  const diffMs = target.getTime() - now.getTime();

  if (Number.isNaN(target.getTime())) {
    seasonLabel.textContent = "Errore data";
    statusText.textContent = "La data in script.js non è valida. Usa formato tipo 2026-09-15T20:30:00";
    dd.textContent = hh.textContent = mm.textContent = ss.textContent = "--";
    if (timer) clearInterval(timer);
    return;
  }

  if (diffMs <= 0){
    seasonLabel.textContent = "Stagione iniziata";
    statusText.textContent = "La stagione è iniziata. Ora tocca a voi fare gol, non al countdown. ⚽️";
    dd.textContent = "00";
    hh.textContent = "00";
    mm.textContent = "00";
    ss.textContent = "00";
    if (timer) clearInterval(timer);
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  dd.textContent = pad2(days);
  hh.textContent = pad2(hours);
  mm.textContent = pad2(mins);
  ss.textContent = pad2(secs);

  seasonLabel.textContent = "Prossima stagione";
  statusText.textContent = "Countdown aggiornato in tempo reale. Pubblicalo e dimenticatene. 😄";
}

tick();
timer = setInterval(tick, 1000);

// Copy link
copyLink.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(window.location.href);
    copyLink.textContent = "Copiato ✅";
    setTimeout(() => copyLink.textContent = "Copia link", 1100);
  }catch(e){
    copyLink.textContent = "Non copiabile";
    setTimeout(() => copyLink.textContent = "Copia link", 1100);
  }
});

// Add to calendar (.ics)
function downloadICS(){
  const start = new Date(SEASON_START_ISO);
  if (Number.isNaN(start.getTime())) return;

  // ICS uses UTC timestamps (Z). Convert by using toISOString.
  const dtStart = start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtEnd = new Date(start.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const uid = `pas-season-${dtStart}@pas-ponte-agli-stolli`;
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

addToCalendar.addEventListener("click", () => downloadICS());
