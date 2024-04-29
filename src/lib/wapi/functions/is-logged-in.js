export function isLoggedIn(done) {
  // Contact always exists when logged in
  const isLogged = window.Store.Contact && window.Store.Contact.length > 0;

  if (done !== undefined) done(isLogged);
  return isLogged;
}
