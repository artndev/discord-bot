import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import cors from 'cors';
import express from 'express';
import { aiChatHistoryRouter, guildsRouter } from './routers';

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }),
);
app.use(express.json());

app.use('/guilds', guildsRouter);

app.use('/ai_chat_history', aiChatHistoryRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is listening on port ${port}:\nhttp://localhost:${port}`));
