import { Component} from "react";
import { loadSlim } from 'tsparticles-slim';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-tsparticles';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import particlesOptions from './components/ParticlesOptions/ParticlesOptions';
import Clarifai from 'clarifai';
import './App.css';
import 'tachyons';

const PAT = 'f642c885f3ba4f0bb8e61c2c29d3b52f';
const USER_ID = 'lidhill';       

const APP_ID = 'my-first-application';

// Change these to whatever model and image URL you want to use

const MODEL_ID = 'face-detection';

const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    

const IMAGE_URL = '';

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

const app = new Clarifai.App({
  apiKey: 'YOUR API KEY HERE'
 });

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      IMAGE_URL: ''

    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ IMAGE_URL: this.state.input }, () => {
      fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.text())
        .then(result => console.log(result))
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
        <FaceRecognition IMAGE_URL={this.state.IMAGE_URL}/>
      </div>
    );
  }
}
export default App;




