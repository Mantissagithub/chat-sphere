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
    socketId : String,
    friends : [{type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
    groups : [{type : mongoose.Schema.Types.ObjectId, ref : 'Group'}],
});

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function() { return !this.groupId; } },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: function() { return !this.receiver; } },
    content: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now }
});

const groupSchema = new mongoose.Schema({
    name : String,
    members : [{type: mongoose.Schema.Types.ObjectId, ref : 'User'}],
    createdAt : {type : Date, default : Date.now},
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema)
const Group = mongoose.model('Group', groupSchema);
// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token invalid" });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: "Access Denied." });
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

//logout route
app.post('/logout', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.isOnline = false;
        user.socketId = null;
        await user.save();

        
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);  
        res.status(500).json({ message: 'Server error' });
    }
});

//create a group
app.post('/group', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id; 
        
        const group = new Group({ name, members: [userId] }); 
        await group.save();
        
        
        const user = await User.findById(userId);
        user.groups.push(group._id);
        await user.save();
        
        res.status(201).json(group);
    } catch (error) {
        console.error('Error saving group:', error);
        res.status(400).json({ message: error.message });
    }
});

//retrieve all users
app.get('/users', authMiddleware, async (req, res) => {
    try {
        const query = req.query.query || ''; 
        const users = await User.find({ 
            fullName: { $regex: query, $options: 'i' } 
        }).select('fullName _id'); 

        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

//retrieve all groups users is in
app.get('/userGroups', authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).populate('groups', 'name');
        const groupNames = currentUser.groups.map(group => ({
            name: group.name,
            id: group._id
        }));
        res.json(groupNames);
    } catch (error) {
        console.error('Error retrieving user groups:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

//search for groups / user to add frined or group
app.post('/search/user', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;  

        const friendUser = await User.findById(userId); 
        if (!friendUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        const currentUser = await User.findById(req.user._id);
        if (currentUser.friends.includes(friendUser._id)) {
            return res.status(400).json({ message: 'User is already your friend' });
        }

        currentUser.friends.push(friendUser._id);
        friendUser.friends.push(currentUser._id);

        await currentUser.save();
        await friendUser.save();

        res.status(200).json({ message: `${friendUser.fullName} added as a friend successfully` });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});


app.post('/search/group', authMiddleware, async(req, res) => {
    try {
        const {groupName} = req.body;

        const group = await Group.findOne({name : groupName});
        if(!group){
            return res.status(400).json({message : 'Group not found'});
        }

        const currentUser = await User.findById(req.user._id);
        if(currentUser.groups.includes(group._id)){
            return res.status(400).json({message : 'You are already into the group'});
        }

        currentUser.groups.push(group._id);
        group.members.push(currentUser._id);

        await currentUser.save();
        await group.save();

        return res.status(200).json({message : `You are successfully added to the group ${group.name}`})
    } catch (error) {
        console.error('Error adding you to the group:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// //add member to a group
// app.post('/group/:groupId/members', authMiddleware, async(req, res) => {
//     try {
//         const {groupId} = req.params;
//         const {userId} = req.body;

//         const group = await Group.findOne(groupId);

//         if(!group){
//             return res.status(404).json({message : 'Group not found'});
//         }

//         if(!group.members.includes(userId)){
//             group.members.push(userId);
//             await group.save();
//             res.json(group);
//         }else{
//             res.status(400).json({message : 'User is already a member of this group'});
//         }
//     } catch (error) {
//         res.status(400).json({message : error.message});
//     }
// });

app.post('/messages', authMiddleware, async(req, res) => {
    try{
        const {receiver, content} = req.body;
        const user = req.user._id;
        const message = new Message({
            user, receiver, content, timestamp : new Date()
        });

        await message.save();
        io.to(receiver.toString()).emit('message', message);
        res.status(201).json(message);
    }catch(error){
        res.status(400).json({message : error.message});
    }
});

//get message from two users
app.get('/messages/:userId', authMiddleware, async(req, res) => {
    try {
        const {userId} = req.params;
        const user = req.user._id;

        const messages = await Message.find({
            $or:[
                {sender : user, receiver : userId},
                {sender : userId, receiver : user},
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
        const {content} = req.body;

        const user = req.user._id;

        const message = new Message({
            user,
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
app.get('/groups/:groupId/messages', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;

        const messages = await Message.find({ groupId })
            .populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// app.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
//     if(!req.file){
//         return res.status(400).json({message : 'NO file uploaded'});
//     }

//     res.json({ fileUrl : `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`});
// });

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
