export async function wait(seconds: number) {
  return await new Promise(resolve => setTimeout(() => resolve(null), seconds * 1000));
}
