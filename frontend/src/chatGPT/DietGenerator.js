import React, { useState, useContext } from 'react';
// import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../shared/components/UIElements/ErrorModal';

import {
    VALIDATOR_REQUIRE,
} from '../shared/util/validators';
import { useHttpClient } from '../shared/hooks/http-hook';
import { useForm } from '../shared/hooks/form-hook';
import { AuthContext } from '../shared/context/auth-context';

const DietGenerator = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const [myDietPlan, setMydietPlan] = useState();
    const [myDietPlanToSave, setMydietPlanToSave] = useState();

    const [formState, inputHandler] = useForm(
        {
            name: {
                value: '',
                isValid: false
            },
            gender: {
                value: '',
                isValid: true
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
        //best PROMPT yet....:
        const prompt = `
        hey, my name is ${formState.inputs.name.value}, 
        I'm a ${formState.inputs.age.value} years old ${formState.inputs.gender.value} 
        height: ${formState.inputs.height.value} cm,
        weight: ${formState.inputs.weight.value} kg. 
        I lead an active lifestyle and exercise regularly. 
        I follow a reguler diet and have no specific dietary restrictions or allergies. 
        My goal is to lose weight while ensuring I get balanced nutrition. 
        Could you create a personalized diet plan for me based on these details?
        with quantities and calories amount must.
        pretend that you are a expert at field and try to explaine everything,
        in the end write the diet that will look like this:
        breackfest 
        lunch 
        dinner
        `

        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/openai`, 'POST',
                JSON.stringify({ //body
                    message: prompt
                }),
                { //headers
                    'Content-Type': 'application/json',
                }
            );
            const generatedText = responseData.completion;
            setMydietPlanToSave(generatedText)
            const textArray = generatedText.replaceAll('\n', '  ').split("  ");
            setMydietPlan(textArray);
        } catch (err) { };
    };

    const saveDietPlanHandler = async () => {
        if (!auth.isLoggedIn) return
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/dietplan/create/${auth.userId}`, 'POST',
                JSON.stringify({ //body
                    description: myDietPlanToSave
                }),
                { //headers
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                },
            );
        } catch (err) { };
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className='diet-generator-page relative flex column'>
                {isLoading && <LoadingSpinner asOverlay />}
                <MainNavigation />
                <div className='fill-height center'>
                    {!myDietPlan &&
                        <div className="card diet-generator__container relative flex column align-center">
                            <h1 className='bold uppercase'>get your diet</h1>
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
                                <Input
                                    element="checkbox"
                                    id="gender"
                                    type="checkbox"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please select your gender"
                                    onInput={inputHandler}
                                    choices={['male', 'female']}
                                    styles={'flex'}
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
                            </div>
                            <div className='mt10'>
                                <Button type='button' regularAction onClick={() => saveDietPlanHandler()}>SAVE</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment >
    );
};

export default DietGenerator;
