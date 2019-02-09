import React, { Component } from 'react';
import Titlebar from 'react-electron-titlebar';
import './App.css';
import Landing from './components/Landing';
import Drivers from './components/Drivers';
import Configure from './components/Configure';
import Connection from './components/Connection/Connection';
import ConfigCAT from './components/ConfigCAT';

// Initializes inter-process communication.
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CATSetup: false,
      comPort: 1,
      connected: false,
      driversInstalled: false,
      error: '',
      host: 'upword.ly/ws',
      job: '',
      newUser: true,
      portsConfigured: false,
      url: '',
      username: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleError = this.handleError.bind(this);
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
  }

  componentDidMount() {
    const self = this;

    /* Does initial check against the store to see
     if the user is new, if they've installed the
     drivers and if they've configured the COM ports.
     */

    ipcRenderer.send('get', 'comPort');
    ipcRenderer.send('get', 'driversInstalled');
    ipcRenderer.send('get', 'newUser');
    ipcRenderer.send('get', 'portsConfigured');
    ipcRenderer.send('get', 'job');
    ipcRenderer.send('get', 'url');
    ipcRenderer.send('get', 'username');
    ipcRenderer.send('get', 'CATSetup');

    ipcRenderer.on('success', (event, data) => {
      console.log(data);
      if (Array.isArray(data)) {
        self.setState({
          [data[0]]: data[1]
        });
      }
      console.log(this.state);
    });

    ipcRenderer.on('error', (event, data) => {
      console.log(data);
    });
  }

  componentWillUnmount() {
    // Destroy all listeners.
    ipcRenderer.removeAllListeners('success');
    ipcRenderer.removeAllListeners('error');
    this.end();
  }

  handleChange(event) {
    // If the user types in a URL, parse it into a username and a job slug.
    if (event.target.id === 'url') {
      try {
        let url = event.target.value
          .trim()
          .toLowerCase();
        if (url.includes('//')) url = url.split('//')[1];
        console.log(url);
        this.setState({
          error: '',
          job: url.split('/')[2],
          username: url.split('/')[1]
        });
      } catch (err) {
        this.setState({
          error: 'This is not a valid URL.'
        });
      }
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
    }

    // Set these values as we go so they can be loaded next time.
    ipcRenderer.send('set', event.target.id, event.target.value);
  }

  start() {
    this.setState({
      connected: true
    });

    ipcRenderer.send('connectCom', {
      username: this.state.username,
      job: this.state.job,
      comPort: this.state.comPort
    });
  }

  end() {
    this.setState({
      connected: false,
      error: ''
    });
  }

  handleError(err) {
    this.setState({
      error: err
    });
  }

  render() {
    const {
            CATSetup,
            comPort,
            connected,
            error,
            newUser,
            host,
            username,
            job,
            driversInstalled,
            portsConfigured,
            url
          } = this.state;
    return (
      <>
        <Titlebar title='' key={ 1 } backgroundColor="#1C263A" />
        {
          newUser || newUser === null
            // New user? Shown the get started page.
            ? <Landing ipcRenderer={ ipcRenderer } />
            // After you hit that button, you're no longer new
            // but you still have to set up your stuff.
            : (!portsConfigured || !driversInstalled)
            ? <Drivers ipcRenderer={ ipcRenderer }
                       driversInstalled={ driversInstalled }
                       portsConfigured={ portsConfigured }
            />
            // Finally, take you to the connection page.
            : !CATSetup || CATSetup === null
              ? <ConfigCAT ipcRenderer={ ipcRenderer } CATSetup={ CATSetup } />
              : !connected
                ? <Configure comPort={ comPort || '' }
                             connected={ connected || false }
                             error={ error }
                             host={ host || '' }
                             username={ username || '' }
                             job={ job || '' }
                             handleChange={ this.handleChange }
                             ipcRenderer={ ipcRenderer }
                             start={ this.start }
                             url={ url } />
                : <Connection username={ username || '' }
                              handleError={ error => this.handleError(error) }
                              error={ error }
                              job={ job || '' }
                              end={ this.end } />
        }
      </>
    );
  }
}

export default App;
