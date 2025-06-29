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
        .build();
      const result = await req.db.prepare(sql).all();
    //   console.log(result);
      res.send(result);
    } catch (error) {
      console.error("Error fetching hall of fame data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new HallOfFameController();
