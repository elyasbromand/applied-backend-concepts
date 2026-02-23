// I no longer user this file, but I keep it here for future reference. I switched to using the Prisma adapter for MariaDB instead of using mysql2 directly.


import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const url = new URL(process.env.DATABASE_URL);

const config = {
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname ? url.pathname.replace(/^\//, "") : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(config);

export default pool;
