const routes = new Map();

export function registerRoute(name, page) {
  routes.set(name, page);
}

export function navigate(name) {
  const page = routes.get(name);

  if (!page) {
    console.error(`Route "${name}" not found.`);
    return;
  }

  document.querySelector("#app").innerHTML = page();
}
