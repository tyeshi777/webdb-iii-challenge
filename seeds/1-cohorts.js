exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("cohorts")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("cohorts").insert([
        { name: "web 17" },
        { name: "web 18" },
        { name: "web 19" }
      ]);
    });
};
