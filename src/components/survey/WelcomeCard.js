import React from 'react';
import { Col, Jumbotron, Row } from 'react-bootstrap';

const WelcomeCard = (props) => {

    return (
        <Row>
            <Col>
                <Jumbotron>
                    <h1>Hello, Welcome to Our Survey!</h1>
                    <p>
                        Please watch the videos below and rate your experiment.
                    </p>
                    <p>
                        To continue current survey, you can use url: {window.location.href}
                    </p>
                </Jumbotron>
            </Col>
        </Row>
    )
}

export default WelcomeCard;