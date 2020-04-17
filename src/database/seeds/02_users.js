
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('users')
    .where('id','AAAAAAAA')
    .orWhere('id','FF00FF00')
    .del()
    .then(function () {
    // Inserts seed entries
    return knex('users').insert([
        {
            id: 'AAAAAAAA',
            name: 'Admin 1',
            email: 'admin1@bughero.com',
            password: '$2b$12$vfr2xBqivFHkXFCk3wtfWeztxxW9BtSzEuqn8XNa2Jg/0faCPP72e',
            confirmed: true
        },
        {
            id: 'FF00FF00',
            name: 'Admin 2',
            email: 'admin2@bughero.com',
            password: '$2b$12$vfr2xBqivFHkXFCk3wtfWeztxxW9BtSzEuqn8XNa2Jg/0faCPP72e',
            confirmed: true
        }
    ]);
})
}

