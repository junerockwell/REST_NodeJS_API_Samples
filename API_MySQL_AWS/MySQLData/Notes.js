const db = require('./index');
const errors = require('restify-errors');

function CreateOneNote(data) {
    return new Promise((resolve, reject) => {
        const qry = "INSERT INTO notes SET ?";
        db.pool.query(qry, data, (err, result) => {
            if (err) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: err
                });
            }

            if (result.affectedRows <= 0) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: 'Failed to create'
                });
            }

            resolve({
                code: 201,
                message: '',
                note: result
            });
        });
    });
}

function GetOneNoteById(id) {
    return new Promise((resolve, reject) => {
        const qry = "SELECT * FROM notes WHERE id = ?";
        db.pool.query(qry, id, (err, rows) => {
            if (err) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: err
                });
            }

            resolve({
                code: 200,
                message: '',
                note: rows[0] || {}
            });
        });
    });
}

function GetAll() {
    return new Promise((resolve, reject) => {
        const qry = `SELECT 
                     notes.id as noteId, 
                     notes.text, 
                     author.id as authorId, 
                     author.first_name as author_firstname
                     FROM notes 
                     RIGHT JOIN users as author 
                     ON author.id = notes.authorId 
                     WHERE notes.authorId IS NOT NULL 
                     AND notes.id IS NOT NULL`;
        db.pool.query(qry, {}, (err, rows) => {
            if (err) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: err
                });
            }

            resolve({
                code: 200,
                message: '',
                note: rows
            });
        });
    });
}

function GetNotesByAuthorId(id) {
    return new Promise((resolve, reject) => {
        const qry = `SELECT 
                     notes.id as noteId, 
                     notes.text, 
                     author.id as authorId, 
                     author.first_name as author_firstname
                     FROM notes 
                     RIGHT JOIN users as author 
                     ON author.id = notes.authorId 
                     WHERE notes.authorId = ?`;
        db.pool.query(qry, id, (err, rows) => {
            if (err) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: err
                });
            }

            resolve({
                code: 200,
                message: '',
                note: rows
            });
        });
    });
}

function UpdateOneNote(id, newNote) {
    return new Promise((resolve, reject) => {
        const qry = `UPDATE notes SET text = ? WHERE id = ?`;
        db.pool.query(qry, [newNote.text, id], (err, rows) => {
            if (err) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: err
                });
            }
            
            if (rows.changedRows <= 0) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: 'Failed to update'
                });
            }

            resolve({
                code: 200,
                message: ''
            });
        });
    });
}

function DeleteOneNoteById(id) {
    return new Promise((resolve, reject) => {
        const qry = `DELETE FROM notes WHERE id = ?`;
        db.pool.query(qry, id, (err, rows) => {
            if (err) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: err
                });
            }
            
            if (rows.affectedRows <= 0) {
                return reject({ 
                    code: new errors.InternalServerError(),
                    message: 'Failed to delete'
                });
            }
        
            resolve({
                code: 200,
                message: '',
            });
        });
    });
}

module.exports = {
    CreateOneNote,
    GetOneNoteById,
    GetAll,
    GetNotesByAuthorId,
    UpdateOneNote,
    DeleteOneNoteById
};
