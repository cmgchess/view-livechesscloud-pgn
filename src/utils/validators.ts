export function validateNumber(strNum: string): number {
  const num = parseInt(strNum);
  if (isNaN(num) || num <= 0) throw new Error();
  return num;
}
