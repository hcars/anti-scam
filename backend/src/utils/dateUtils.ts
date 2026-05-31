

export function dateDiff(date1: Date, date2: Date): number {
    const msPerDay = 86400000;
    const date1Milli = date1.getTime();
    const date2Milli = date2.getTime();
    const msDiff = date1Milli > date2Milli ? date1Milli - date2Milli : date2Milli - date1Milli;
    return Math.round(msDiff / msPerDay);
}