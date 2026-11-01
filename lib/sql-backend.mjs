// SQL pairs are reviewed individually; this module never rewrites SQL text.
export function prepareForBackend(database, d1Sql, mysqlSql) {
  return database.prepare(database.dialect === 'mysql' ? mysqlSql : d1Sql);
}
