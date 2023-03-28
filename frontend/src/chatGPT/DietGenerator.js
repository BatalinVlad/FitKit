import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
// import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import {
    VALIDATOR_REQUIRE,
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
            }
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
        for 2 weeks please?
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
            <div className='diet-generator-page flex column'>
                <MainNavigation />
                <div className='fill-height center'>
                    {!myDietPlan &&

                        <div className="card diet-generator__container flex column align-center">
                            <h1 className='bold uppercase'>step 1</h1>
                            {isLoading && <LoadingSpinner asOverlay />}
                            {/* <ErrorModal error={error} onClear={clearError} /> */}
                            <form className="flex column" onSubmit={dietSubmitHandler}>
                                <Input
                                    element="input"
                                    id="name"
                                    type="text"
                                    required={true}
                                    label="Name"
                                    placeholder="full name..."
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter a name."
                                    variant='outlined'
                                    onInput={inputHandler}
                                />
                                <div className='flex'>
                                    <Input
                                        element="input"
                                        id="age"
                                        type="number"
                                        label="age"
                                        placeholder="age..."
                                        min="10"
                                        max="99"
                                        validators={[VALIDATOR_REQUIRE]}
                                        errorText="Please enter a valid age."
                                        onInput={inputHandler}
                                    />
                                    <Input
                                        element="input"
                                        id="height"
                                        type="number"
                                        label="Height"
                                        placeholder="160cm..."
                                        min="140"
                                        max="210"
                                        validators={[VALIDATOR_REQUIRE]}
                                        errorText="Please enter a valid height."
                                        onInput={inputHandler}
                                    />
                                    <Input
                                        element="input"
                                        id="weight"
                                        type="number"
                                        label="Weight"
                                        placeholder="70kg..."
                                        min="30"
                                        max="200"
                                        validators={[VALIDATOR_REQUIRE]}
                                        errorText="Please enter a valid weight."
                                        onInput={inputHandler}
                                    />
                                </div>

                                <div className='get-your-diet-btn fill-width flex justify-center'>
                                    <Button type="submit" size={'small'} action={true} disabled={!formState.isValid}>
                                        GET YOUR DIET PLAN NOW
                                    </Button>
                                </div>
                            </form >
                        </div>
                    }
                    {
                        myDietPlan &&
                        <div className="card diet-generator__result flex column">
                            <h1 className='text-center'>YOUR DIET PLAN</h1>
                            <hr></hr>
                            <div className='diet-generator__result_container'>
                                {myDietPlan.map((textRow) => {
                                    const unique_id = uuid();
                                    const small_id = unique_id.slice(0, 8);
                                    return <p key={small_id}>{textRow}</p>
                                })};
                            </div>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment >
    );
};

export default DietGenerator;
