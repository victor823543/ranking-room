type DateFormat = "clean" | "short" | "medium" | "long" | "full" | "custom";

interface CustomFormatOptions {
  weekday?: "narrow" | "short" | "long";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
  day?: "numeric" | "2-digit";
}

export function formatDate(
  /** Takes a date object or unix timestamp */
  date: Date | number,
  format: DateFormat,
  customOptions?: CustomFormatOptions,
): string {
  const optionsMap: { [key in DateFormat]: Intl.DateTimeFormatOptions } = {
    clean: { month: "short", day: "numeric" },
    short: { year: "2-digit", month: "2-digit", day: "2-digit" },
    medium: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    custom: customOptions || {},
  };

  const options = optionsMap[format];
  const dateObj = new Date(typeof date === "number" ? date * 1000 : date);

  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}
