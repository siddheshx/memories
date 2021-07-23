import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/user.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.get('/', (req, res) => {
    res.send("Hello to memories API");
})

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Serve at http://localhost:${PORT}`);
    })
}).catch((error) => console.log(error));

mongoose.set('useFindAndModify', false);