function sortAlphaGetKeys(data) {
  return Object.keys(data).sort(function (a, b) {
    return a.localeCompare(b);
  });
}
