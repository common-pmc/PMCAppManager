export function getNameFromEmail (email = '') {
  if (!email) return '';
  return email.split ('@')[0].replace ('.', ' ').replace ('_', ' ');
}
