import React from 'react';

const defaultStyles = {
    position: 'absolute',
    fill: '#00ff00'
};

export default ({ Landmarks, color }) => {
    return Landmarks.map(({ x, y }, index) => (
        <svg
            key={`landmark-${index}`}
            width="5"
            height="5"
            xmlns="http://www.w3.org/2000/svg"
            style={{ top: y, left: x, ...defaultStyles, fill: color }}
        >
            <circle cx="2.5" cy="2.5" r="2"/>
        </svg>
    ));
};