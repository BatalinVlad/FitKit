
// const { Configuration, OpenAIApi } = require('openai');
// const HttpError = require('../models/http-error');

// const createPlans = ('/cors', async (req, res, next) => {

//     const configuration = new Configuration({
//         organization: process.env.ORGANIZATION,
//         apiKey: process.env.OPENAI_API_KEY,
//     });
//     const openai = new OpenAIApi(configuration);

//     const { message } = req.body;
//     const completion = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: message,
//         max_tokens: 1000,
//         temperature: 0


//     });
//     res.set('Access-Control-Allow-Origin', '*');

//     res.json({
//         completion: completion.data.choices[0].text
//     })
// });


// exports.createPlans = createPlans;



const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const { Configuration, OpenAIApi } = require('openai');
const HttpError = require('../models/http-error');

const createPlans = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const configuration = new Configuration({
            organization: process.env.ORGANIZATION,
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        try {
            const { message } = req.body;
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: message,
                max_tokens: 1000,
                temperature: 0
            });
            res.json({ completion: completion.data.choices[0].text });
        } catch (err) {
            const error = new HttpError('something went wrong, try again later', 500)
            return next(error);
        }
    })
});


exports.createPlans = createPlans;
