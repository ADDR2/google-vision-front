import React from 'react';
import { post } from 'axios';
import Button from '@material-ui/core/Button';
import './App.scss';

class App extends React.Component {
	constructor() {
		super();

		this.imgInputRef = React.createRef();
		this.reader = new FileReader();

		this.reader.onload = (...params) => {
			this.setState({ preview: [this.reader.result] });
		};

		this.state = {
			preview: null,
			loadedFileName: '',
			jsonParsed: ''
		};
	}

	previewImage = ({ target: { files: [ file ] } }) => {
		const newState = {};
		if (file.size < 200000) this.reader.readAsDataURL(file);
		else {
			console.warn('Too large image');
			newState.preview = null;
		}

		this.setState({
			...newState,
			loadedFileName: file.name
		});
	}

	sendImage = async () => {
		try {
			this.setState({ jsonParsed: '' });
			const { data: { body } } = await post(
				'http://localhost:3001',
				this.imgInputRef.current.files[0],
				{
					headers: {
						'content-type': 'text/plain'
					}
				}
			);
			this.setState({ jsonParsed: JSON.stringify(body, undefined, 2) });
		} catch(error) {
			console.error('Could not send image');
		}
	}

	render() {
		const { preview, loadedFileName, jsonParsed } = this.state;
		return (
			<div className={ preview ? 'App' : 'App no-image' }>
				{ preview ? <img src={preview}/> : <></>}
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
				{ jsonParsed ? <textarea className="json-parsed" defaultValue={jsonParsed}/> : <></> }
			</div>
		);
	}
}

export default App;
