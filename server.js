const express = require("express");
const workflowRouter = require("./routes/workflow"); 
const app = express();
const PORT = 3000;

app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
});

// Mounting the router
app.use("/api/workflow", workflowRouter);

app.get("/", (req, res) => {
    res.send("<h1>Assignment Workflow API is running</h1>");
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});