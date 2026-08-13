require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const user_routes = require("./routes/user.routes");
const todo_routes = require("./routes/todo.routes");

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB)
.then(()=>{
    console.log("Database Connected")
})
.catch((error)=>{
    console.log(error)
})

app.use("/api/auth", user_routes);
app.use("/api/todo", todo_routes);


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`server running on port ${process.env.PORT}`);
})