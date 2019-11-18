// Most of the coments on the server is because i am learning backend development, and all of this is very new to me

// Bring express to be used in our application/API
const express = require("express");

// Define express onto a var
const app = express();

// Importing the connect configuration, this way this server.js looks more clean
const connectDB = require("./config/db");

// Connect to database
connectDB();

// Simple route to test if the API is running fine
app.get("/", (req, res) => res.send("API Running"));

// Define routes
// This is what you use for those separeted files with each route
// First parameter is the route that we want to hit, then the second parameter is the file created for that especific route
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Here is the port, on production you want to have your port in a variable, not in your code like that
const PORT = process.env.PORT || 5000;

// With this command the server starts. It requires a port, and i think it needs a cb also
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
