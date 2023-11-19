import { Component } from "react";
import { loadSlim } from 'tsparticles-slim';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-tsparticles';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import particlesOptions from './components/ParticlesOptions/ParticlesOptions';
import './App.css';
import 'tachyons';

const PAT = 'c64b2fbdf8c04145a0398c1aecd9a185';
const USER_ID = 'lidhill';

const APP_ID = 'my-first-application';

// Change these to whatever model and image URL you want to use

const MODEL_ID = 'face-detection';

const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

const raw = JSON.stringify({

  "user_app_id": {

    "user_id": USER_ID,

    "app_id": APP_ID

  },

  "inputs": [

    {

      "data": {

        "image": {

          "url": IMAGE_URL

        }

      }

    }

  ]

});

const requestOptions = {

  method: 'POST',

  headers: {

    'Accept': 'application/json',

    'Authorization': 'Key ' + PAT

  },

  body: raw

};


class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      IMAGE_URL: '',
      box: {},
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
  
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ IMAGE_URL: this.state.input }, () => {
      fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(error => console.log('error', error));
    });
  }
  


  particlesInit = async (engine) => {
    console.log(engine);
    await loadSlim(engine);
  };

  particlesLoaded = async (container) => {
    await console.log(container);
  };


  render() {
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} IMAGE_URL={this.state.IMAGE_URL} />
      </div>
    );
  }
}
export default App;




