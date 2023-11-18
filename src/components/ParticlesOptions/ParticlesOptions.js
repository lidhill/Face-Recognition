const particlesOptions = {
  background: {
      color: {
          value: "linear-gradient(89deg, rgb(76, 47, 17) 0%, rgb(179, 198, 117) 100%);",
      },
  },
  fpsLimit: 120,
  interactivity: {

  },
  particles: {
      color: {
          value: "#ffffff",
      },
      links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
      },
      move: {
          direction: "none",
          enable: true,
          outModes: {
              default: "bounce",
          },
          random: false,
          speed: 3,
          straight: false,
      },
      number: {
          density: {
              enable: true,
              area: 800,
          },
          value: 120,
      },
      opacity: {
          value: 0.5,
      },
      shape: {
          type: "circle",
      },
      size: {
          value: { min: 1, max: 1 },
      },
  },
  detectRetina: true,
}

export default particlesOptions;