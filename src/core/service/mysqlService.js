import mysql from 'mysql';

const startMysqlConnection = (config) =>
    mysql.createConnection(Object.assign({}, config.db, { multipleStatements: true }));

const endMysqlConnection = (conn) => conn.end();

const executeMysqlQuerie = (conn) => (query) => {
    return new Promise(function (resolve, reject) {
        if (!query || 0 === query.trim().length) {
            reject('No query provided');
        } else {
            conn.query(query, function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        }
    });
};

export { startMysqlConnection, endMysqlConnection, executeMysqlQuerie };
