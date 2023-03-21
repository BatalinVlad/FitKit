import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
// import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
// import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MAX,
    VALIDATOR_MIN
} from '../shared/util/validators';
// import { useHttpClient } from '../shared/hooks/http-hook';
import { useForm } from '../shared/hooks/form-hook';
// import { AuthContext } from '../../shared/context/auth-context';

const DietGenerator = () => {
    //   const auth = useContext(AuthContext);
    // const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [myDietPlan, setMydietPlan] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [formState, inputHandler] = useForm(
        {
            name: {
                value: '',
                isValid: false
            },
            age: {
                value: '',
                isValid: false
            },
            height: {
                value: '',
                isValid: false
            },
            weight: {
                value: '',
                isValid: false
            },
        },
        false
    );


    const dietSubmitHandler = async event => {
        event.preventDefault();
        const prompt = `hey my name is: ${formState.inputs.name.value}, 
        i am ${formState.inputs.age.value} years old, 
        my weight is: ${formState.inputs.weight.value},
        my height is: ${formState.inputs.height.value}
        can you write me a simple diet plan,
        for 8 weeks please?
        `;
        const model = "text-davinci-003";
        const temperature = 0.5;
        const maxTokens = 1000;

        // try {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
            },
            body: JSON.stringify({
                prompt: prompt,
                temperature: temperature,
                max_tokens: maxTokens,
            }),
        };
        setIsLoading(true);
        fetch('https://api.openai.com/v1/engines/' + model + '/completions', requestOptions)
            .then(response => response.json())
            .then(data => {
                const textArray = data.choices[0].text.replaceAll('\n', '  ').split("  ");
                setMydietPlan(textArray);
                setIsLoading(false);
            })
            .catch(error => console.error(error));

        // try {
        //     const responseData = await sendRequest(`'https://api.openai.com/v1/engines/' + ${model} + '/completions'`, 'POST',
        //         JSON.stringify({
        //             prompt: prompt,
        //             temperature: temperature,
        //             max_tokens: maxTokens,
        //         }),
        //         {
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY,
        //         });
        //     const generatedText = responseData.data.choices[0].text;
        //     setMydietPlan(generatedText);
        // } catch (err) { };
    };

    return (
        <React.Fragment>
            <div className='diet-generator-page'>
                <MainNavigation />
                <div className="diet-generator__container">
                    <h1>FREE 8 WEEKS DIET PLAN</h1>
                    {isLoading && <LoadingSpinner asOverlay />}

                    {/* <ErrorModal error={error} onClear={clearError} /> */}
                    <form className="flex column" onSubmit={dietSubmitHandler}>
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            onInput={inputHandler}
                        />
                        <Input
                            element="input"
                            id="age"
                            type="number"
                            label="Age (10 - 99)"
                            min="10"
                            max="99"
                            validators={[VALIDATOR_MIN(10), VALIDATOR_MAX(99)]}
                            errorText="Please enter a valid age."
                            onInput={inputHandler}
                        />
                        <Input
                            element="input"
                            id="height"
                            type="number"
                            label="Height (140cm - 210cm)"
                            min="140"
                            max="210"
                            validators={[VALIDATOR_MIN(140), VALIDATOR_MAX(210)]}
                            errorText="Please enter a valid height."
                            onInput={inputHandler}
                        />
                        <Input
                            element="input"
                            id="weight"
                            type="number"
                            label="Weight (30kg - 200kg)"
                            min="30"
                            max="200"
                            validators={[VALIDATOR_MIN(30), VALIDATOR_MAX(200)]}
                            errorText="Please enter a valid weight."
                            onInput={inputHandler}
                        />

                        <div className='get-your-diet-btn fill-width flex justify-center'>
                            <Button type="submit" size={'big'} action={true} disabled={!formState.isValid}>
                                GET YOUR DIET PLAN NOW
                            </Button>
                        </div>
                    </form >
                    {
                        myDietPlan &&
                        <div className="diet-generator__result flex column text-center">
                            <h1>YOUR DIET PLAN</h1>
                            {myDietPlan.map((textRow) => {
                                const unique_id = uuid();
                                const small_id = unique_id.slice(0, 8);
                                return <p key={small_id}>{textRow}</p>
                            })};
                        </div>
                    }
                </div>
            </div>
        </React.Fragment >
    );
};

export default DietGenerator;
