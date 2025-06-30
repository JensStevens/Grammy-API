import { SQLBuilder } from "../SqlBuilder.js";

class HallOfFameController {
  async get(req, res) {
    try {
      const { limit, offset } = req.query;
      const sqlBuilder = new SQLBuilder()
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
        .join("label as l", "hof.label_id = l.id");

      const sort = req.query.sort;
      const dir = req.query.dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      const sortableFields = {
        title: "hof.title",
        artist: "a.artist",
        category: "c.category",
        inducted: "ind.year",
        released: "rel.year",
        label: "l.label",
      };

      if (sort && sortableFields[sort]) {
        sqlBuilder.orderBy(sortableFields[sort], dir);
      } else {
        sqlBuilder.orderBy("ind.year", "DESC"); // default sort
      }

      const sql = sqlBuilder
        .limit(limit || 10)
        .offset(offset || 0)
        .build();
      const result = await req.db.prepare(sql).all();
      const sqlCount = new SQLBuilder()
        .select("COUNT(*) as count")
        .from("hall_of_fame as hof")
        .join("artist as a", "hof.artist_id = a.id")
        .join("category as c", "hof.category_id = c.id")
        .join("inducted as ind", "hof.inducted_id = ind.id")
        .join("released as rel", "hof.released_id = rel.id")
        .join("label as l", "hof.label_id = l.id")
        .build();
      const count = (await req.db.prepare(sqlCount).get()).count;
      res.send({ data: result, count });
    } catch (error) {
      console.error("Error fetching hall of fame data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async search(req, res) {
    try {
      const {
        title,
        artist,
        category,
        inducted,
        released,
        label,
        inducted_from,
        inducted_to,
        released_from,
        released_to,
        limit,
        offset,
        sort,
        dir,
      } = req.query;
      const whereClauses = [];
      const values = [];

      if (title) {
        whereClauses.push("hof.title LIKE ?");
        values.push(`%${title}%`);
      }
      if (artist) {
        whereClauses.push("a.artist LIKE ?");
        values.push(`%${artist}%`);
      }
      if (category) {
        whereClauses.push("c.category LIKE ?");
        values.push(`%${category}%`);
      }
      if (inducted) {
        whereClauses.push("ind.year LIKE ?");
        values.push(`%${inducted}%`);
      }
      if (inducted_from) {
        whereClauses.push("ind.year >= ?");
        values.push(inducted_from);
      }
      if (inducted_to) {
        whereClauses.push("ind.year <= ?");
        values.push(inducted_to);
      }
      if (released) {
        whereClauses.push("rel.year LIKE ?");
        values.push(`%${released}%`);
      }
      if (released_from) {
        whereClauses.push("rel.year >= ?");
        values.push(released_from);
      }
      if (released_to) {
        whereClauses.push("rel.year <= ?");
        values.push(released_to);
      }
      if (label) {
        whereClauses.push("l.label LIKE ?");
        values.push(`%${label}%`);
      }

      const sqlBuilder = new SQLBuilder()
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
        .join("label as l", "hof.label_id = l.id");
      
      if (whereClauses.length) {
        sqlBuilder.whereRaw(whereClauses.join(" AND "));
      }

      const sortableFields = {
        title: "hof.title",
        artist: "a.artist",
        category: "c.category",
        inducted: "ind.year",
        released: "rel.year",
        label: "l.label",
      };

      const orderDirection = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      if (sort && sortableFields[sort]) {
        sqlBuilder.orderBy(sortableFields[sort], orderDirection);
      } else {
        sqlBuilder.orderBy("ind.year", "DESC"); // default sort
      }

      const sql = sqlBuilder
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
      const { limit, offset, sort, dir } = req.query;
      const sqlBuilder = new SQLBuilder()
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
        .where("ind.year");

      const sortableFields = {
        title: "hof.title",
        artist: "a.artist",
        category: "c.category",
        inducted: "ind.year",
        released: "rel.year",
        label: "l.label",
      };

      const orderDirection = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      if (sort && sortableFields[sort]) {
        sqlBuilder.orderBy(sortableFields[sort], orderDirection);
      } else {
        sqlBuilder.orderBy("ind.year", "DESC"); // default sort
      }

      const sql = sqlBuilder
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
