import React, { Component } from 'react';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import uuid from 'react-uuid';
import restClient from '../../clients/RestClient';
import { paths, storageKeys } from '../../commons/Constants';
import WelcomeCard from '../../components/survey/WelcomeCard';
import Thanks from '../../components/survey/Thanks';
import VideoCategory from './VideoCategory';
import VideoPlayer from './VideoPlayer';

class Survey extends Component {

    state = {
        categories: [],
        numOfConfigurations: null,
        numOfRatedConfigurations: null,
        selectedEntities: {
            category: null,
            video: null,
            configuration: null
        },
        readyToDisplayPlayer: false
    }

    constructor(props) {
        super(props);
        this.videoElement = React.createRef();
    }


    componentDidMount() {
        console.log("Survey mounted.");
        let { id } = this.props.match.params;
        let idFromParam = id;
        let idFromStorage = localStorage.getItem(storageKeys.SURVEY_ID);
        if (idFromParam == null) {
            if (idFromStorage == null) {
                //New user
                let surveyId = uuid();
                localStorage.setItem(storageKeys.SURVEY_ID, surveyId);
                this.props.history.push(paths.SURVEY + "/" + surveyId);
            } else {
                //Old user
                this.props.history.push(paths.SURVEY + "/" + idFromStorage);

            }
        } else if (idFromParam != null) {
            localStorage.setItem(storageKeys.SURVEY_ID, idFromParam);
        }
        let numOfConfigurations = 0;
        let numOfRatedConfigurations = 0;
        let categories = null;

        let selectedEntities = null;

        restClient.get('/survey')
            .then(response => {
                categories = response.data.categories;
                categories.forEach(category => {
                    category.videos.forEach(video => {
                        video.configurations.forEach(configuration => {
                            numOfConfigurations++;
                            if (configuration.isRated) {
                                numOfRatedConfigurations++;
                            } else {
                                if (selectedEntities === null) {
                                    selectedEntities = {
                                        category: category.id,
                                        video: video.id,
                                        configuration: configuration.id
                                    }
                                }
                            }
                        })
                    })
                });
                this.setState({ selectedEntities: selectedEntities, readyToDisplayPlayer: true, numOfConfigurations: numOfConfigurations, numOfRatedConfigurations: numOfRatedConfigurations, categories: categories });

            })

    }


    onCategorySelect(categoryId) {
        this.setState({ selectedEntities: { ...this.state.selectedEntities, category: categoryId } });
    }
    onVideoSelect(videoId) {
        this.setState({ selectedEntities: { ...this.state.selectedEntities, video: videoId } });
    }
    onConfigurationSelect(configurationId) {
        this.setState({ selectedEntities: { ...this.state.selectedEntities, configuration: configurationId } });
    }

    getVideoOfConfiguration(configurationId) {
        let vid = null;
        this.state.categories.forEach((category) => {
            category.videos.forEach((video) => {
                video.configurations.forEach((configuration) => {
                    if (configuration.id === configurationId) {
                        vid = video;
                    }
                })
            })
        })
        return vid;
    }

    getConfiguration(configurationId) {
        let conf = null;
        this.state.categories.forEach((category) => {
            category.videos.forEach((video) => {
                video.configurations.forEach((configuration) => {
                    if (configuration.id === configurationId) {
                        conf = configuration;
                    }
                })
            })
        });
        return conf;
    }


    onRate(rate, configurationId) {

        restClient.post("/rate", {
            rate: rate,
            configurationId: configurationId
        }).then((response) => {
            let categories = this.state.categories.map((category) => {
                category.videos = category.videos.map((video) => {
                    video.configurations = video.configurations.map((configuration) => {
                        if (configuration.id === configurationId) {
                            configuration.isRated = true;
                        }
                        return configuration;
                    });
                    return video;
                })
                return category;
            });
            this.setState({ categories: categories });
            this.doNext();
        })

    }

    doNext() {
        let numOfRatedConfigurations = 0;
        let selectedEntities = null;

        this.state.categories.forEach(category => {
            category.videos.forEach(video => {
                video.configurations.forEach(configuration => {
                    if (configuration.isRated) {
                        numOfRatedConfigurations++;
                    } else {
                        if (selectedEntities === null) {
                            selectedEntities = {
                                category: category.id,
                                video: video.id,
                                configuration: configuration.id
                            }
                        }
                    }
                })
            })
        });
        if (numOfRatedConfigurations !== this.state.numOfConfigurations) {
            this.setState({ selectedEntities: selectedEntities, numOfRatedConfigurations: numOfRatedConfigurations });
        } else {
            this.setState({ numOfRatedConfigurations: numOfRatedConfigurations });
        }

    }

    onNewSurvey(){
        localStorage.removeItem(storageKeys.SURVEY_ID);
        this.props.history.push(paths.SURVEY + "/");
        window.location.reload();
    }

    render() {
        if(this.state.numOfConfigurations===this.state.numOfRatedConfigurations){
            return (
                <Thanks onNewSurvey={()=>{this.onNewSurvey()}}></Thanks>
            )
        }

        let selectHandlers = {
            onCategorySelect: (id) => { this.onCategorySelect(id) },
            onVideoSelect: (id) => { this.onVideoSelect(id) },
            onConfigurationSelect: (id) => { this.onConfigurationSelect(id) }
        }
        let player = (this.state.readyToDisplayPlayer) ?
            (<VideoPlayer
                key={this.state.selectedEntities.configuration}
                onRate={(rate, configurationId) => { this.onRate(rate, configurationId) }}
                configurationEntity={this.getConfiguration(this.state.selectedEntities.configuration)}
                videoEntity={this.getVideoOfConfiguration(this.state.selectedEntities.configuration)}>
            </VideoPlayer>) : null;
        return (
            <>
                <Container>
                    <WelcomeCard></WelcomeCard>
                    <Row className="mb-3">
                        <Col>
                            <ProgressBar variant="success" now={100 * this.state.numOfRatedConfigurations / this.state.numOfConfigurations}></ProgressBar>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            {player}
                        </Col>
                        <Col md={4}>
                            <label>Questions</label>
                            {this.state.categories.map((category) => {
                                return (<VideoCategory key={category.id} entity={category} selectHandlers={selectHandlers} selectedEntities={this.state.selectedEntities} />)
                            })}
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(Survey);