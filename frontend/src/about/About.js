import React, { useState, useContext, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import MainNavigation from '../shared/components/Navigation/MainNavigation';

import Products from '../products/pages/Products';
import Reviews from '../reviews/pages/Reviews';
import AddReview from '../user/pages/AddReview'
import Button from '../shared/components/FormElements/Button';

import { AuthContext } from '../shared/context/auth-context';
import Footer from '../shared/components/UIElements/footer';

const About = ({ socket }) => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [openAddReviewModal, setOpenAddReviewModal] = useState(false);

    const targetRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const currentPosition = window.pageYOffset;
        setScrollPosition(currentPosition);
    };


    const getStarted = () => {
        history.push('/mydietplan')
    }
    const addReviewModalHandler = () => {
        setOpenAddReviewModal(!openAddReviewModal);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <React.Fragment>
            <div ref={targetRef} className={`observed-element fill-width fixed ${scrollPosition > 65 ? 'visible' : ''}`}>
                <MainNavigation />
            </div>
            <div className='about-page'>
                <div className='about-page-about-container flex column space-between'>
                    <div className="about-page-about-container__bg-img"></div>
                    <MainNavigation />


                    <div className="center flex column fill-width">
                        <div className='about-title flex column text-center'>
                            <h1>FIT<span className="span_kit">KIT</span></h1>
                            <h2 className='bold'>THE FITNESS KIT <br /> THAT EVERY COACH NEEDS</h2>
                        </div>
                        <div className="try-now-btn">
                            <Button type="button" getStarted onClick={getStarted}>TRY IT NOW</Button>
                        </div>
                    </div>
                </div>
                <div className='about-page-services-container flex column center'>
                    <div className='service-container workout flex row-rev justify-center'>
                        <div className='service-container__description flex grow1 column text-center'>
                            <h2 className='uppercase'>create<br />diet plans</h2>
                            <p className='text-center fill-width scroll-y'>
                                Revolutionize diet planning with our AI app! Create personalized diet plans with a few clicks. Match clients' goals and needs effortlessly. Say goodbye to manual calculations! Our app delivers optimized nutrition guidance, tailored to individual preferences. Start now and transform your approach to diet planning!
                            </p>
                        </div>
                        <div className='service-img flex grow1 workout-plan'>
                        </div>
                    </div>

                    <div className='service-container diet flex justify-center'>
                        <div className='service-container__description flex grow1 column text-center'>
                            <h2 className='uppercase'>edit<br />your plan</h2>
                            <p className='text-center fill-width scroll-y'>
                                Revamp your diet plan effortlessly with our flexible app. Modify and customize the AI-generated plan with ease. Achieve your goals and meet your needs by making simple edits. Embrace a personalized approach to nutrition without the hassle of rigid templates. Experience the power of AI combined with your input to create a tailored and optimized diet plan.
                            </p>
                        </div>
                        <div className='service-img flex grow1 diet-plan'>
                        </div>
                    </div>

                    <div className='service-container share flex row-rev justify-center'>
                        <div className='service-container__description flex grow1 column align-center'>
                            <h2 className='uppercase'>sell it<br />in one platform</h2>
                            <p className='text-center fill-width scroll-y'>
                                Monetize your diet plans effortlessly with our all-in-one platform. Create, customize, and sell your personalized nutrition programs with ease. Reach a wider audience, set your pricing, and manage transactions seamlessly. Turn your passion for nutrition into a profitable business by joining our platform today.
                            </p>
                        </div>
                        <div className='service-img flex grow1 share-plan'>
                        </div>
                    </div>
                </div>
                <div className='about-page-products'>
                    <h2 className='uppercase text-center fs40 bold'> our diet plans </h2>
                    <Products/>
                </div>
                <div className='about-page-reviews flex column justify-center'>
                    {openAddReviewModal ?
                        <AddReview onAddReviewModalHandler={addReviewModalHandler} /> : <div className='flex column'>
                            <Reviews socket={socket} />
                            <div className="center mt10">
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
