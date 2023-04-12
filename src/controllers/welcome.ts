import { yo } from 'yoo-hoo';
let welcomeShown = false;
export function welcomeScreen() {
  if (welcomeShown) {
    return;
  }
  welcomeShown = true;
  yo('SNAKE-PRO', { color: 'cyan' });
  console.log('\n\n');
}
