const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

const jwt_secret = "SeCr3t";
const PORT = process.env.PORT || 3000;

mongoose
  .connect('mongodb+srv://mantissa6789:Mantis%402510@cluster0.9ramotn.mongodb.net/cat-app-chat')
  .then(() => console.log("MongoDB connected..."))
  .catch(() => console.log("Couldn't connect to MongoDB..."));

// Define the schema and model
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isOnline : {type : Boolean, default : false},
    socketId : String
});

const messageSchema = new mongoose.Schema({
    sender : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    receiver : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    content: {type : String, required : true},
    timeStamp : {type : Date, default : Date.now},
    groupId : {type : mongoose.Schema.Types.ObjectId, ref : 'Group'}
});

const groupSchema = new mongoose.Schema({
    name : String,
    members : [{type: mongoose.Schema.Types.ObjectId, ref : 'User'}],
    createdAt : {type : Date, default : Date.now},
})

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema)
const Group = mongoose.model('Group', groupSchema);
// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied." });

    try {
        const verified = jwt.verify(token, jwt_secret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token invalid" });
    }
};

// Signup route
app.post('/signup', async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, jwt_secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password); 
        if (!validPassword) {
            return res.status(400).json({ message: "Password Incorrect" });
        }

        const token = jwt.sign({ _id: user._id }, jwt_secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/logout', authMiddleware, async(req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message : 'User not found'});
        }

        user.isOnline = false;
        await user.save();

        res.json({message : 'User logged out successfully'});
    } catch (error) {
        res.status(400).json({message : error.message});
    }
});

//create a group
app.post('/group', authMiddleware, async (req, res) => {
    try {
        const {name} = req.body;

        const group = new Group({name});
        await group.save();

        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({message : error.message});
    }
});

//add member to a group
app.post('/group/:groupId/members', authMiddleware, async(req, res) => {
    try {
        const {groupId} = req.params;
        const {userId} = req.body;

        const group = await Group.findOne(groupId);

        if(!group){
            return res.status(404).json({message : 'Group not found'});
        }

        if(!group.members.includes(userId)){
            group.members.push(userId);
            await group.save();
            res.json(group);
        }else{
            res.status(400).json({message : 'User is already a member of this group'});
        }
    } catch (error) {
        res.status(400).json({message : error.message});
    }
});

app.post('/messages', authMiddleware, async(req, res) => {
    try{
        const {sender, receiver, content} = req.body;
        const message = new Message({
            sender, receiver, content, timestamp : new Date()
        });

        await message.save();
        io.to(receiver.toString()).emit('message', message);
        res.status(201).json(message);
    }catch(error){
        res.status(400).json({message : error.message});
    }
});

//get message from two users
app.get('/messages/:userId1/:userId2', authMiddleware, async(req, res) => {
    try {
        const {userId1, userId2} = req.params;

        const messages = await Message.find({
            $or:[
                {sender : userId1, receiver : userId2},
                {sender : userId2, receiver : userId1},
            ]
        }).populate('sender receiver', 'username');

        res.json(messages);
    } catch (error) {
        res.status(400).json({message : error.message});
    }
});

//send message to a group
app.post('/groups/:groupId/messages',authMiddleware, async(req, res) => {
    try {
        const {groupId} = req.params;
        const {sender, content} = req.body;

        const message = new Message({
            sender,
            content,
            groupId,
        });

        await message.save();

        io.to(groupId).emit('groupMessage', message);

        res.status(201).json({message});
    } catch (error) {
        res.status(400).json({message : error.message});
    }
});

//get messages from a group
app.get('/groups/:groupId/messages', authMiddleware, async(req, res) => {
    try {
        const {groupId} = req.params;

        const messages = Message.find({ groupId
        }).populate('sender', 'username');

        res.json(messages);
    } catch (error) {
        res.status(400).json({message : error.message});
    }
})

app.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).json({message : 'NO file uploaded'});
    }

    res.json({ fileUrl : `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`});
});

//websocket connection
io.on('connection', (socket) => {
    console.log(' A user connected');

    socket.on('join', async(userId) => {
        let user = await User.findOne(userId);
        if(user){
            user.socketId = socket.is;
            user.isOnline = true;
            await user.save();
        }

        socket.join(userId);

        io.emit('userStatusUpdate', user);

        console.log(`User ${user.fullName} joined with ID ${user.socketId}`);
    });

    socket.on('offer', (data) => {
        io.to(data.target).emit('offer', data);
    });

    socket.on('answer', (data) => {
        io.to(data.target).emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        io.to(data.target).emit('ice-candidate', data);
    });

    socket.on('disconnect', async() => {
        console.log('A user disconnected');

        let disconnectedUser = await User.findOneAndUpdate(
            {socketId : socket.Id},
            {$set:{isOnline : false}},
            {new:true},
        );

        if(disconnectedUser){
            io.emit('userStatusUPdate', disconnectedUser);
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
