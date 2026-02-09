// PAS Countdown - semplice e affidabile
const SEASON_START = "2026-09-15T20:30:00"; // <-- cambia qui

function pad2(n){ return String(n).padStart(2,"0"); }

function start(){
  const jsState = document.getElementById("jsState");
  if (jsState) jsState.textContent = "ON";

  const dd = document.getElementById("dd");
  const hh = document.getElementById("hh");
  const mm = document.getElementById("mm");
  const ss = document.getElementById("ss");
  const startHuman = document.getElementById("startHuman");
  const year = document.getElementById("year");

  const target = new Date(SEASON_START);

  if (year) year.textContent = new Date().getFullYear();

  if (Number.isNaN(target.getTime())) {
    if (dd) dd.textContent = "--";
    if (hh) hh.textContent = "--";
    if (mm) mm.textContent = "--";
    if (ss) ss.textContent = "--";
    if (startHuman) startHuman.textContent = "DATA NON VALIDA";
    return;
  }

  if (startHuman){
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

  function tick(){
    const diff = target.getTime() - Date.now();

    if (diff <= 0){
      if (dd) dd.textContent = "00";
      if (hh) hh.textContent = "00";
      if (mm) mm.textContent = "00";
      if (ss) ss.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (dd) dd.textContent = pad2(days);
    if (hh) hh.textContent = pad2(hours);
    if (mm) mm.textContent = pad2(mins);
    if (ss) ss.textContent = pad2(secs);
  }

  tick();
  setInterval(tick, 250); // aggiorna spesso, scorre super “vivo”
}

// Avvio garantito anche se GitHub Pages/Jekyll fa scherzi
document.addEventListener("DOMContentLoaded", start);
