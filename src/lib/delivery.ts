// Delivery zones, slots & shipping fee logic
export type Zone = {
  id: string;
  name: string;
  fee: number;
  eta: string; // estimated minutes / hours
};

export const zones: Zone[] = [
  { id: "z1", name: "Dekat Warung (< 200m)", fee: 0, eta: "5 - 10 mnt" },
  { id: "z2", name: "Area Sekitar (200 - 400m)", fee: 2000, eta: "10 - 15 mnt" },
  { id: "z3", name: "Ujung Kampung (400 - 600m)", fee: 3000, eta: "15 - 20 mnt" },
];

export type Slot = { id: string; label: string; window: string; surcharge: number };

export function getSlotsForDate(date: Date): Slot[] {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const hour = today.getHours();
  const all: Slot[] = [
    { id: "express", label: "Langsung Antar", window: "≤ 15 menit", surcharge: 2000 },
    { id: "morning", label: "Pagi", window: "06:00 — 09:00", surcharge: 0 },
    { id: "noon", label: "Siang", window: "10:00 — 12:00", surcharge: 0 },
    { id: "afternoon", label: "Sore", window: "15:00 — 17:00", surcharge: 0 },
  ];
  if (!isToday) return all.filter((s) => s.id !== "express");
  // hide windows whose end already passed today
  return all.filter((s) => {
    if (s.id === "express") return true;
    const endHour = parseInt(s.window.split("—")[1]);
    return endHour > hour;
  });
}

export function next7Days(): Date[] {
  const arr: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    arr.push(d);
  }
  return arr;
}

export function fmtDay(d: Date): { day: string; date: string; label: string } {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  let label = d.toLocaleDateString("id-ID", { weekday: "short" });
  if (d.toDateString() === today.toDateString()) label = "Hari Ini";
  else if (d.toDateString() === tomorrow.toDateString()) label = "Besok";
  return {
    day: d.toLocaleDateString("id-ID", { weekday: "short" }),
    date: d.getDate().toString().padStart(2, "0"),
    label,
  };
}
