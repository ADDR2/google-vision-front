import React from 'react';
import LandmarkList from '../components/LandmarkList';
import '../styles/containers/images.scss';

const defaultStyles = {
    position: 'absolute',
    fill: 'none',
    strokeWidth: 3,
    stroke: '#00ff00'
};

export default ({ preview, faces, color }) => {
    return (
        <div className="canvas">
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