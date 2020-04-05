
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        {
          id: 1,
          name: "Dono",
          description: "Dono do projeto.",
          read: true,
          edit: true,
          create: true
        },
        {
          id: 2,
          name: "Admin",
          description: "Administrador do projeto.",
          read: true,
          edit: true,
          create: true
        },
        {
          id: 3,
          name: "Desenvolvedor",
          description: "Desenvolvedor do projeto.",
          read: true,
          edit: false,
          create: true
        }
      ]);
    });
};
