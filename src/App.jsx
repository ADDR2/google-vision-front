import React from 'react';
import { post } from 'axios';
import Button from '@material-ui/core/Button';
import JsonResult from './containers/jsonResults';
import Images from './containers/images';
import dataURLToBlob from './helpers/dataURLToBlob';
import './App.scss';

class App extends React.Component {
	constructor() {
		super();

		this.imgInputRef = React.createRef();
		this.reader = new FileReader();

		this.reader.onload = () => {
			const image = new Image();

			image.onload = () => {
				const canvas = document.createElement('canvas');
				const max_size = 500;
				let width = image.width;
				let height = image.height;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
				}
				
                canvas.width = width;
				canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
				const dataUrl = canvas.toDataURL('image/jpeg');
				const resizedImage = dataURLToBlob(dataUrl);

				this.setState({ preview: [dataUrl], file: resizedImage });
			};

			image.src = this.reader.result;
		};

		this.state = {
			preview: null,
			loadedFileName: '',
			json: null,
			Moderation: null,
			Faces: null,
			file: null
		};
	}

	previewImage = ({ target: { files: [ file ] } }) => {
		const newState = {};
		if (file.size < 500000) this.reader.readAsDataURL(file);
		else {
			console.warn('Too large image');
			newState.preview = null;
		}

		this.setState({
			...newState,
			loadedFileName: file.name,
			Faces: null
		});
	}

	sendImage = async () => {
		try {
			this.setState({ json: null, Moderation: null, Faces: null });
			const { data: { body: { JsonResults, Moderation, Faces } } } = await post(
				'http://localhost:3001/analyze-image',
				this.state.file,
				{
					headers: {
						'content-type': 'text/plain'
					}
				}
			);
			this.setState({ json: JsonResults, Moderation, Faces });
		} catch(error) {
			console.error('Could not send image');
		}
	}

	render() {
		const { preview, loadedFileName, json, Faces } = this.state;

		return (
			<div className={ preview ? 'App' : 'App no-image' }>
				{ preview ?
						<div className="image-container">
							<Images preview={preview} faces={Faces}/>
						</div>
					:
						<></>
				}
				{ loadedFileName ? <p className="file-name">{loadedFileName}</p> : <></> }
				<div className="buttons-container">
					<input
						className="input-file"
						type="file"
						id="pic"
						accept="image/jpg"
						ref={this.imgInputRef}
						onChange={this.previewImage}
					></input>
					<label htmlFor="pic"><strong>Choose a file</strong></label>
					<Button
						variant="contained"
						color="primary"
						onClick={this.sendImage}
					>Try</Button>
				</div>
				{ json ? <JsonResult json={json} /> : <></> }
			</div>
		);
	}
}

export default App;
