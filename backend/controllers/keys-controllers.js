const ApiKey = require('../models/api-key');

const getApiKey = async (req, res, next) => {
    let openAiKey;
    try {
        openAiKey = await ApiKey.findOne({ name: 'openai_api_key' });
    } catch (err) {
        const error = new HttpError('fetching keys failed, please try again later', 500)
        return next(error);
    }
    res.json({ openAiKey: openAiKey.key })
};

exports.getApiKey = getApiKey;



// const cors = require('cors')({ origin: ['https://reviewsapp-bv.web.app', 'http://localhost:3000'] });
// const functions = require('firebase-functions');
// const { Configuration, OpenAIApi } = require('openai');
// const HttpError = require('../models/http-error');

// const createPlans = functions.https.onRequest((req, res) => {
//     cors(req, res, async () => {
//         const configuration = new Configuration({
//             organization: process.env.ORGANIZATION,
//             apiKey: process.env.OPENAI_API_KEY,
//         });
//         const openai = new OpenAIApi(configuration);
//         try {
//             const { message } = req.body;
//             const completion = await openai.createCompletion({
//                 model: "text-davinci-003",
//                 prompt: message,
//                 max_tokens: 1000,
//                 temperature: 0
//             });
//             res.json({ completion: completion.data.choices[0].text });
//         } catch (err) {
//             const error = new HttpError('something went wrong, try again later', 500)
//             return next(error);
//         }
//     })
// });


// exports.createPlans = createPlans;


