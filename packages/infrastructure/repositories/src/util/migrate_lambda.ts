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
  const scriptPath = path.resolve(cwd, './../../migrate.sh');
  console.log(`cwd: ${cwd} ; scriptPath: ${scriptPath}`);

  await execa(path.resolve(process.cwd(), './../../migrate.sh'), [
    process.env.DATABASE_URL as string,
  ]);

  return true;
};
