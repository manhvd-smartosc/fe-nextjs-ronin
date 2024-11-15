import { CrosshairMode, PriceScaleMode } from 'lightweight-charts';
import moment from 'moment/moment';

export const chartOption = {
  crosshair: {
    vertLine: {
      color: 'rgba(100, 100, 100, 0.4)',
    },
    horzLine: {
      color: 'rgba(100, 100, 100, 0.4)',
      labelBackgroundColor: '#f5f5fe',
    },
  },
  layout: {
    background: { color: '#171717', borderRadius: '16px' },
    textColor: '#787879',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: 400,
  },
  grid: {
    vertLines: {
      color: '#373738',
    },
    horzLines: {
      color: '#373738',
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  priceScale: {
    borderColor: '#373738',
  },
  timeScale: {
    borderColor: '#373738',
    secondVisible: false,
    timeVisible: true,
    visible: true,
  },
  localization: {
    timeFormatter: (time) =>
      moment(Number(time) * 1000).format('MM-DD-YYYY HH:mm'),
  },
};

function defaultTickMarkFormatter(timePoint, tickMarkType, locale) {
  const formatOptions = {};

  switch (tickMarkType) {
    case 0: //TickMarkType.Year:
      formatOptions.year = 'numeric';
      break;

    case 1: // TickMarkType.Month:
      formatOptions.month = 'short';
      break;

    case 2: //TickMarkType.DayOfMonth:
      formatOptions.day = 'numeric';
      break;

    case 3: //TickMarkType.Time:
      formatOptions.hour12 = false;
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      break;

    case 4: //TickMarkType.TimeWithSeconds:
      formatOptions.hour12 = false;
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      formatOptions.second = '2-digit';
      break;

    default:
    // ensureNever(tickMarkType);
  }

  const date =
    timePoint.businessDay === undefined
      ? new Date(timePoint.timestamp * 1000)
      : new Date(
          Date.UTC(
            timePoint.businessDay.year,
            timePoint.businessDay.month - 1,
            timePoint.businessDay.day,
          ),
        );

  // from given date we should use only as UTC date or timestamp
  // but to format as locale date we can convert UTC date to local date
  const localDateFromUtc = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );

  return localDateFromUtc.toLocaleString(locale, formatOptions);
}

const localTimezoneOffset = new Date().getTimezoneOffset() * 60;

export const areaOption = {
  lineWidth: 1,
  lineColor: 'rgb(100, 100, 100)',
  lineType: 0,
  topColor: 'rgba(100, 100, 100, 0.4)',
  bottomColor: 'rgba(0, 0, 0, 0)',
  crosshairMarkerRadius: 8,
  crosshairMarkerBorderColor: 'rgba(100, 100, 100, 0.4)',
  crosshairMarkerBackgroundColor: '#FFF',
};
