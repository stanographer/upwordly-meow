import React from 'react';
import { Button } from 'reactstrap';

const Landing = (props) =>
  <div>
    <div className="App">
      <header className="App-header">
        <h1>Upwordly Meow!</h1>
        <small>Write to Upwordly using your CAT software.</small>
        <Button className="mt-5"
                color="success"
                size="lg"
                onClick={() => props.ipcRenderer.send('set', 'newUser', false)}>
          Get Started!
        </Button>
      </header>
    </div>
  </div>;

export default Landing;
