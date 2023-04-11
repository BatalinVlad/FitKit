import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import {
    VALIDATOR_REQUIRE,
} from '../shared/util/validators';
import { useHttpClient } from '../shared/hooks/http-hook';
import { useForm } from '../shared/hooks/form-hook';
// import { AuthContext } from '../../shared/context/auth-context';

const DietGenerator = () => {
    //   const auth = useContext(AuthContext);
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [myDietPlan, setMydietPlan] = useState();
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
        const prompt = `
        i am ${formState.inputs.age.value} years old, 
        my weight is: ${formState.inputs.weight.value},
        my height is: ${formState.inputs.height.value}
        write me a simple diet plan,
        for 2 weeks please?`
        // try {
        //     const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/openai`, 'POST',
        //         JSON.stringify({ //body
        //             message: prompt,
        //         }),
        //         { //headers
        //             'Content-Type': 'application/json'
        //         },
        //         'cors', //mode
        //     );
        //     const generatedText = responseData.completion;
        //     const textArray = generatedText.replaceAll('\n', '  ').split("  ");
        //     setMydietPlan(textArray);
        // } catch (err) { };

        console.log(process.env.EACT_APP_OPENAI_API_KEY)
        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 1000,
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
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
                            <ErrorModal error={error} onClear={clearError} />
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
                                })}
                                {/* {myDietPlan} */}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment >
    );
};

export default DietGenerator;
