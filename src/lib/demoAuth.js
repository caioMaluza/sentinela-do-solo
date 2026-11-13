// Credenciais públicas de um protótipo.
// Não representam autenticação real.

export const DEMO_ACCOUNTS = Object.freeze([
  Object.freeze({
    id: 'citizen',
    role: 'citizen',
    label: 'Cidadão',
    name: 'Pessoa da comunidade',
    email: 'cidadao@sentinela.demo',
    password: 'Sentinela@2026'
  }),

  Object.freeze({
    id: 'civil',
    role: 'civil',
    label: 'Defesa Civil',
    name: 'Equipe de monitoramento',
    email: 'defesa@sentinela.demo',
    password: 'Sentinela@2026'
  }),

  Object.freeze({
    id: 'company',
    role: 'company',
    label: 'Empresa',
    name: 'Equipe Via Serra',
    companyId: 'via-serra',
    email: 'empresa@sentinela.demo',
    password: 'Sentinela@2026'
  })
]);

function publicAccount(account) {
  if (!account) return null;

  const { password, ...session } = account;
  return session;
}

export function getDemoAccount(id) {
  return publicAccount(
    DEMO_ACCOUNTS.find(account => account.id === id)
  );
}

export function authenticateDemo(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  return publicAccount(
    DEMO_ACCOUNTS.find(account =>
      account.email === email.trim().toLowerCase()
      && account.password === password
    )
  );
}