db = db.getSiblingDB('tg-frontend-admin');

db.createUser({
  user: 'tg-frontend-user',
  pwd: 'tg-frontend-password',
  roles: [
    {
      role: 'readWrite',
      db: 'tg-frontend-admin',
    },
  ],
});
