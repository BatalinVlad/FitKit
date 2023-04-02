
const { Configuration, OpenAIApi } = require('openai');
const HttpError = require('../models/http-error');

const createPlans = async (req, res, next) => {
    const configuration = new Configuration({
        organization: "org-5CmzXvC0ycf9nzumxecn9JL6",
        apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    try {
        const completion = await openai.createCompletion({
            model: "gpt-4",
            messeges: [
                { role: "user", content: "hello world" },
            ]
        });
        console.log(completion.data.choices[0].messege);
        // res.status(200).json({
        //     plan: response.data.choices[0].text
        // });
    } catch (err) {
        const error = new HttpError('Something went wrong... try again later', 500);
        return next(error);
    }
}


exports.createPlans = createPlans;
