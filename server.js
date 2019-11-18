// Most of the coments on the server is because i am learning backend development, and all of this is very new to me

// Bring express to be used in our application/API
const express = require("express");

// Define express onto a var
const app = express();

// Simple route to test if the API is running fine
app.get("/", (req, res) => res.send("API Running"));

// Here is the port, on production you want to have your port in a variable, not in your code like that
const PORT = process.env.PORT || 5000;

// With this command the server starts. It requires a port, and i think it needs a cb also
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
