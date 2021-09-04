export function handleError(err: any) {
  if (err.error?.msg) return err.error.msg;
  if (err.statusText) return `${err.statusText}. Try After some Time`;
  if (err.message) return err.message;
  return 'Some Error Occured';
}
