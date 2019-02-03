import React from 'react';
import {
  Container,
  Card,
  CardText,
  CardTitle, Button
} from 'reactstrap';
import '../App.css';

const installDrivers = (props) => {
  props.ipcRenderer.send('installDrivers');
  props.ipcRenderer.send('set', 'driversInstalled', true);
};

const configPorts = (props) => {
  props.ipcRenderer.send('configPorts');
  props.ipcRenderer.send('set', 'portsConfigured', true);
};

const Drivers = (props) => {
  return (
    <Container className="mt-4">
      <h4 className="text-center">Set Up COM Ports</h4>
      <Card className="mt-2 bg-primary" body>
        <CardTitle>
          <strong>Step 1</strong>
        </CardTitle>
        <CardText>Install COM port drivers by clicking below. A black window should pop up briefly and disappear.</CardText>
          <Button disabled={props.driversInstalled}
                  color="success"
                  size="lg"
                  onClick={ () => installDrivers(props)}>
            Install Drivers
          </Button>
      </Card>
      <Card className="bg-primary" body>
        <CardTitle>
          <strong>Step 2</strong>
        </CardTitle>
        <CardText>Click on the following button to assign a receiving and sending port to two available COM ports on your computer. Once the utility is open, click on "Add Pair" and you should see them pop up on the left-hand side under "Virtual Ports." <em>Keep this window open to help you on the next step.</em></CardText>
        <Button disabled={props.portsConfigured}
          color="success"
          size="lg"
          onClick={ () => configPorts(props) }>
          Add or Configure Ports
        </Button>
      </Card>
    </Container>
  );
};

export default Drivers;
