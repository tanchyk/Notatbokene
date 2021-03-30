module.exports = {
  type: 'postgres',
  port: 5432,
  database: 'Notatbokene',
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"]
}