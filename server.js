const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// define express app
const app = express();

// database
const questions = [
	{
		id: 1,
		title: "What is React?",
		description: "I've heard a lot about React. What is it?",
		answers: []
	}
];

//setting PORT #
const PORT = process.env.PORT || 3001;

// enhancing app security with helmet package
app.use(helmet());

// using body parser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan("combined"));

// get all questions
app.use("/", (req, res) => {
	const qs = questions.map(q => ({
		id: q.id,
		title: q.title,
		description: q.description,
		answers: q.answers.length
	}));
	res.send(qs);
});

// get a specific question
app.use("/:id", (req, res) => {
	const question = questions.filter(
		q => q.id === parseInt(req.params.id)
	);
	if (question.length > 1) return res.status(500).send();
	if (questions.length === 0) return res.status(404).send();
	res.send(question[0]);
});

// insert a new question
app.use("/", (req, res) => {
	const { title, description } = req.body;
	const newQuestion = {
		id: questions.length + 1,
		title,
		description,
		answers: []
	};
	questions.push(newQuestion);
	res.status(200).send();
});

// insert a new answer into a question
app.post("answer/:id", (req, res) => {
	const { answer } = req.body;

	const question = questions.filter(
		q => q.id === parseInt(req.params.id)
	);
	if (questions.length > 1) return res.status(500).send();
	if (questions.length === 0) return res.status(404).send();

	question[0].answers.push({
		answer
	});

	res.status(200).send();
});

// starting express server
app.listen(PORT, error => {
	if (error) {
		console.log(error);
	}

	console.log(`API server listening on Port: ${PORT}`);
});
