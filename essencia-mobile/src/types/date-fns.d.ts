declare module "date-fns" {
  export function format(date: Date | number | string, formatStr: string, options?: { locale?: Locale }): string;
  export function parseISO(dateString: string): Date;
  export function subDays(date: Date | number, amount: number): Date;
  export function formatDistanceToNow(date: Date | number | string, options?: { locale?: Locale; addSuffix?: boolean }): string;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isToday(date: Date | number): boolean;
  export function isYesterday(date: Date | number): boolean;
  export function startOfDay(date: Date | number): Date;
  export function endOfDay(date: Date | number): Date;
}

declare module "date-fns/locale" {
  export const ptBR: Locale;
}

declare module "date-fns/locale/pt-BR" {
  const ptBR: Locale;
  export default ptBR;
}

interface Locale {
  code?: string;
  formatDistance?: (...args: any[]) => any;
  formatRelative?: (...args: any[]) => any;
  localize?: {
    ordinalNumber: (...args: any[]) => any;
    era: (...args: any[]) => any;
    quarter: (...args: any[]) => any;
    month: (...args: any[]) => any;
    day: (...args: any[]) => any;
    dayPeriod: (...args: any[]) => any;
  };
  formatLong?: {
    date: (...args: any[]) => any;
    time: (...args: any[]) => any;
    dateTime: (...args: any[]) => any;
  };
  match?: {
    ordinalNumber: (...args: any[]) => any;
    era: (...args: any[]) => any;
    quarter: (...args: any[]) => any;
    month: (...args: any[]) => any;
    day: (...args: any[]) => any;
    dayPeriod: (...args: any[]) => any;
  };
  options?: {
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  };
}
