import { SQLBuilder } from "../SqlBuilder.js";

class HallOfFameController {
  async get(req, res) {
    try {
      const { limit, offset } = req.query;
      const sql = new SQLBuilder()
        .select(
          "hof.title",
          "a.artist as artist",
          "c.category as category",
          "ind.year as inducted",
          "rel.year as released",
          "l.label as label"
        )
        .from("hall_of_fame as hof")
        .join("artist as a", "hof.artist_id = a.id")
        .join("category as c", "hof.category_id = c.id")
        .join("inducted as ind", "hof.inducted_id = ind.id")
        .join("released as rel", "hof.released_id = rel.id")
        .join("label as l", "hof.label_id = l.id")
        .orderBy("inducted", "DESC")
        .limit(limit || 10)
        .offset(offset || 0)
        .build();
      const result = await req.db.prepare(sql).all();
      res.send(result);
    } catch (error) {
      console.error("Error fetching hall of fame data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async search(req, res) {
    try {
      const { title, artist, category, inducted, released, label, limit, offset } = req.query;
      const whereClauses = [];
      const values = [];

      if (title) {
        whereClauses.push("hof.title");
        values.push(`%${title}%`);
      }
      if (artist) {
        whereClauses.push("a.artist");
        values.push(`%${artist}%`);
      }
      if (category) {
        whereClauses.push("c.category");
        values.push(`%${category}%`);
      }
      if (inducted) {
        whereClauses.push("ind.year");
        values.push(`%${inducted}%`);
      }
      if (released) {
        whereClauses.push("rel.year");
        values.push(`%${released}%`);
      }
      if (label) {
        whereClauses.push("l.label");
        values.push(`%${label}%`);
      }

      const sql = new SQLBuilder()
        .select(
          "hof.title",
          "a.artist as artist",
          "c.category as category",
          "ind.year as inducted",
          "rel.year as released",
          "l.label as label"
        )
        .from("hall_of_fame as hof")
        .join("artist as a", "hof.artist_id = a.id")
        .join("category as c", "hof.category_id = c.id")
        .join("inducted as ind", "hof.inducted_id = ind.id")
        .join("released as rel", "hof.released_id = rel.id")
        .join("label as l", "hof.label_id = l.id")
        .where(whereClauses.join(" LIKE ? AND "), "LIKE", values)
        .limit(limit || 10)
        .offset(offset || 0)
        .build();
      const result = await req.db.prepare(sql).all(values);
      res.send(result);
    } catch (error) {
      console.error("Error searching artist data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async getByYear(req, res) {
    try {
      const { year } = req.params;
      const { limit, offset } = req.query;
      const sql = new SQLBuilder()
        .select(
          "hof.title",
          "a.artist as artist",
          "c.category as category",
          "ind.year as inducted",
          "rel.year as released",
          "l.label as label"
        )
        .from("hall_of_fame as hof")
        .join("artist as a", "hof.artist_id = a.id")
        .join("category as c", "hof.category_id = c.id")
        .join("inducted as ind", "hof.inducted_id = ind.id")
        .join("released as rel", "hof.released_id = rel.id")
        .join("label as l", "hof.label_id = l.id")
        .where("ind.year")
        .limit(limit || 10)
        .offset(offset || 0)
        .build();
      const result = await req.db.prepare(sql).all(year);
      res.send(result);
    } catch (error) {
      console.error("Error fetching hall of fame data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new HallOfFameController();

