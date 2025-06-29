import { SQLBuilder } from "../SqlBuilder.js";

class HallOfFameController {
  async get(req, res) {
    try {
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
        .limit(req.query.limit || 10)
        .offset(req.query.offset || 0)
        .build();
      const result = await req.db.prepare(sql).all();
      //   console.log(result);
      res.send(result);
    } catch (error) {
      console.error("Error fetching hall of fame data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  async search(req, res) {
    try {
      const whereClauses = [];
      let values = [];

      if (req.query.title) {
        whereClauses.push("hof.title");
        values.push(`%${req.query.title}%`);
      }
      if (req.query.artist) {
        whereClauses.push("a.artist");
        values.push(`%${req.query.artist}%`);
      }
      if (req.query.category) {
        whereClauses.push("c.category");
        values.push(`%${req.query.category}%`);
      }
      if (req.query.inducted) {
        whereClauses.push("ind.year");
        values.push(`%${req.query.inducted}%`);
      }
      if (req.query.released) {
        whereClauses.push("rel.year");
        values.push(`%${req.query.released}%`);
      }
      if (req.query.label) {
        whereClauses.push("l.label");
        values.push(`%${req.query.label}%`);
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
        .limit(req.query.limit || 10)
        .offset(req.query.offset || 0)
        .build();
      console.log(sql);
      const result = await req.db.prepare(sql).all(values);
      res.send(result);
    } catch (error) {
      console.error("Error searching artist data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new HallOfFameController();
