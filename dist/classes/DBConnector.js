"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
class DBConnector {
    constructor() {
        this.config = {
            multipleStatements: true,
            host: "192.168.1.60",
            user: "konradd",
            password: "samba20",
            port: "13306",
            database: 'konradd'
        };
    }
    insertRows(query) {
        let _this = this;
        this.sqlStartConnection().then(con => {
            con.query(query, function (err, result) {
                if (err) {
                    throw new Error(err);
                }
                _this.sqlEndConnection(con, () => {
                    console.log("gotowe");
                });
            });
        }).catch(err => {
            throw new Error(err);
        });
    }
    sqlStartConnection() {
        let _this = this;
        return new Promise((resolve, reject) => {
            let connection = mysql.createConnection(_this.config);
            connection.connect(function (err) {
                if (err !== null) {
                    reject("[MYSQL] Error connecting to mysql:" + err + '\n');
                }
                else {
                    resolve(connection);
                }
            });
        });
    }
    sqlEndConnection(connection, callback) {
        connection.end(() => {
            callback();
        });
    }
}
exports.DBConnector = DBConnector;
//# sourceMappingURL=DBConnector.js.map