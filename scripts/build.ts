import { execaCommandSync as exec } from 'execa';
import { chProjectDir, copyPackageFiles, rmDist } from 'lionconfig';

chProjectDir(import.meta.url);
rmDist();
await copyPackageFiles();
exec('tsc');
exec('tsc-alias');
