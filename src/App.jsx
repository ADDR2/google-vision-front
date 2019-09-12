import React from 'react';
import { post } from 'axios';
import Button from '@material-ui/core/Button';
import JsonResult from './containers/jsonResults';
import Images from './containers/images';
import dataURLToBlob from './helpers/dataURLToBlob';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.scss';
import Logo from './assets/hexacta.png';

class App extends React.Component {
	colors = [ '#ffff00', '#0000ff', '#ff0000' ];

	constructor() {
		super();

		this.imgInputRef = React.createRef();
		this.reader = new FileReader();

		this.reader.onload = () => {
			const image = new Image();

			image.onload = () => {
				const canvas = document.createElement('canvas');
				const max_size = 600;
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

				this.setState({ preview: [dataUrl], file: { src: resizedImage, width, height } });
			};

			image.src = this.reader.result;
		};

		this.state = {
			preview: null,
			loadedFileName: '',
			jsons: [],
			Moderations: [],
			Faces: [],
			file: {},
			sending: Array(3).fill(false)
		};
	}

	previewImage = ({ target: { files: [ file ] } }) => {
		if (!file) return console.warn('No file selected');

		if (file.size < 1000000) this.reader.readAsDataURL(file);
		else console.warn('Too large image');

		this.setState({
			preview: null,
			file: {},
			loadedFileName: file.name,
			Faces: []
		});
	}

	addDataToState(index, { JsonResults, Moderation, Faces: resultingFaces }) {
		const { jsons, Moderations, Faces, sending } = this.state;
		const newJsons = [ ...jsons ];
		const newModerations = [ ...Moderations ];
		const newFaces = [ ...Faces ];
		const newSending = [ ...sending ];

		newJsons[index] = JsonResults;
		newModerations[index] = Moderation;
		newFaces[index] = resultingFaces;
		newSending[index] = false;

		this.setState({
			jsons: newJsons,
			Moderations: newModerations,
			Faces: newFaces,
			sending: newSending
		});
	}

	addEmptyResultToState(index) {
		const { jsons, Moderations, Faces, sending } = this.state;
		const newJsons = [ ...jsons ];
		const newModerations = [ ...Moderations ];
		const newFaces = [ ...Faces ];
		const newSending = [ ...sending ];

		newJsons[index] = {};
		newModerations[index] = {};
		newFaces[index] = [];
		newSending[index] = false;

		this.setState({
			jsons: newJsons,
			Moderations: newModerations,
			Faces: newFaces,
			sending: newSending
		});
	}

	sendImage = () => {
		try {
			this.setState({ jsons: [], Moderations: [], Faces: [], sending: Array(3).fill(true) });

			const { file } = this.state;
			const queryParams = ('width' in file) ? `?width=${file.width}&height=${file.height}` : '';
			const body = file.src || this.imgInputRef.current.files[0];
			const options = {
				headers: {
					'content-type': 'text/plain'
				}
			};

			post('http://localhost:8080/AWSImageRecognition' + queryParams, body, options)
				.then(({ data }) => this.addDataToState(0, data))
				.catch(error => {
					this.addEmptyResultToState(0);
					console.error('Error from AWS', error);
				})
			;

			post('https://localhost:44302/api/cognitveServices/analyze' + queryParams, body, options)
				.then(({ data }) => this.addDataToState(1, data))
				.catch(error => {
					this.addEmptyResultToState(1);
					console.error('Error from Azure', error);
				})
			;

			post('http://localhost:3001/analyze-image' + queryParams, body, options)
				.then(({ data }) => this.addDataToState(2, data))
				.catch(error => {
					this.addEmptyResultToState(2);
					console.error('Error from Google', error);
				})
			;
		} catch(error) {
			console.error('Could not send image');
		}
	}

	render() {
		const { preview, loadedFileName, jsons, Faces, Moderations, sending } = this.state;

		return (
			<div className={ preview ? 'App' : 'App no-image' }>
				
				<div className="buttons-container">
				<img alt="logo" className="logo-hexacta" src={Logo}/>
					<span className="header-container">
						{ loadedFileName ? <p className="file-name">{loadedFileName}</p> : <></> }
							<input
								className="input-file"
								type="file"
								id="pic"
								accept="image/jpg"
								ref={this.imgInputRef}
								onChange={this.previewImage}
							></input>
							<label htmlFor="pic">Choose a file</label>
							<Button
								variant="contained"
								color="primary"
								onClick={this.sendImage}
							>Try</Button>
					</span>
				</div>

				{ preview ?
						<div className="image-container">
							{
								sending.map((_, index) => (
									<Images
										key={`image-container-${index}`}
										preview={preview}
										faces={Faces[index]}
										moderation = {Moderations[index]}
										color={this.colors[index]}
										index={index}
									/>
								))
							}
						</div>
					:
						<></>
				}
				
				<div className="json-result-container">
				{
					sending.map((isSending, index) => (
						isSending ?
							<CircularProgress
								key={`spinner-${index}`}
								size={80}
								style={{ margin: '5rem 40% 0 40%' }}
							/>
						:
							( jsons[index] ?
								<JsonResult key={`spinner-${index}`} json={jsons[index]}/>
							:
								<div key={`spinner-${index}`}></div>
							)
					))
				}
				</div>
			</div>
		);
	}
}

export default App;
