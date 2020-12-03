const errors = require('restify-errors');
const Note = require('../mongoose/note/NoteData');

module.exports = server => {
    server.post('/note', async(req, res, next) => {
        try {
            const data = await Note.CreateOneNote({
                note: req.body.note,
                authorId: req.user._id
            });
            res.send(data.code, data.note);
            next();
        }
        catch(error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError())
        }
    });

    server.get('/note/:id', async(req, res, next) => {
        try {
            const data = await Note.GetOneNoteById(req.params.id);
            res.send(data.code, data.note);
            next();
        }
        catch(error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError())
        }
    });

    server.get('/notes', async(req, res, next) => {
        try {
            const data = await Note.GetAllNotes();
            res.send(data.code, data.notes);
            next();
        }
        catch(error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError());
        }
    });

    server.get('/note/author/:id', async(req, res, next) => {
        try {
            const data = await Note.GetNotesByAuthorId(req.params.id);
            res.send(data.code, data.note);
            next();
        }
        catch(error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError());
        }
    });

    server.put('/note/:id', async(req, res, next) => {
        try {
            const data = await Note.UpdateOneNote(req.params.id, req.body.note);
            res.send(data.code, data.note);
            next();
        }
        catch (error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError());
        }
    });

    server.del('/note/:id', async(req, res, next) => {
        try {
            const data = await Note.DeleteOneNoteById(req.params.id);
            res.send(data.code, data.note);
            next();
        }
        catch (error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError());
        }
    });
};