import React from 'react';
import LandmarkList from '../components/LandmarkList';
import '../styles/containers/images.scss';

import AmazonLogo from '../assets/Amazon-Logo.png';
import AzureLogo from '../assets/Azure-Logo.png';
import GoogleLogo from '../assets/Google-Logo.png';

import Spicy from '../assets/Spicy.png';
import Adult from '../assets/Adult.png';

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

class Images extends React.Component {
    constructor() {
        super();

        this.imgRef = React.createRef();

        this.state = {
            divWidth: 600,
            divHeight: 600,
            divMarginLeft: '0'
        };
    }

    adjustDivSize = () => {
        const { width, height } = this.imgRef.current;
        const { clientWidth } = document.querySelector('.image-container');

        this.setState({
            divWidth: width,
            divHeight: height,
            divMarginLeft: `${( (clientWidth/3) - width )/2}px`
        });
    }

    getSecondFrame = () => {
        requestAnimationFrame(this.adjustDivSize);
    }

    getFirstframe = () => {
        requestAnimationFrame(this.getSecondFrame);
    }

    render() {
        const { divWidth, divHeight, divMarginLeft } = this.state;
        const { preview, faces, moderation, color, index } = this.props;

        return (
            <div className="canvas" style={{ width: divWidth, height: divHeight, marginLeft: divMarginLeft }}>
                <img alt="logo" className="logo" src={imagesArray[index].src}/>
                { moderation && moderation.IsAdultContent ?
                        <img alt="Adult" className="adult" src={Adult}/>
                        :
                        <></>  
                }    
                
                { moderation && moderation.IsSpicyContent ?
                        <img alt="Spicy" className="spicy" src={Spicy}/> 
                        :
                        <></>
                }
    
                <img alt="Input" ref={this.imgRef} className="image" src={preview} onLoad={this.getFirstframe}/>
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
    }
}

export default Images;