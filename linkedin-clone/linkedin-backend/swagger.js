// OpenAPI 3.0 specification for the LinkedIn Clone API.
// Served through Swagger UI at GET /api-docs (see index.js).

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'LinkedIn Clone API',
        version: '1.0.0',
        description:
            'REST API for the LinkedIn Clone application. Authentication uses an httpOnly `token` cookie that is set on successful login/register. In Swagger UI, run **login** first (the browser stores the cookie automatically) and then the protected endpoints will work.',
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local development server' },
    ],
    tags: [
        { name: 'Auth', description: 'Authentication and user/network management' },
        { name: 'Posts', description: 'Feed posts' },
        { name: 'Comments', description: 'Post comments' },
        { name: 'Notifications', description: 'User notifications' },
        { name: 'Conversations', description: 'Chat conversations' },
        { name: 'Messages', description: 'Chat messages' },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'token',
                description: 'JWT stored in an httpOnly cookie, set automatically on login/register.',
            },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Invalid Credentials. Please try again.' },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['email', 'password', 'f_name'],
                properties: {
                    email: { type: 'string', example: 'sunny@gmail.com' },
                    password: { type: 'string', example: '54321' },
                    f_name: { type: 'string', example: 'Sunny Reddy' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', example: 'jayavardhan@gmail.com' },
                    password: { type: 'string', example: '54321' },
                },
            },
            GoogleLoginRequest: {
                type: 'object',
                required: ['token'],
                properties: {
                    token: { type: 'string', description: 'Google ID token', example: '<google-id-token>' },
                },
            },
            UpdateUserRequest: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        example: { about: 'About section updated from the update API', headline: 'Software Engineer' },
                    },
                },
            },
            AddPostRequest: {
                type: 'object',
                required: ['desc'],
                properties: {
                    desc: { type: 'string', example: 'This is my first post!' },
                    imageLink: { type: 'string', example: '' },
                },
            },
            LikeDislikeRequest: {
                type: 'object',
                required: ['postId'],
                properties: {
                    postId: { type: 'string', example: '6a30291525ff04baba70eb38' },
                },
            },
            AddCommentRequest: {
                type: 'object',
                required: ['postId', 'comment'],
                properties: {
                    postId: { type: 'string', example: '6a30291525ff04baba70eb38' },
                    comment: { type: 'string', example: 'Hello, Welcome to Coding World' },
                },
            },
            FriendRequestBody: {
                type: 'object',
                required: ['receiverId'],
                properties: {
                    receiverId: { type: 'string', example: '6a3180c143c8853b629523fd' },
                },
            },
            AcceptFriendRequestBody: {
                type: 'object',
                required: ['senderId'],
                properties: {
                    senderId: { type: 'string', example: '6a2e8427ea355f29bb6e3a8e' },
                },
            },
            MarkAsReadRequest: {
                type: 'object',
                properties: {
                    notificationId: { type: 'string', example: '6a3180c143c8853b629523fd' },
                },
            },
            AddConversationRequest: {
                type: 'object',
                required: ['recipientId', 'message'],
                properties: {
                    recipientId: { type: 'string', example: '6a318a5f170d6b89b1c16c2a' },
                    message: { type: 'string', example: 'Hello, Welcome to LinkedIn Community...' },
                },
            },
            SendMessageRequest: {
                type: 'object',
                required: ['conversationId', 'message'],
                properties: {
                    conversationId: { type: 'string', example: '6a321a370c5232eec914550a' },
                    message: { type: 'string', example: 'How is the trip???' },
                    picture: { type: 'string', example: '' },
                },
            },
            SuccessMessage: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Operation successful' },
                    success: { type: 'boolean', example: true },
                    data: { type: 'object' },
                },
            },
        },
    },
    paths: {
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
                },
                responses: {
                    201: { description: 'User registered successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'User already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Log in with email and password',
                description: 'On success, sets the `token` httpOnly cookie used for authenticated requests.',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
                },
                responses: {
                    200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
                    400: { description: 'Invalid credentials or user not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/google': {
            post: {
                tags: ['Auth'],
                summary: 'Log in or register with a Google ID token',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/GoogleLoginRequest' } } },
                },
                responses: {
                    200: { description: 'User logged in successfully' },
                    201: { description: 'New user registered successfully' },
                },
            },
        },
        '/api/auth/self': {
            get: {
                tags: ['Auth'],
                summary: 'Get the currently logged-in user',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: 'User data retrieved successfully' },
                    401: { description: 'Not authenticated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/user/{id}': {
            get: {
                tags: ['Auth'],
                summary: 'Get a user profile by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '6a2e8427ea355f29bb6e3a8e' }],
                responses: {
                    200: { description: 'User profile retrieved successfully' },
                    404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/update': {
            put: {
                tags: ['Auth'],
                summary: 'Update the current user profile',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } },
                },
                responses: {
                    200: { description: 'User updated successfully' },
                    404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/findUser': {
            get: {
                tags: ['Auth'],
                summary: 'Search users by name or email',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'query', in: 'query', required: true, schema: { type: 'string' }, example: 'jaya' }],
                responses: { 200: { description: 'Users fetched successfully' } },
            },
        },
        '/api/auth/sendFriendRequest': {
            post: {
                tags: ['Auth'],
                summary: 'Send a connection (friend) request',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/FriendRequestBody' } } },
                },
                responses: {
                    200: { description: 'Friend request sent successfully' },
                    400: { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/acceptFriendRequest': {
            post: {
                tags: ['Auth'],
                summary: 'Accept a connection (friend) request',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AcceptFriendRequestBody' } } },
                },
                responses: { 200: { description: 'Friend request accepted successfully' } },
            },
        },
        '/api/auth/getFriendsList': {
            get: {
                tags: ['Auth'],
                summary: 'Get the list of accepted connections',
                security: [{ cookieAuth: [] }],
                responses: { 200: { description: 'Friends list retrieved successfully' } },
            },
        },
        '/api/auth/getPendingFriendsList': {
            get: {
                tags: ['Auth'],
                summary: 'Get the list of pending connection requests',
                security: [{ cookieAuth: [] }],
                responses: { 200: { description: 'Pending friends list retrieved successfully' } },
            },
        },
        '/api/auth/removeFriend/{friendId}': {
            delete: {
                tags: ['Auth'],
                summary: 'Remove a connection',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'friendId', in: 'path', required: true, schema: { type: 'string' }, example: '6a2e8427ea355f29bb6e3a8e' }],
                responses: { 200: { description: 'Friend removed successfully' } },
            },
        },
        '/api/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Log out (clears the auth cookie)',
                security: [{ cookieAuth: [] }],
                responses: { 200: { description: 'Logout successful' } },
            },
        },
        '/api/post': {
            post: {
                tags: ['Posts'],
                summary: 'Create a new post',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AddPostRequest' } } },
                },
                responses: { 201: { description: 'Post created successfully' } },
            },
        },
        '/api/post/likeDislike': {
            post: {
                tags: ['Posts'],
                summary: 'Toggle like/dislike on a post',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/LikeDislikeRequest' } } },
                },
                responses: {
                    200: { description: 'Post liked/disliked successfully' },
                    404: { description: 'Post not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/post/getAllPosts': {
            get: {
                tags: ['Posts'],
                summary: 'Get all posts (feed)',
                responses: { 200: { description: 'Posts retrieved successfully' } },
            },
        },
        '/api/post/getPostById/{id}': {
            get: {
                tags: ['Posts'],
                summary: 'Get a single post by ID',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '6a30291525ff04baba70eb38' }],
                responses: {
                    200: { description: 'Post retrieved successfully' },
                    404: { description: 'Post not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/post/getTop5Posts/{id}': {
            get: {
                tags: ['Posts'],
                summary: "Get a user's 5 most recent posts",
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '6a2e8427ea355f29bb6e3a8e' }],
                responses: { 200: { description: 'Top 5 posts retrieved successfully' } },
            },
        },
        '/api/post/getUserPosts/{id}': {
            get: {
                tags: ['Posts'],
                summary: 'Get all posts by a user',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '6a2e8427ea355f29bb6e3a8e' }],
                responses: { 200: { description: 'User posts retrieved successfully' } },
            },
        },
        '/api/comment': {
            post: {
                tags: ['Comments'],
                summary: 'Add a comment to a post',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AddCommentRequest' } } },
                },
                responses: {
                    201: { description: 'Comment added successfully' },
                    404: { description: 'Post not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/comment/{postId}': {
            get: {
                tags: ['Comments'],
                summary: 'Get comments for a post',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' }, example: '6a30291525ff04baba70eb38' }],
                responses: { 200: { description: 'Comments retrieved successfully' } },
            },
        },
        '/api/notification': {
            get: {
                tags: ['Notifications'],
                summary: 'Get all notifications',
                security: [{ cookieAuth: [] }],
                responses: { 200: { description: 'Notifications retrieved successfully' } },
            },
        },
        '/api/notification/markAsRead': {
            put: {
                tags: ['Notifications'],
                summary: 'Mark notification(s) as read',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: false,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/MarkAsReadRequest' } } },
                },
                responses: { 200: { description: 'Notifications marked as read' } },
            },
        },
        '/api/notification/activeNotifications': {
            get: {
                tags: ['Notifications'],
                summary: 'Get unread (active) notifications',
                security: [{ cookieAuth: [] }],
                responses: { 200: { description: 'Active notifications retrieved successfully' } },
            },
        },
        '/api/conversation/addConversation': {
            post: {
                tags: ['Conversations'],
                summary: 'Start or fetch a conversation and send the first message',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AddConversationRequest' } } },
                },
                responses: { 200: { description: 'Conversation retrieved successfully' } },
            },
        },
        '/api/conversation/getConversations': {
            get: {
                tags: ['Conversations'],
                summary: "Get the current user's conversations",
                security: [{ cookieAuth: [] }],
                responses: { 200: { description: 'Conversations retrieved successfully' } },
            },
        },
        '/api/message': {
            post: {
                tags: ['Messages'],
                summary: 'Send a message',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SendMessageRequest' } } },
                },
                responses: { 201: { description: 'Message sent successfully' } },
            },
        },
        '/api/message/{conversationId}': {
            get: {
                tags: ['Messages'],
                summary: 'Get all messages in a conversation',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'conversationId', in: 'path', required: true, schema: { type: 'string' }, example: '6a321a370c5232eec914550a' }],
                responses: { 200: { description: 'Messages retrieved successfully' } },
            },
        },
    },
};

module.exports = swaggerSpec;
