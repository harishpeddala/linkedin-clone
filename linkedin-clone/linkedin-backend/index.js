const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('joinConversation', (conversationId) => {
        console.log('User joined conversation:', conversationId);
        socket.join(conversationId);
    });

    socket.on('sendMessage', (conversationId, messageDetail) => {
        console.log('Message Sent:', messageDetail);
        io.to(conversationId).emit('receiveMessage', messageDetail);
    });
});

require('./connection');
require('dotenv').config({ path: "./config.env" });


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
});

// API documentation (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const notificationRouter = require('./routes/notification');
const commentRouter = require('./routes/comment');
const conversationRouter = require('./routes/conversation');
const messageRouter = require('./routes/message');

app.use('/api/auth', userRouter);
app.use('/api/post', postRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/comment', commentRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);

server.listen(PORT, () => {
    console.log(`Click to follow: http://localhost:${PORT}`);
    console.log(`API docs available at: http://localhost:${PORT}/api-docs`);
});
