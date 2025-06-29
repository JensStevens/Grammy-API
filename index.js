import express from "express";
import Database from "better-sqlite3";
import csv from "csvtojson";
import hofRoutes from "./routes/hall_of_fame.js";

const app = express();
const db = new Database("hall_of_fame.db", { verbose: console.log });

db.exec(
  "CREATE TABLE IF NOT EXISTS artist (id INTEGER PRIMARY KEY NOT NULL, artist TEXT NOT NULL)"
)
  .exec(
    "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY NOT NULL, category TEXT NOT NULL)"
  )
  .exec(
    "INSERT OR IGNORE INTO category VALUES (1, 'Single'), (2, 'Album'), (3, 'Track')"
  )
  .exec(
    "CREATE TABLE IF NOT EXISTS inducted (id INTEGER PRIMARY KEY NOT NULL, year TEXT NOT NULL)"
  )
  .exec(
    "CREATE TABLE IF NOT EXISTS released (id INTEGER PRIMARY KEY NOT NULL, year TEXT NOT NULL)"
  )
  .exec(
    "CREATE TABLE IF NOT EXISTS label (id INTEGER PRIMARY KEY NOT NULL, label TEXT NOT NULL)"
  );
db.exec(
  "CREATE TABLE IF NOT EXISTS hall_of_fame (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, artist_id INTEGER NOT NULL, category_id INTEGER NOT NULL, inducted_id INTEGER NOT NULL, label_id INTEGER NOT NULL, released_id INTEGER NOT NULL, FOREIGN KEY(artist_id) REFERENCES artist(id), FOREIGN KEY(category_id) REFERENCES category(id), FOREIGN KEY(inducted_id) REFERENCES inducted(id), FOREIGN KEY(released_id) REFERENCES released(id), FOREIGN KEY(label_id) REFERENCES label(id))"
);

const imports = [
  {
    file: "csv/artists.csv",
    table: "artist",
    columns: ["id", "artist"],
    values: ["id", "artist"],
  },
  {
    file: "csv/inducted.csv",
    table: "inducted",
    columns: ["id", "year"],
    values: ["id", "year"],
  },
  {
    file: "csv/label.csv",
    table: "label",
    columns: ["id", "label"],
    values: ["id", "label"],
  },
  {
    file: "csv/released.csv",
    table: "released",
    columns: ["id", "year"],
    values: ["id", "year"],
  },
  {
    file: "csv/hall_of_fame.csv",
    table: "hall_of_fame",
    columns: [
      "id",
      "title",
      "artist_id",
      "category_id",
      "inducted_id",
      "released_id",
      "label_id",
    ],
    values: [
      "id",
      "title",
      "artist_id",
      "category_id",
      "inducted_id",
      "released_id",
      "label_id",
    ],
  },
];


imports.map((importConfig) => {
  return csv()
    .fromFile(importConfig.file)
    .then((data) => {
      console.log(`Importing data from ${importConfig.file}`);
      data.forEach((row) => {
        const values = importConfig.columns.map((column) => row[column]);
        db.prepare(
          `INSERT OR IGNORE INTO ${importConfig.table} (${importConfig.columns.join(", ")}) VALUES (${importConfig.values.map(() => "?").join(", ")})`
        ).run(...values);
      });
      console.log(`Inserted ${data.length} rows into ${importConfig.table} table successfully.`);
    })
    .catch((err) => {
      console.error(`Error importing data from ${importConfig.file}:`, err);
    });
});

app.use(async (req, res, next) => {
  req.db = db;
  next();
});
app.get("/", (req, res) => res.send("Hello World!"));
app.use(hofRoutes);

app.listen(3000, () => console.log("Example app listening on port 3000!"));

