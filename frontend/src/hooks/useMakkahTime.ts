import { useEffect, useState } from "react";

/** The current time in Makkah (Asia/Riyadh), formatted for `lang`, refreshed every 20 seconds. */
export function useMakkahTime(lang: string, now: () => Date = () => new Date()): string {
  const format = () =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Riyadh",
    }).format(now());

  const [time, setTime] = useState(format);

  useEffect(() => {
    setTime(format());
    const id = setInterval(() => setTime(format()), 20_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `format` only depends on lang
  }, [lang]);

  return time;
}
