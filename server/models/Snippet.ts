import mongoose, { Document, Schema } from 'mongoose';

interface ISnippet extends Document {
    title: string;
    language: string;
    code: string;
    description: string;
    author: string;
    date: Date;
}

const SnippetSchema: Schema = new Schema({
    title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const Snippet = mongoose.model<ISnippet>('Snippet', SnippetSchema);

export default Snippet;