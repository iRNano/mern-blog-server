const express = require("express")
const app = express()
const PORT = 4000;
const mongoose = require("mongoose")
const cors = require("cors")
app.listen(4000, () => console.log(`Server is running in port ${PORT}`)) //listen to server
mongoose.connect("mongodb://localhost/B49-Blog", { //connect to DB
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let db = mongoose.connection //declare mongoose connection to get access to connection methods
db.once('open', () => console.log("Connected to MongoDB")) //check db open connection

app.use(express.json())
app.use(cors())
app.use("/users", require("./routes/users"))
app.use("/posts", require("./routes/posts"))
