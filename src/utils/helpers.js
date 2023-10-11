const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(date) {
  const newDate = new Date(date);
  return `${newDate.getDate()} ${
    months[newDate.getMonth()]
  } ${newDate.getFullYear()}`;
}

function getTwoDigitValue(value) {
  return `${value < 10 ? `0${value}` : value}`;
}

export function formatDateForHTMLInput(date) {
  const newDate = new Date(date);

  return `${newDate.getFullYear()}-${getTwoDigitValue(
    newDate.getMonth() + 1
  )}-${getTwoDigitValue(newDate.getDate())}`;
}
