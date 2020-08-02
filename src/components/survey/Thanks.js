import React from 'react';
import { Col, Jumbotron, Row, Button } from 'react-bootstrap';

const Thanks = (props) => {

    return (
        <Row>
            <Col>
                <Jumbotron>
                    <h1>Thanks to attend our survey!</h1>
                    <p>If you want to start new one please <Button onClick={()=>{props.onNewSurvey()}}>start</Button></p>
                </Jumbotron>
            </Col>
        </Row>
    )
}

export default Thanks;