import {execa} from '@esm2cjs/execa';
import * as path from 'path';

// export async function handler() {
//   // await execa('prisma', ['migrate', 'deploy'], {
//   //   preferLocal: true,
//   //   stdio: 'inherit',
//   // });
//   await execa(path.resolve(process.cwd(), './../../migrate.sh'), [
//     process.env.DATABASE_URL as string,
//   ]);
// }

export const handler = async () => {
  const cwd = process.cwd();
  const dir = __dirname;
  const scriptPath = path.resolve(dir, './../../migrate.sh');
  console.log(`cwd: ${cwd} ; scriptPath: ${scriptPath} ; dir: ${dir}`);

  //await execa(path.resolve(dir, './../../migrate.sh'), [
  //  process.env.DATABASE_URL as string,
  //]);
  await execa('npx prisma migrate deploy');

  return true;
};
