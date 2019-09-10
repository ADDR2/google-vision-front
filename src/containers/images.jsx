import React from 'react';
import LandmarkList from '../components/LandmarkList';
import '../styles/containers/images.scss';

import AmazonLogo from '../assets/Amazon-Logo.png';
import AzureLogo from '../assets/Azure-Logo.png';
import GoogleLogo from '../assets/Google-Logo.png';

const defaultStyles = {
    position: 'absolute',
    fill: 'none',
    strokeWidth: 3,
    stroke: '#00ff00'
};

const imagesArray = [
    { class: 'amazon-logo', src: AmazonLogo },
    { class: 'azure-logo', src: AzureLogo },
    { class: 'google-logo', src: GoogleLogo }
];

export default ({ preview, faces, color, index }) => {
    return (
        <div className="canvas">
            <img alt="logo" className="logo" src={imagesArray[index].src}/>
            <img alt="Input" className="image" src={preview}/>
            { faces ?
                    faces.map(({ Box: { Top, Left, Width, Height }, Landmarks }, index) => (
                        <div key={`face-${index}`}>
                            <svg
                                width={Width}
                                height={Height}
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ top: Top, left: Left, ...defaultStyles, stroke: color }}
                            >
                                <rect x="0" y="0" width={Width} height={Height}/>
                            </svg>
                            <LandmarkList Landmarks={Landmarks} color={color}/>
                        </div>
                    ))
                :

                    <></>
            }
        </div>
    );
};