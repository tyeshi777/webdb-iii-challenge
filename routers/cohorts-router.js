const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.db3"
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("cohorts")
    .then(cohort => {
      res.status(200).json(cohort);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ msg: "please provide a name" });
  } else {
    db("cohorts")
      .insert(req.body, "id")
      .then(ids => {
        db("cohorts")
          .where({ id: ids[0] })
          .first()
          .then(cohort => {
            res.status(200).json(cohort);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});
router.get("/:id", (req, res) => {
  db("cohorts")
    .where({ id: req.params.id })
    .first()
    .then(cohort => {
      if (cohort) {
        res.status(200).json(cohort);
      } else {
        res.status(404).json({ message: "no such cohorts started yet" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  db("cohorts")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "cohorts" : "cohort"} updated`
        });
      } else {
        res.status(400).json({ message: "no such cohort exists" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
module.exports = router;
