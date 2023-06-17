
const { Configuration, OpenAIApi } = require('openai');
const HttpError = require('../models/http-error');

const createPlans = async (req, res, next) => {
    console.log('sending ai req');

    // const configuration = new Configuration({
    //     organization: process.env.ORGANIZATION,
    //     apiKey: process.env.OPENAI_API_KEY,
    // });

    // const openai = new OpenAIApi(configuration);
    const { message } = req.body;
    res.json({ completion: message });


    // try {
    //     const completion = await openai.createCompletion({
    //         model: "text-davinci-003",
    //         prompt: message,
    //         max_tokens: 3000,
    //         temperature: 0
    //     });
    //     res.json({ completion: completion.data.choices[0].text });
    // } catch (err) {
    //     const error = new HttpError('something went wrong, try again later', 500)
    //     return next(error);
    // }
};


exports.createPlans = createPlans;

