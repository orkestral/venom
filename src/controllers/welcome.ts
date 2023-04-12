import { yo } from 'yoo-hoo';
let welcomeShown = false;
export function welcomeScreen() {
  if (welcomeShown) {
    return;
  }
  welcomeShown = true;
  yo('VENOM-BOT', { color: 'cyan' });
  console.log('\n\n');
}
