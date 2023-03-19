import React, { useContext, useEffect, useState } from 'react';
// import { useParams, useHistory } from 'react-router-dom';

// import Input from '../../shared/components/FormElements/Input';
// import Button from '../../shared/components/FormElements/Button';
// import Card from '../../shared/components/UIElements/Card';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';

// import {
//   VALIDATOR_MINLENGTH
// } from '../../shared/util/validators';

// import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
// import { AuthContext } from '../../shared/context/auth-context';

import './DietGenerator.css';

const DietGenerator = () => {
    //   const history = useHistory();
    //   const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
      const [dietPlan, setDietPlan] = useState();
    //   const reviewId = useParams().reviewId;

    const [formState, inputHandler, setFormData] = useForm(
        {
            name: {
                value: '',
                isValid: false
            }
        },
        false
    );

    //fetch my currrent DIET PLAN
    // useEffect(() => {
    //     const fetchDietPlan = async () => {
    //         try {
    //             const responseData = await sendRequest(``);
    //             setDietPlan(responseData);

    // setFormData(
    //   {
    //     stars: {
    //       value: responseData.review.stars,
    //       isValid: true
    //     },
    //     description: {
    //       value: responseData.review.description,
    //       isValid: true
    //     }
    //   },
    //   true
    // );

    //         } catch (err) { };
    //     };
    //     fetchReview();
    // }, [sendRequest]);

    const DietPlanSubmit = async event => {
        event.preventDefault();
        try {
            //sent promt
            await sendRequest(``, 'PATCH',
                JSON.stringify({
                    stars: formState.inputs.stars.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
        } catch (err) { };
    };


    // diet plan is loading 
    //   if (isLoading) {
    //     return (
    //       <div className="center">
    //         <LoadingSpinner />
    //       </div>
    //     );
    //   }


    // not Diet plan set yet
    //   if (!loadedReview && !error) {
    //     return (
    //       <div className="center">

    //       </div>
    //     );
    //   }


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedReview && <form className="review-form" onSubmit={reviewUpdateSubmitHandler}>
                <Input
                    id="name"
                    element="text"
                    label="Your Name"
                    validators={[VALIDATOR_MINLENGTH(1)]}
                    errorText="Please enter your name."
                    onInput={inputHandler}
                    initialValue={''}
                    initialValid={false}
                />
                <Button type="submit" action={true} disabled={!formState.isValid}>
                    GET YOUR DIET PLAN
                </Button>
            </form>}
        </React.Fragment>
    );
};

export default DietGenerator;
