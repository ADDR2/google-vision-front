import React from 'react';
import ReactJson from 'react-json-view';
import '../styles/containers/jsonResult.scss';

const defaultProperties = {
    theme: "monokai",
    iconStyle: "square",
    collapseStringsAfterLength: 5,
    indentWidth: 10,
    style: {
        textAlign: 'left',
        minHeight: '50vh',
        maxWidth: '500px',
        maxHeight: '50vh',
        overflow: 'auto'
    },
    enableClipboard: true,
    displayDataTypes: true,
    displayObjectSize: true,
    collapsed: true
};

export default ({ json }) => {
    return <div className="json-result-container">
    {
        Array(3).fill(
            <ReactJson
                src={json}
                { ...defaultProperties }
            />
        )
    }
    </div>
};