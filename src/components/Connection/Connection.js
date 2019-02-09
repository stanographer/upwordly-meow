import React from 'react';
import ShareDB from '@teamwork/sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import otText from 'ot-text';
import { Alert, Container, Card, CardFooter, Button } from 'reactstrap';
import Preview from './Preview';

const { ipcRenderer, shell } = window.require('electron');

const socket = new ReconnectingWebSocket('wss://upword.ly/ws', [], {
  automaticOpen: true,
  maxReconnectionDelay: 2000,
  reconnectInterval: 2000,
  maxReconnectInterval: 3000,
  timeoutInterval: 2000,
  maxRetries: Infinity
});

const connection = new ShareDB.Connection(socket);
ShareDB.types.register(otText.type);

const Connection = (props) => {
  const doc = connection.get(props.username, props.job);
  console.log(doc);
  return (
    <div>
      {
        !props.error
          ? <Container className="mt-4">
            <header className="header-centered">
              <h4>Connected</h4>
              <small>Success! You can now begin writing!</small>
            </header>
            <Card className="mt-4 bg-primary" body>
              Connected to: <a href="#"
                               onClick={ () => shell.openExternal(`https://upword.ly/${ props.username }/${ props.job }`) }>
              { `https://upword.ly/${ props.username }/${ props.job }` }
            </a>
            </Card>
            <Card className="mt-4">
              <Preview doc={ doc }
                       error={ props.error }
                       handleError={ props.handleError }/>
              <CardFooter>
                <strong>Transcription Preview</strong>
              </CardFooter>
            </Card>
            <div className="text-center">
              <Button className="mt-5"
                      type="button"
                      color="danger"
                      onClick={ () => props.end() }>Disconnect</Button>
            </div>
          </Container>

          : <Container className="mt-4">
            <header className="header-centered">
              <h4>Connection Error</h4>
              <small>Failed to connect to Upwordly.</small>
            </header>
            <Alert color="warning" className="mt-5">
              <h4 className="alert-heading">Uh-oh!</h4>
              This doesn't appear to be a valid Upwordly job or it hasn't been created yet. Make sure you create the job on the web platform first.
            </Alert>
            <div className="text-center">
              <Button className="mt-5"
                      type="button"
                      color="danger"
                      onClick={ () => props.end() }>Go Back</Button>
            </div>
          </Container>
      }
    </div>
  );
};

export default Connection;
