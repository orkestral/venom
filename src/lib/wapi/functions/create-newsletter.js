export async function createNewsletter(name, description, image) {
  try {
    let options = {
      name: name,
      description: description,
      picture: image
    };
    const resp = await window.Store.createNewsletterQuery.createNewsletterQuery(
      options
    );
    return resp;
  } catch {
    return false;
  }
}
