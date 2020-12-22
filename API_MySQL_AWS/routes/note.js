const errors = require('restify-errors');
const Notes = require('../MySQLData/Notes');

module.exports = server => {
    server.post('/note', (req, res, next) => {
        Notes.CreateOneNote({...req.body, authorId: req.user.id })
        .then(data => {
            res.send(data.code, data.note);
        })
        .catch(error => {
            res.send(error.code, error.message)
        });
        next();
    });

    server.get('/note/:id', (req, res, next) => {
        Notes.GetOneNoteById(req.params.id)
        .then(data => {
            res.send(data.code, data.note);
        })
        .catch(error => {
            res.send(error.code, error.message)
        });
        next();
    });

    server.get('/notes', (req, res, next) => {
        Notes.GetAll()
        .then(data => {
            res.send(data.code, data.note);
        })
        .catch(error => {
            res.send(error.code, error.message)
        });
        next();
    });

    server.get('/note/author/:id', (req, res, next) => {
        Notes.GetNotesByAuthorId(req.params.id)
        .then(data => {
            res.send(data.code, data.note);
        })
        .catch(error => {
            res.send(error.code, error.message)
        });
        next();
    });

    server.put('/note/:id', (req, res, next) => {
        Notes.UpdateOneNote(req.params.id, req.body)
        .then(data => {
            res.send(data.code);
        })
        .catch(error => {
            res.send(error.code, error.message)
        });
        next();
    });

    server.del('/note/:id', (req, res, next) => {
        Notes.DeleteOneNoteById(req.params.id)
        .then(data => {
            res.send(data.code);
        })
        .catch(error => {
            res.send(error.code, error.message)
        });
        next();
    });
};