import React from 'react';
import '../styles/containers/images.scss';

const defaultStyles = {
    position: 'absolute',
    fill: 'none',
    strokeWidth: 3,
    stroke: '#00ff00'
};

export default ({ preview, faces }) => {

    return Array(3).fill().map((_, index) => (
        <div className="canvas" key={index}>
            <img alt="Input" className="image" src={preview}/>
            { faces ?
                    faces.map(({ Box: { Top, Left, Width, Height } }, index) => (
                        <svg
                            key={index}
                            width={Width}
                            height={Height}
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ top: Top, left: Left, ...defaultStyles }}
                        >
                            <rect x="0" y="0" width={Width} height={Height}/>
                        </svg>
                    ))
                :

                    <></>
            }
        </div>
    ))
};