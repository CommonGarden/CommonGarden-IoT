module.exports = {
  properties: {
    name: 'Grow File example',
    version: '0.1.0',
    
    // todo, register event listeners for these.
    targets: {
      temperature: {
        min: 60,
        max: 80
      },
      ph: {
        min: 5.6,
        max: 6.7
      },
      humidity: {
        min: 10 // percent
      },
    },

    // cycles can be an optionally inside of phases.
    cycles: {
      day: {
        schedule: 'after 7:00am',
        targets: {
          temperature: 24
        }
      },
      night: {
        schedule: 'after 7:00pm',
        targets: {
          temperature: 20
        }
      }
    }
  }
}
