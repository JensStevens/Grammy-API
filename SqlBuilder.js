export class SQLBuilder {
  #sql = [];

  select(...fields) {
  const selectClause = fields.length > 0 ? fields.join(", ") : "*";
  this.#sql.push(`SELECT ${selectClause}`);
  return this;
}

  from(table) {
    this.#sql.push(`FROM ${table}`);
    return this;
  }

  where(column, operator = "=") {
    this.#sql.push(`WHERE ${column} ${operator} ?`);
    return this;
  }

  insert(table, columns) {
    this.#sql.push(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`);
    return this;
  }

  update(table, columns) {
    this.#sql.push(`UPDATE ${table} SET ${columns.map((c) => `${c} = ?`).join(", ")}`);
    return this;
  }

  offset(offset) {
    this.#sql.push(`OFFSET ${offset}`);
    return this;
  }

  limit(limit) {
    this.#sql.push(`LIMIT ${limit}`);
    return this;
  }

  delete(table) {
    this.#sql.push(`DELETE FROM ${table}`);
    return this;
  }

  join(table, on) {
    this.#sql.push(`JOIN ${table} ON ${on}`);
    return this;
  }

  leftJoin(table, on) {
    this.#sql.push(`LEFT JOIN ${table} ON ${on}`);
    return this;
  }

  orderBy(column, order = "ASC") {
    this.#sql.push(`ORDER BY ${column} ${order}`);
    return this;
  }

  groupBy(column) {
    this.#sql.push(`GROUP BY ${column}`);
    return this;
  }

  build() {
    return this.#sql.join(" ");
  }
}
