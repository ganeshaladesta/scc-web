import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function todayISODate() {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatLongDate(value: string) {
  try {
    return format(parseISO(value), "d MMMM yyyy", { locale: id });
  } catch {
    return value;
  }
}

export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function formatDateTime(value: string) {
  try {
    return format(parseISO(value), "d MMM yyyy, HH:mm", { locale: id });
  } catch {
    return value;
  }
}

