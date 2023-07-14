const HttpError = require('../models/http-error');

const createPlans = async (req, res, next) => {

    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const { messages } = req.body;
    let conversation = [];

    try {
        await Promise.all(messages.map(async (message) => {
            conversation.push(message);
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages
            });

            const response = chatCompletion.data.choices[0].message.content;
            conversation.push({ role: 'assistant', content: response });
        }));
        const finalResult = conversation[conversation.length - 1].content;
        res.json({ completion: finalResult});
    }
    catch (err) {
        const error = new HttpError('something went wrong, try again later', 500)
        return next(error);
    }
}
exports.createPlans = createPlans;
