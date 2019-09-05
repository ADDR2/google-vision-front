const BASE64_MARKER = ';base64,';

export default function(dataURL) {
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        const [ first, second ] = dataURL.split(',');
        const contentType = first.split(':')[1];

        return new Blob([ second ], { type: contentType });
    }

    const [ first, second ] = dataURL.split(BASE64_MARKER);
    const contentType = first.split(':')[1];
    const raw = window.atob(second);

    const uInt8Array = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}
