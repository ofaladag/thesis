import React, { Component } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Col, Row, Spinner } from 'react-bootstrap';


class VideoPlayer extends Component {

    state = {
        loadPercentage: 0,
        remainingTime:0,
        currentRecordId: null,
        isVideoLoaded: false,
        areCustomSettingsApplied: false,
        isVideoPlaying: false,
        isVideoEnded: false
    }


    constructor(props) {
        super(props);
        this.videoElement = React.createRef();
        this.timer = 0;
        this.rateValues = [];

        for (let i = 1; i <= 10; i++) {
            this.rateValues.push(i);
        }

    }

    componentDidMount() {
        console.log("player mounted");
        var player = window.dashjs.MediaPlayer().create();
        player.initialize(this.videoElement.current, null, false);
        player.getOfflineController().loadRecordsFromStorage().then(() => {
            let tmpOfflineDownload = player.getOfflineController().getAllRecords().find((item) => item.originalUrl === this.props.videoEntity.videourl);
            if (tmpOfflineDownload) {

                if(tmpOfflineDownload.progress<100){
                    player.getOfflineController().deleteRecord(tmpOfflineDownload.id).then(()=>{
                        player.getOfflineController().createRecord(this.props.videoEntity.videourl).then((id) => {
                            this.setState({ currentRecordId: id });
                        });
                    })
                }else{
                    this.setState({ currentRecordId: tmpOfflineDownload.id });
                }
            } else {
                player.getOfflineController().createRecord(this.props.videoEntity.videourl).then((id) => {
                    this.setState({ currentRecordId: id });
                });

            }
            this.timer = setInterval(() => { this.checkDownloadStatus() }, 500);
        });

        player.on(window.dashjs.MediaPlayer.events.OFFLINE_RECORD_LOADEDMETADATA, function (e) { /* jshint ignore:line */
            player.getOfflineController().startRecord(e.id, e.mediaInfos);
        });


        let playerComponent = this;

        player.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED, function (e) { /* jshint ignore:line */
            playerComponent.handlePlaybackStart(e);
        });

        player.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED, function (e) { /* jshint ignore:line */
            playerComponent.handlePlaybackEnd(e);
        });

        player.on(window.dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, function (e) {
            playerComponent.setState({remainingTime:e.timeToEnd})

            /* jshint ignore:line */
            if (playerComponent.state.areCustomSettingsApplied === false && e.time >= playerComponent.props.configurationEntity.startTime && e.time <= playerComponent.props.configurationEntity.finishTime) {
                playerComponent.applySettings();
            } else if (playerComponent.state.areCustomSettingsApplied && (e.time < playerComponent.props.configurationEntity.startTime || e.time > playerComponent.props.configurationEntity.finishTime)) {
                playerComponent.resetSettings();
            }
        });


        window.player = player;
    }

    handlePlaybackStart(e) {
        console.log("handlePlaybackStart");
        this.setState({ isVideoPlaying: true });
    }

    handlePlaybackEnd(e) {
        console.log("handlePlaybackEnd");
        this.setState({ isVideoEnded: true, isVideoPlaying: false });
    }

    applySettings() {
        console.log("Custom settings are applied.");
        window.player.setPlaybackRate(parseFloat(this.props.configurationEntity.settings));
        this.setState({ areCustomSettingsApplied: true })
    }

    resetSettings() {
        console.log("Custom settings are reset.")
        window.player.setPlaybackRate(1.0);
        this.setState({ areCustomSettingsApplied: false })
    }

    checkDownloadStatus() {
        let perc = window.player.getOfflineController().getRecordProgression(this.state.currentRecordId);
        if (perc >= 100) {
            this.onLoad();
            clearInterval(this.timer);
        } else {
            this.setState({ loadPercentage: perc });
        }
    }

    onLoad() {
        let player = window.player;
        this.setState({ loadPercentage: 100, isVideoLoaded: true });
        player.attachSource(player.getOfflineController().getAllRecords().find((item) => item.id === this.state.currentRecordId).url);
    }

    onPlay() {
        let player = window.player;
        player.play();
    }

    onRate(rate){
        this.props.onRate(rate,this.props.configurationEntity.id);
    }
    render() {

        let loadingArea = this.state.isVideoLoaded ? null : (
            <Row>
                <Col>
                    <Spinner animation="border" />
                    <p>Loading (%{this.state.loadPercentage})</p>
                </Col>
            </Row>
        );

        let playButton = this.state.isVideoLoaded && !this.state.isVideoPlaying ? (
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => { this.onPlay() }}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-play" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                        </svg>
                    Play
                </Button>
                </Col>
            </Row>
        ) : null;

        let rateArea = this.state.isVideoEnded ? (
            <>
                <Row>
                    <Col>
                        <label>Rate your experience:</label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonToolbar>
                            <ButtonGroup>
                                {this.rateValues.map((rateValue) => {
                                    return (<Button key={rateValue} onClick={()=>{this.onRate(rateValue)}}>{rateValue}</Button>)
                                })}
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </>
        ) : null;

        let remainingTime = this.state.isVideoPlaying && !this.state.isVideoEnded?(
            <Row>
                <Col>
                    Video will end in {Math.round(this.state.remainingTime)}sec, after that you will able to rate.
                </Col>
            </Row>
        ):null;

        return (
            <>
                <Row>
                    <Col>
                        <label>{this.props.configurationEntity.title}</label>
                    </Col>
                </Row>
                {loadingArea}
                <Row hidden={!this.state.isVideoLoaded}>
                    <Col>
                        <div className="embed-responsive embed-responsive-16by9">
                            <video ref={this.videoElement} className="embed-responsive-item" controls></video>
                        </div>
                    </Col>
                </Row>
                {playButton}
                {rateArea}
                {remainingTime}

            </>
        )
    }

}

export default VideoPlayer;