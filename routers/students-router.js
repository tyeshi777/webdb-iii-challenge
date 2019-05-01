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
  db("students")
    .then(student => {
      res.status(200).json(student);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  db("students")
    .where({ id: req.params.id })
    .first()
    .then(student => {
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ message: "no such student" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
router.post("/", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ message: "please provide a name" });
  } else {
    db("students")
      .insert(req.body, "id")
      .then(ids => {
        db("students")
          .where({ id: ids[0] })
          .first()
          .then(student => {
            res.status(200).json(student);
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
router.put("/:id", (req, res) => {
  db("students")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "students" : "student"} updated`
        });
      } else {
        res.status(400).json({ message: "no such student" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
