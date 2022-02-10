const util = require('util')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: "127.0.0.1",
    database: 'chatapp',
    user: "root",
    password: ""
})

const initDb = () => {
    console.log("connecting to mysql db ...")
    return util.promisify(connection.commit).call(connection)
}
const getDb = () => {
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}
module.exports = {
    initDb: initDb,
    getDb: getDb,
}

