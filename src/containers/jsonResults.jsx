import React from 'react';
import ReactJson from 'react-json-view';
import '../styles/containers/jsonResult.scss';

const defaultProperties = {
    theme: "monokai",
    iconStyle: "square",
    collapseStringsAfterLength: 10,
    indentWidth: 5,
    style: {
        minHeight: '50vh',
        minWidth: '500px',
        maxWidth: '500px',
        maxHeight: '50vh',
        overflow: 'auto'
    },
    enableClipboard: false,
    displayDataTypes: true,
    displayObjectSize: true,
    collapsed: true
};

export default ({ json }) => {
    return <div className="json-result-container">
    {
        Array(3).fill().map((_, index) => (
            <div key={`json-${index}`} className="json-result">
                <ReactJson
                    src={json}
                    { ...defaultProperties }
                />
            </div>
        ))
    }
    </div>
};