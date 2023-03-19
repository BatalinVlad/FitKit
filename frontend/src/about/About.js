import React from 'react';
import { AiOutlineLinkedin } from 'react-icons/ai';
import { SiGmail } from 'react-icons/si';
import { TfiInstagram } from 'react-icons/tfi';

import './About.css'

const About = () => {
    return (
        <React.Fragment>
            <div className='about-page-container'>
                <div className='about-title flex column text-center'>
                    <h1> HEY, I'M VLAD </h1>
                    <p>A Fitness trainer and a FullStack programer.</p>
                </div>
                <div className='about-container flex fill justify-center'>
                    <div className='about-trainer flex column text-center align-center space-between'>
                        <p>2 years ago i stated to train... bla bla bla</p>
                        <div className='about-trainer-image'>
                        </div>
                    </div>
                    <div className='about-programer flex column text-center align-center space-between'>
                        <p>I love code, creating stuff and study new skills... bla bla bla</p>
                        <div className='about-programer-image'>
                        </div>
                    </div>
                </div>
                <div className='about-working-on'>
                </div>
            </div>
            <div className='about-page-footer fill text-center'>
                <h1>CONTACT ME</h1>
                <div className='contact-me-icons'>
                    <AiOutlineLinkedin />
                    <SiGmail />
                    <TfiInstagram />
                </div>
            </div>
        </React.Fragment>
    )
};

export default About;
