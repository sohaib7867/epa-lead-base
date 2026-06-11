export const services = [
  {
    id: 1,
    number: '1',
    name: '1 (One) Bedroom Lead Dust Sampling',
    duration: '15 mins',
    price: 126,
    type: 'One on One',
  },
  {
    id: 2,
    number: '2',
    name: '2 (Two) Bedroom Lead Dust Sampling Test',
    duration: '15 mins',
    price: 137,
    type: 'One on One',
  },
  {
    id: 3,
    number: '3',
    name: '3 (Three) Bedroom Lead Dust Sampling Test',
    duration: '15 mins',
    price: 148,
    type: 'One on One',
  },
  {
    id: 4,
    number: '4',
    name: '4 (Four) Bedroom Lead Dust Sampling Test',
    duration: '15 mins',
    price: 159,
    type: 'One on One',
  },
  {
    id: 5,
    number: '5',
    name: '5 (Five) Bedroom Lead Dust Sampling Test',
    duration: '15 mins',
    price: 169,
    type: 'One on One',
  },
  {
    id: 6,
    number: '6',
    name: '6 (Six) Bedroom Lead Dust Sampling',
    duration: '15 mins',
    price: 180,
    type: 'One on One',
  },
  {
    id: 7,
    number: '7',
    name: '7 (Seven) Bedroom Lead Dust Sampling',
    duration: '15 mins',
    price: 210,
    type: 'One on One',
  },
  {
    id: 8,
    number: '8',
    name: '8 (Eight) Bedroom Lead Dust Sampling',
    duration: '15 mins',
    price: 220,
    type: 'One on One',
  },
  {
    id: 9,
    number: 'L',
    name: 'Lead-Based Paint Visual Assessment',
    duration: '5 mins',
    price: 199,
    type: 'One on One',
  },
];

function buildTimezones() {
  const now = new Date();
  const allZones = Intl.supportedValuesOf('timeZone');
  return allZones
    .map((tz) => {
      try {
        const formatter = new Intl.DateTimeFormat('en', {
          timeZone: tz,
          timeZoneName: 'shortOffset',
        });
        const parts = formatter.formatToParts(now);
        const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'UTC';
        // Normalise "GMT+5:30" → "+05:30"
        const offset = offsetPart
          .replace('GMT', '')
          .replace(/^([+-])(\d):/, '$10$2:')   // pad single-digit hour
          .replace(/^([+-]\d{2})$/, '$1:00')     // add :00 if no minutes
          || '+00:00';
        const abbr = new Intl.DateTimeFormat('en', {
          timeZone: tz,
          timeZoneName: 'short',
        })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value ?? '';
        return {
          value: tz,
          label: `${tz.replace(/_/g, ' ')} — ${abbr} (${offset === '' ? '+00:00' : offset})`,
          offset,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by numeric offset first, then alphabetically
      const toMins = (o) => {
        const m = o.match(/([+-])(\d{2}):(\d{2})/);
        if (!m) return 0;
        return (m[1] === '-' ? -1 : 1) * (parseInt(m[2]) * 60 + parseInt(m[3]));
      };
      return toMins(a.offset) - toMins(b.offset) || a.value.localeCompare(b.value);
    });
}

export const timezones = buildTimezones();

export const timeSlotGroups = [
  {
    label: 'Morning',
    slots: [
      '08:00 am', '08:15 am', '08:30 am',
      '08:45 am', '09:00 am', '09:15 am',
      '09:30 am', '09:45 am', '10:00 am',
      '10:15 am', '10:30 am', '10:45 am',
      '11:00 am', '11:15 am', '11:30 am',
      '11:45 am',
    ],
  },
  {
    label: 'Afternoon',
    slots: [
      '12:00 pm', '12:15 pm', '12:30 pm',
      '12:45 pm', '01:00 pm', '01:15 pm',
      '01:30 pm', '01:45 pm', '02:00 pm',
      '02:15 pm', '02:30 pm', '02:45 pm',
      '03:00 pm', '03:15 pm', '03:30 pm',
      '03:45 pm', '04:00 pm', '04:15 pm',
      '04:30 pm', '04:45 pm',
    ],
  },
  {
    label: 'Evening',
    slots: [
      '05:00 pm', '05:15 pm', '05:30 pm',
      '05:45 pm', '06:00 pm', '06:15 pm',
      '06:30 pm', '06:45 pm', '07:00 pm',
      '07:15 pm', '07:30 pm', '07:45 pm',
    ],
  },
  {
    label: 'Night',
    slots: [
      '08:00 pm', '08:15 pm', '08:30 pm',
      '08:45 pm', '09:00 pm', '09:15 pm',
      '09:30 pm', '09:45 pm', '10:00 pm',
      '10:15 pm', '10:30 pm', '10:45 pm',
      '11:00 pm', '11:15 pm', '11:30 pm',
      '11:45 pm',
    ],
  },
];

export const bedroomOptions = [
  '1 Bedroom',
  '2 Bedrooms',
  '3 Bedrooms',
  '4 Bedrooms',
  '5 Bedrooms',
  '6 Bedrooms',
  '7 Bedrooms',
  '8 Bedrooms',
];

export const propertyTypes = [
  'Single Family Home',
  'Multi-Family Home',
  'Apartment',
  'Condo',
  'Townhouse',
  'Duplex',
  'Commercial Property',
  'Other',
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
