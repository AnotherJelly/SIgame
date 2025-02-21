const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/SIgame', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB подключена'))
.catch(err => console.error('Ошибка подключения:', err));

/*
const Round = {
    name: "Round 1",
    categories:
    [
        {
            name: "category 1",
            questions:                
            [   
                {
                    type: "test",
                    question: "Question 1",
                    answer: "Answer 1"
                },
                {
                    type: "test",
                    question: "Question 2",
                    answer: "Answer 2"
                },
            ]
        },
        {
            name: "category 2",
            questions:                
            [   
                {
                    type: "test",
                    question: "Question 1",
                    answer: "Answer 1"
                },
                {
                    type: "test",
                    question: "Question 2",
                    answer: "Answer 2"
                },
            ]
        }
    ]
}
*/

const Category = mongoose.model('Category', new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    questions: [
        {
            id: { type: String, required: true },
            questionType: { type: String, required: true },
            text: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ]
}));

app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/categories', async (req, res) => {
    try {

        await Category.deleteMany({});
        const newCategories = await Category.insertMany(req.body);
        res.status(201).json(newCategories);
    } catch (err) {
        console.error("Ошибка при сохранении:", err);
        res.status(400).json({ message: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});