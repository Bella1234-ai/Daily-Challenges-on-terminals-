/* -------------------------------------------------------------------------
   FILE: workflow.js
   This file handles the "Business Logic" of our assignments.
   By separating this into a Router, our main server.js stays clean and organized.
   Think of this as a mini-app inside our main app.
   ------------------------------------------------------------------------- */

const express = require("express");
const router = express.Router();

// Mock database for student assignments
let assignments = [
    {
        id: 1,
        title: "Intro to JS",
        completed: true,
        score: 95
    },
    {
        id: 2,
        title: "Express Basics",
        completed: false,
        score: null
    },
    {
        id: 3,
        title: "API Design",
        completed: false,
        score: null
    }
];

// --- API Endpoints for Assignments ---

// 1) Get all assignments
router.get("/", (req, res) => {
    res.json({
        total: assignments.length,
        data: assignments
    });
});

// 2) Get a single assignment by ID
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const assignment = assignments.find(a => a.id === id);

    if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
});

// 3) Update an assignment status
router.patch("/:id/complete", (req, res) => {
    const id = parseInt(req.params.id);
    const assignment = assignments.find(a => a.id === id);

    if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
    }

    assignment.completed = true;
    res.json({ message: "Assignment marked as complete", data: assignment });
});

// 4) Add a new assignment
router.post("/", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const newAssignment = {
        id: assignments.length + 1,
        title: title,
        completed: false,
        score: null
    };

    assignments.push(newAssignment);
    res.status(201).json(newAssignment);
});

module.exports = router;


/* -------------------------------------------------------------------------
   FILE: server.js
   ------------------------------------------------------------------------- */


const workflowRouter = require("./workflow"); // Import the router above
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    next();
});

// Mounting the router
// Every route inside workflow.js will now be prefixed with /api/workflow
app.use("/api/workflow", workflowRouter);

// Root route
app.get("/", (req, res) => {
    res.send("<h1>Assignment Workflow API is running</h1>");
});

// Error handling for 404
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


/* -------------------------------------------------------------------------
   TESTING EXAMPLES (Using Curl or Postman)
   ------------------------------------------------------------------------- 

   1. Get all: 
      GET http://localhost:3000/api/workflow

   2. Get specific:
      GET http://localhost:3000/api/workflow/1

   3. Mark complete:
      PATCH http://localhost:3000/api/workflow/2/complete

   4. Add new:
      POST http://localhost:3000/api/workflow
      Body: { "title": "Advanced React" }

------------------------------------------------------------------------- */