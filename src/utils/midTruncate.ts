const midTruncate = (value = "", maxLength = 14) => {
  if (!value) return value;
  if (value.length <= maxLength) return value;

  var charsToShow = maxLength - 3,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return `${value.substr(0, frontChars)}…${value.substr(
    value.length - backChars
  )}`;
};

export default midTruncate;
