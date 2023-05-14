import React from 'react';
import { TfiLinkedin } from 'react-icons/tfi';
import { SiGmail } from 'react-icons/si';
import { TfiInstagram } from 'react-icons/tfi';

const Footer = () => {
    return (
        <div className='about-page-footer fill-width flex space-between'>
            <div className='contact-me flex column'>
                <p className='uppercase bold'>contact me</p>
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
                <p className='about-container-title flex uppercase bold'>who am I?</p>
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
    );
};

export default Footer;
