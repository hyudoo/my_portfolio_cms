import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/locale/ja';

export const datetime = dayjs;
export type DateTime = Dayjs;
datetime.extend(weekday);
datetime.extend(localeData);
datetime.extend(isBetween);
datetime.extend(isSameOrAfter);
datetime.extend(isSameOrBefore);
datetime.extend(minMax);
