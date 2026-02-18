import process from 'node:process';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';

const checks = [
  { name: 'index', path: '/' },
  { name: 'login', path: '/auth/login' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'critical-manage-condominiums', path: '/dashboard/manage-condominiums' },
];

async function run() {
  for (const check of checks) {
    const response = await fetch(`${baseUrl}${check.path}`);

    if (!response.ok) {
      throw new Error(`[${check.name}] status inesperado: ${response.status}`);
    }

    const html = await response.text();
    if (!html.includes('<div id="root">')) {
      throw new Error(`[${check.name}] resposta não parece o shell SPA`);
    }

    console.log(`✔ ${check.name}: ${response.status}`);
  }

  console.log(`Smoke de preview concluído em ${baseUrl}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
