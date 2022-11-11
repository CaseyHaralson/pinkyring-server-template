import {execa} from 'execa';
import * as path from 'path';

export async function handler() {
  // await execa('prisma', ['migrate', 'deploy'], {
  //   preferLocal: true,
  //   stdio: 'inherit',
  // });
  await execa(path.resolve(process.cwd(), './migrate.sh'), [
    process.env.DATABASE_URL,
  ]);
}
