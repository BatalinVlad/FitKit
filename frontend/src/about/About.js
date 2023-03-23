import React from 'react';
import { useHistory } from 'react-router-dom';

import MainNavigation from '../shared/components/Navigation/MainNavigation';
import Reviews from '../reviews/pages/Reviews'
import Button from '../shared/components/FormElements/Button'
import { TfiLinkedin } from 'react-icons/tfi';
import { SiGmail } from 'react-icons/si';
import { TfiInstagram } from 'react-icons/tfi';

const About = ({ socket }) => {
    const history = useHistory();
    const getStarted = () => {
        history.push('/mydietplan')
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
                    <Button type="button" getStarted={true} onClick={getStarted}>TRY IT NOW</Button>
                    <div className='between-about-services'></div>
                </div>
                <div className='about-page-services-container flex column center'>
                    <div className='service-container workout flex row-rev fill-width   justify-center'>
                        <div className='flex column align-center'>
                            <h2 className='uppercase'>create<br />workout plans</h2>
                            <p>description about creating workout plans</p>
                        </div>
                        <div className='service-img workout-plan'>
                        </div>
                    </div>

                    <div className='service-container diet flex fill-width  justify-center'>
                        <div className='flex column align-center'>
                            <h2 className='uppercase'>create<br />diet plans</h2>
                            <p>description about creating diet plans</p>
                        </div>
                        <div className='service-img diet-plan'>
                        </div>
                    </div>

                    <div className='service-container share flex row-rev fill-width justify-center'>
                        <div className='flex column align-center'>
                            <h2 className='uppercase'>share<br />with your clients</h2>
                            <p>description about shering with your clients</p>
                        </div>
                        <div className='service-img share-plan'>
                        </div>
                    </div>
                </div>
                <div className='about-page-reviews flex column justify-center'>
                    <h2 className='to uppercase text-center fs40 bold'>people rate us</h2>
                    <Reviews socket={socket} />
                    <div className='text-center'>
                        <Button type="to" to='/addReview' regularAction={true} >ADD REVIEW</Button>
                    </div>
                </div>
                <div className='about-page-footer fill-width flex space-between'>
                    <div className='contact-me flex column'>
                        <p className='uppercase'>contact me</p>
                        <div className='contact-me-icons flex'>
                            <div className='icon flex align-end pointer'>
                                <TfiLinkedin className='icon-linkedin' />
                                <p>Linkedin</p>
                            </div>
                            <div className='icon flex align-end pointer'>
                                <SiGmail className='icon-gmail' />
                                <p>Mail</p>
                            </div>
                            <div className='icon flex align-end pointer'>
                                <TfiInstagram className='icon-insta' />
                                <p>Instagram</p>
                            </div>
                        </div>
                    </div>
                    <div className='about-container flex column'>
                        <p className='about-container-title flex uppercase'>who am I?</p>
                        <div className='about-container-professions flex'>
                            <div className='about-trainer flex text-center align-center row-rev'>
                                <p>Fitness Trainer</p>
                                <div className='about-trainer-image'>
                                </div>
                            </div>
                            <div className='about-programmer flex text-center align-center row-rev'>
                                <p>FullStack Programmer</p>
                                <div className='about-programmer-image'>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default About;
