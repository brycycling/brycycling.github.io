export class DateUtils {
  /**
   * Parse date string in YYYY-MM-DD format or Date object
   */
  static parseDate(inputStr: string | Date): Date {
    if (typeof inputStr === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(inputStr)) {
        const [year, month, day] = inputStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(inputStr);
    }
    return inputStr;
  }

  /**
   * Find the next start date after a given date and number of months
   */
  static findNextStartDate(date: Date, months: number): Date {
    const targetMonth = date.getMonth() + months;
    let targetYear = date.getFullYear();
    let adjustedMonth = targetMonth;

    if (targetMonth > 11) {
      adjustedMonth = targetMonth - 12;
      targetYear += 1;
    }

    const lastDayOfTargetMonth = new Date(targetYear, adjustedMonth + 1, 0).getDate();

    let targetDay = date.getDate();
    if (date.getDate() > lastDayOfTargetMonth) {
      targetDay = 1;
      adjustedMonth += 1;
      if (adjustedMonth > 11) {
        adjustedMonth = 0;
        targetYear += 1;
      }
    }

    return new Date(targetYear, adjustedMonth, targetDay, date.getHours(), date.getMinutes(), date.getSeconds());
  }

  /**
   * Calculate end date as next start date minus one day
   */
  static findEndDate(date: Date, months: number): Date {
    const nextStartDate = DateUtils.findNextStartDate(date, months);
    const endDate = new Date(nextStartDate);
    endDate.setDate(endDate.getDate() - 1);
    return endDate;
  }

  /**
   * Add specified number of hours to a date
   */
  static addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }

  /**
   * Add specified number of days to a date
   */
  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * Format date for display (e.g., "Jan 15, 2024")
   */
  static formatDisplayDate(date: Date, format: string = 'dd-mmm-yyyy'): string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dd = String(day).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    const yyyy = String(year);
    const mmm = monthAbbr[month];
    const mmmm = monthNames[month];
    const d = String(day);

    switch (format) {
      case 'dd/mm/yyyy':
        return `${dd}/${mm}/${yyyy}`;
      case 'dd-mmm-yyyy':
        return `${dd}-${mmm}-${yyyy}`;
      case 'mmmm d, yyyy':
        return `${mmmm} ${d}, ${yyyy}`;
      case 'mm/dd/yyyy':
        return `${mm}/${dd}/${yyyy}`;
      case 'yyyy-mm-dd':
        return `${yyyy}-${mm}-${dd}`;
      case 'd mmm yyyy':
        return `${d} ${mmm} ${yyyy}`;
      default:
        return `${dd}-${mmm}-${yyyy}`;
    }
  }

  /**
   * Format date for copying (ddmmyyyy format)
   */
  static formatCopyDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}${month}${year}`;
  }

  /**
   * Check if a date falls within a date range (inclusive)
   */
  static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  /**
   * Calculate days between two dates
   */
  static daysBetween(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Check if a certificate is near expiry (within 30 days)
   */
  static isNearExpiry(currentDate: Date, expiryDate: Date, threshold: number = 30): boolean {
    const daysToExpiry = this.daysBetween(currentDate, expiryDate);
    return daysToExpiry <= threshold && daysToExpiry >= 0;
  }
}