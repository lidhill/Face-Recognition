import { Component } from "react";
import { loadSlim } from 'tsparticles-slim';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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

const IMAGE_URL = 'https://www.ripponmedicalservices.co.uk/images/easyblog_articles/89/b2ap3_thumbnail_ee72093c-3c01-433a-8d25-701cca06c975.jpg';

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

const Raw = (url) => {
  const x = JSON.parse(raw);
  x.inputs[0].data.image.url = url;
  return JSON.stringify(x);
}

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
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
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
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ IMAGE_URL: this.state.input }, () => {
      requestOptions.body = Raw(this.state.IMAGE_URL);
  
      fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(response => {
          this.displayFaceBox(this.calculateFaceLocation(response));
  
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(prevState => ({
                  user: { ...prevState.user, entries: count }
                }));
              })
              .catch(error => console.log('Error updating count:', error));
          }
        })
        .catch(error => console.log('Error fetching from Clarifai:', error));
    });
  }




  particlesInit = async (engine) => {
    console.log(engine);
    await loadSlim(engine);
  };

  particlesLoaded = async (container) => {
    await console.log(container);
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, IMAGE_URL, route, box } = this.state;
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} IMAGE_URL={IMAGE_URL} />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}
export default App;