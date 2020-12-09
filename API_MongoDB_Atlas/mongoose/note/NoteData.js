const Note = require('./NoteModel');
const errors = require('restify-errors');

async function GetOneNoteById(id) {
    try {
        const note = await Note.findById(id);

        return {
            code: 200,
            note,
        };
    } 
    catch (error) {
        global.logger.error(error);
        return { code: new errors.InternalServerError() };
    }
}

async function GetNotesByAuthorId(id) {
    try {
        const note = await Note.find({ authorId: id });
   
        return {
            code: 200,
            note,
        };
    } 
    catch (error) {
        global.logger.error(error);
        return { code: new errors.InternalServerError() };
    }
}

async function CreateOneNote(data) {
    try {
        const note = await new Note({
            note: data.note,
            authorId: data.authorId
        }).save();

        return {
            code: 201,
            message: '',
            note
        }
    }
    catch(error) {
        global.logger.error(error);
        return { code: new errors.InternalServerError() };
    }
}

async function GetAllNotes() {
    try {
        const notes = await Note.find({});
        return {
            code: 200,
            notes
        };
    }
    catch (error) {
        global.logger.error(error);
        return { code: new errors.InternalServerError() };
    }
}

async function UpdateOneNote(id, newNote) {
    try {
        const note = await Note.findOneAndUpdate({ _id: id }, { note: newNote }, { new: true });
        return {
            code: 200,
            note,
        }
    }
    catch(error) {
        global.logger.error(error);
        return { code: new errors.InternalServerError() };
    }
}

async function DeleteOneNoteById(id) {
    try {
        const note = await Note.findOneAndDelete({ _id: id });

        return {
            code: 200,
            note,
        }
    }
    catch(error) {
        global.logger.error(error);
        return { code: new errors.InternalServerError() };
    }
}

module.exports = {
    GetOneNoteById,
    GetNotesByAuthorId,
    CreateOneNote,
    GetAllNotes,
    UpdateOneNote,
    DeleteOneNoteById
};