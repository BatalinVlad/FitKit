import React from 'react';
import { TfiLinkedin } from 'react-icons/tfi';
import { SiGmail } from 'react-icons/si';
import { TfiInstagram } from 'react-icons/tfi';

const About = () => {
    return (
        <React.Fragment>
            <div className='about-page'>
                <div className='about-page-about-container flex justify-center align-center'>
                    <div className='about-title flex column text-center fill-half-width'>
                        <h1>FIT<span>KIT</span></h1>
                        <h2 className='bold'>THE FITNESS KIT <br /> THAT EVERY COACH NEEDS</h2>
                        {/* <p className='uppercase'>
                            easy
                        </p>
                        <p className='uppercase'>
                            powerful
                        </p>
                        <p className='uppercase'>
                            fast
                        </p> */}
                        {/* <p>our duty is to help coaches to create custom workout and diet plans for their clients
                            by using AI to generate personalized nutrition plans based on the clients dietary preferences,
                            and offers a variety of workout plans that can be customized to suit the clients fitness level and goals.
                        </p> */}
                    </div>
                </div>
                <div className='about-page-services-container center'>
                    <div className='service-container'>
                        <p className='uppercase'>create<br />workout plans</p>
                        <div className='service-img workout-plan'>
                        </div>
                    </div>

                    <div className='service-container'>
                        <p className='uppercase'>create<br />diet plans</p>
                        <div className='service-img diet-plan'>
                        </div>
                    </div>

                    <div className='service-container'>
                        <p className='uppercase'>share<br />with your clients</p>
                        <div className='service-img share-plan'>
                        </div>
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
