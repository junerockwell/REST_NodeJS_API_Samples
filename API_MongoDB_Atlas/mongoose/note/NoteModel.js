const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const NoteSchema = new mongoose.Schema({
	note: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        // required: true
    }
});

/* Plugins
 ============================================= */
 NoteSchema.plugin(timestamp);

/* Methods
 ============================================= */

module.exports = mongoose.model('Note', NoteSchema);





