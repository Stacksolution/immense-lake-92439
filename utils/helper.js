'use strict';

const DB = require('./db').getDb();
const path = require('path');
const fs = require('fs');

class Helper {
    constructor(app) {
        this.db = DB;
    }
    /**
     * Actualiza el socket_id y el status en la base de datos para mostrar un usuario como "Activo"
     * @param {*} userId Id del usuario al que se le actualizará el socket en la base de datos
     * @param {*} userSocketId Id del socket que genera Socket.IO
     */
    async addSocketId(userId, userSocketId) {
        try {
            return await this.db.query('UPDATE users set socket_id = ? WHERE id = ?', [userSocketId, userId]);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    /**
     * Cambia el estado del usuario a desconectado y elimina el socket que tenía asignado
     * @param {*} userSocketId Id del socket del usuario que se desconectará del socket
     */
    async noVisible(userSocketId) {
        const result = await this.db.query('UPDATE users SET socket_id = ?, WHERE socket_id = ?', ['', userSocketId])
        return Promise.resolve(JSON.parse(JSON.stringify(result)));
    }

    /**
     * Obtiene la lista de los usuarios conectados.
     * @param {*} userId ID del usuario que está consultando la lista de usuarios.
     */
    getChatList(userId) {
        try {
            return Promise.all([
                this.db.query(`SELECT * FROM users WHERE id= ? `, [userId])
            ]).then((response) => {
                return {
                    usersList: Promise.resolve(JSON.parse(JSON.stringify(response)))[0]
                };
            }).catch((error) => {
                console.warn(error);
                return (null);
            });
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    /**
     * Inserta un mensaje en la base de datos
     * @param {*} params Params es un JSON que debe contener los datos del mensaje
     */
    async insertMessages(params) {
        try {
            const result = await this.db.query("INSERT INTO messages (from_user_id,to_user_id,message, date, time) values (?,?,?,?,?)", [params.fromUserId, params.toUserId, params.message, params.date, params.time]
            );
            return Promise.resolve(JSON.parse(JSON.stringify(result)));
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    /**
     * Obtiene los mensajes del usuario que se le pasa por parámetro
     * @param {*} userId ID del usuario que está consultando los mensajes
     * @param {*} toUserId ID del usuario que está consultando los mensajes
     */
    async getMessages(userId, toUserId) {
        try {
            const result = await this.db.query(
                `SELECT * FROM messages WHERE
					(from_user_id = ? AND to_user_id = ? )
					OR
					(from_user_id = ? AND to_user_id = ? )	ORDER BY id ASC
				`,
                [userId, toUserId, toUserId, userId]
            );
            return Promise.resolve(JSON.parse(JSON.stringify(result)));
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    /**
     * 
     * Obtiene la información del usuario que se le pasa por parámetro
     * @param {*} userId ID del usuario del que se consultará la información
     */
    async getUserData(userId) {
        try {
            const result = await this.db.query('SELECT * FROM users where id = ?', [userId]);
            return Promise.resolve(JSON.parse(JSON.stringify(result))[0]);
        } catch (error) {
            console.warn(error);
            return null;
        }
    }
}

module.exports = new Helper();
