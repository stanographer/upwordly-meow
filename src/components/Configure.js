import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

class Configure extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byUrl: false
    };

    this.useUrl = this.useUrl.bind(this);
    this.useUsernameAndJob = this.useUsernameAndJob.bind(this);
  }

  useUrl() {
    this.setState({
      byUrl: true
    });
  }

  useUsernameAndJob() {
    this.setState({
      byUrl: false
    });
  }

  resetSettings = () => {
    const { getCurrentWindow } = window.require('electron').remote;
    const { ipcRenderer } = this.props;

    ipcRenderer.send('clearStore', 'bye');
    getCurrentWindow().reload();
  };

  render() {
    const { byUrl } = this.state;
    const {
            comPort,
            connected,
            handleChange,
            job,
            start,
            username,
            url
          } = this.props;

    return (
      <div>
        <Container className="mt-4">
          <header className="header-centered">
            <h4>Connect to Upwordly</h4>
            <ButtonGroup className="mt-2">
              <Button color={ byUrl ? 'secondary' : 'warning' } onClick={ () => this.useUsernameAndJob() }>By Username &
                Job</Button>
              <Button color={ byUrl ? 'warning' : 'secondary' } onClick={ () => this.useUrl() }>By URL</Button>
            </ButtonGroup>
          </header>
          {
            this.state.byUrl
              ? <ConnectByUrl handleChange={ handleChange }
                              comPort={ comPort }
                              connected={ connected }
                              start={ start }
                              url={ url } />
              : <ConnectByUsernameAndJob handleChange={ handleChange }
                                         comPort={ comPort }
                                         connected={ connected }
                                         job={ job }
                                         start={ start }
                                         username={ username } />
          }
          <div className="text-center">
            <a href="#" onClick={ () => this.resetSettings() }>Reset Settings & Start Over</a>
          </div>
        </Container>
      </div>
    );
  };
}

const ConnectByUsernameAndJob = (props) =>
  <div>
    <Card className="mt-2 bg-primary" body>
      <CardTitle>Output COM Port</CardTitle>
      <Form>
        <FormGroup>
          <Input type="text"
                 name="comPort"
                 id="comPort"
                 placeholder="Type in your COM port from last step."
                 required
                 value={ props.comPort }
                 onChange={ e => props.handleChange(e) } />
          <small className="mt-3"><em>Type in the port number that appears by "Second Port" in the Virtual Serial Port
            app.</em></small>
        </FormGroup>
      </Form>
    </Card>
    <Card className="bg-primary" body>
      <CardTitle>
        By Username & Job Slug
      </CardTitle>
      <Form>
        <FormGroup row>
          <Label for="username" sm={ 2 }>Username</Label>
          <Col sm={ 10 }>
            <Input type="text"
                   name="username"
                   id="username"
                   placeholder="Type in your username (not email)."
                   value={ props.username }
                   onChange={ e => props.handleChange(e) } />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="job" sm={ 2 }>Job</Label>
          <Col sm={ 10 }>
            <Input type="text"
                   name="job"
                   id="job"
                   placeholder="Type in your job slug."
                   value={ props.job }
                   onChange={ e => props.handleChange(e) } />
          </Col>
        </FormGroup>
        <div className="text-center">
          <Button className="mt-3"
                  type="submit"
                  color="success"
                  onClick={ () => props.start() }>Connect</Button>
        </div>
      </Form>
    </Card>
  </div>;

const ConnectByUrl = (props) =>
  <div>
    <Card className="mt-4 bg-primary" body>
      <CardTitle>Output COM Port</CardTitle>
      <Form>
        <FormGroup>
          <Input type="text"
                 name="comPort"
                 id="comPort"
                 placeholder="Type in your COM port from last step."
                 value={ props.comPort }
                 onChange={ e => props.handleChange(e) }
                 required />
        </FormGroup>
      </Form>
    </Card>
    <Card className="mt-2 bg-primary" body>
      <CardTitle>
        By URL
      </CardTitle>
      <Form>
        <FormGroup row>
          <Col sm={ 10 }>
            <Input type="text"
                   name="url"
                   id="url"
                   placeholder="i.e. upword.ly/stanley/colombia"
                   value={ props.url }
                   onChange={ e => props.handleChange(e) } />
          </Col>
        </FormGroup>
        <div className="text-center">
          <Button className="mt-3"
                  type="submit"
                  color="success"
                  onClick={ () => props.start() }>Connect</Button>
        </div>
      </Form>
    </Card>
  </div>;

export default Configure;
