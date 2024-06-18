export const textFormatter = (text = '', len = 0, ellipsis = true) => {
  if (text?.length > len) {
    text = text?.substring(0, len);
    if (ellipsis) {
      text = text;
    }
    return text;
  }
  return text;
};

export const dobFormater = (d, m, y) => {
  if (m == 2 && d > 29) return false;
  if (m == 2 && d === 29) {
    if (isLeapYear(y)) {
      return `${d}-${m}-${y}`;
    }
  }
};

export const isLeapYear = year => {
  if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
    return true;
  }
  return false;
};

export const secureEmailFormatter = (
  email = '',
  start = 2,
  end = 2,
  stars = 5,
) => {
  const username = email.split('@')[0];
  const domain = '@' + email.split('@')[1];

  if (username.length <= start + end) {
    return username.slice(0, start) + '*'.repeat(stars) + domain;
  }

  return (
    username.slice(0, start) + '*'.repeat(stars) + username.slice(-end) + domain
  );
};
