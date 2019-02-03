import React from 'react';
import {
  Container,
  Card,
  CardText,
  CardTitle, Button
} from 'reactstrap';
import '../App.css';

const Drivers = (props) => {
  return (
    <Container className="mt-4">
      <h4 className="text-center">Set Up CAT Software</h4>
      <Card className="bg-primary mt-3" body>
        <CardTitle>
          <strong>Step 3</strong>
        </CardTitle>
        <CardText>
          After setting up the ports, you should now see two ports on the left-hand side that say "Virtual Ports."
          The <em>sending</em> port is the one on top (usually a lower number) and the <em>receiving</em> port is on
          the bottom (higher number).
        </CardText>
      </Card>
      <Card className="bg-primary" body>
        <CardTitle>
          <strong>Step 4</strong>
        </CardTitle>
        <CardText>
          Go to your CAT software and create a realtime output stream to the <em>sending</em> port. The encoding mode
          should be set to <strong>"ANSI."</strong> Consult your CAT software if you're having any issues.
        </CardText>
      </Card>
      <Card className="bg-primary" body>
        <Button color="success"
                size="lg"
                onClick={ () => props.ipcRenderer.send('set', 'CATSetup', true) }>
          Move On
        </Button>
      </Card>
    </Container>
  );
};

export default Drivers;
