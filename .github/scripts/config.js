import semver from 'semver';
import { promises as fs } from 'fs';

const packageData = await fs.readFile(new URL('../../package.json', import.meta.url));
const { engines } = JSON.parse(packageData);

const comparators = semver
  .toComparators(engines.node)
  .flat()
  .map(v => semver.coerce(v));
const minVersion = semver.minSatisfying(comparators, engines.node).version;
const maxVersion = semver.maxSatisfying(comparators, engines.node).version;
const mainVersion = `${semver.major(maxVersion)}.x`;

console.log(
  JSON.stringify({
    node: {
      matrix: {
        node: [minVersion, mainVersion],
        os: ['ubuntu-latest'],
      },
      main: {
        version: mainVersion,
        os: 'ubuntu-latest',
      },
    },
  })
);
