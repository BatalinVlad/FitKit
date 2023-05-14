import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Reviews from '../reviews/pages/Reviews';
import AddReview from '../user/pages/AddReview'
import Button from '../shared/components/FormElements/Button';

import { AuthContext } from '../shared/context/auth-context';
import Footer from '../shared/components/UIElements/footer';

const About = ({ socket }) => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [openAddReviewModal, setOpenAddReviewModal] = useState(false);

    const getStarted = () => {
        history.push('/mydietplan')
    }
    const addReviewModalHandler = () => {
        setOpenAddReviewModal(!openAddReviewModal);
    }
    return (
        <React.Fragment>
            <div className='about-page'>
                <MainNavigation />
                <div className='about-page-about-container flex column justify-end align-center'>
                    <div className='about-title flex column text-center'>
                        <h1>FIT<span>KIT</span></h1>
                        <h2 className='bold'>THE FITNESS KIT <br /> THAT EVERY COACH NEEDS</h2>
                    </div>
                    <Button type="button" getStarted onClick={getStarted}>TRY IT NOW</Button>
                </div>
                <div className='about-page-services-container flex column center'>
                    <div className='service-container workout flex row-rev justify-center'>
                        <div className='flex grow1 column align-center'>
                            <h2 className='uppercase'>create<br />workout plans</h2>
                            <p>description about creating workout plans</p>
                        </div>
                        <div className='service-img grow1 workout-plan'>
                        </div>
                    </div>

                    <div className='service-container diet flex justify-center'>
                        <div className='flex grow1 column align-center'>
                            <h2 className='uppercase'>create<br />diet plans</h2>
                            <p>description about creating diet plans</p>
                        </div>
                        <div className='service-img grow1 diet-plan'>
                        </div>
                    </div>

                    <div className='service-container share flex row-rev justify-center'>
                        <div className='flex grow1 column align-center'>
                            <h2 className='uppercase'>share<br />with your clients</h2>
                            <p>description about shering with your clients</p>
                        </div>
                        <div className='service-img grow1 share-plan'>
                        </div>
                    </div>
                </div>
                <div className='about-page-reviews flex column justify-center'>
                    {openAddReviewModal ?
                        <AddReview onAddReviewModalHandler={addReviewModalHandler} /> : <div className='flex column'>
                            <h2 className='uppercase text-center fs40 bold'>people rate us</h2>
                            <Reviews socket={socket} />
                            <div className="center">
                                <Button type="button" action onClick={addReviewModalHandler}>ADD REVIEW</Button>
                                <div className="ml10">
                                    <Button type="to" href="/reviews" regularAction >ALL REVIEWS</Button>
                                </div>
                                <div className="ml10">
                                    {auth.isLoggedIn &&
                                        < Button type="to" href={`${auth.userId}/reviews`} regularAction >MY REVIEWS</Button>}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <Footer />
            </div>
        </React.Fragment >
    )
};

export default About;
