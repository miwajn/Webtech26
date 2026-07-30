// Feste, vorgegebene Vorsorgearten - können von Nutzer:innen nicht verändert werden.
// Werden bewusst NICHT in MongoDB gespeichert, sondern hier zentral gepflegt,
// damit alle Komponenten (user.ts, table.ts, ...) dieselbe Liste verwenden.

export type VorsorgeTypStandard = {
  id: string;
  name: string;
  monate: number; // empfohlenes Intervall in Monaten
  icon: string; // Bootstrap-Icons
};

export const STANDARD_VORSORGE_TYPEN: VorsorgeTypStandard[] = [
  { id: 'krebs', name: 'Krebsfrüherkennung', monate: 12, icon: 'bi-eye-fill' },
  { id: 'haut', name: 'Hautkrebs-Screening', monate: 24, icon: 'bi-sun-fill' },
  { id: 'brust', name: 'Mammographie-Screening', monate: 24, icon: 'bi-clipboard-plus-fill' },
  { id: 'checkup', name: 'Gesundheits-Check-up', monate: 36, icon: 'bi-heart-pulse-fill' },
  { id: 'zahn', name: 'Zahnvorsorge', monate: 6, icon: 'bi-emoji-smile-fill' },
  { id: 'impfung', name: 'Schutzimpfung', monate: 24, icon: 'bi-shield-fill-plus' },    // Zeit noch rausnehmen
  { id: 'schwanger', name: 'Schwangerschaft', monate: 12, icon: 'bi-gender-female' },   // Zeit noch rausnehmen
  { id: 'chlamydien', name: 'Chlamydien-Screening', monate: 12, icon: 'bi-search-heart-fill' }, // Bedingung ergänzen: Geschlecht + Alter (<=25)
  { id: 'urologie', name: 'Aneurysmen-Früherkennung', monate: 12, icon: 'bi-gender-male' },     // Bedingung ergänzen: Geschlecht + Alter (>=65)
  { id: 'u18', name: 'Kinder und Jugendliche', monate: 12, icon: 'bi-file-person-fill' },
];
