import {execa} from 'execa';

export async function handler() {
  await execa('prisma', ['migrate', 'deploy'], {
    preferLocal: true,
    stdio: 'inherit',
  });
}
