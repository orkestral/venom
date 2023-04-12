import Spinnies from 'spinnies';

let spinnies: Spinnies = null;

export function getSpinnies(options?: Spinnies.Options): Spinnies {
  if (!spinnies) {
    spinnies = new Spinnies(options);
  }
  return spinnies;
}
