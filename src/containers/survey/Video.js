import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import ConfigurationSummary from './ConfigurationSummary';


class Video extends Component {

    onConfigurationSelect = (configurationId) => {
        this.props.selectHandlers.onVideoSelect(this.props.entity.id);
        this.props.selectHandlers.onConfigurationSelect(configurationId);
    }

    render() {
        return (
            <>
                <ListGroup.Item>
                    <span className="pl-1">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-dot" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                        </svg>{this.props.entity.title}
                    </span>
                </ListGroup.Item>
                {this.props.entity.configurations.map((configuration) => {
                    return (<ConfigurationSummary onSelect={() => { this.onConfigurationSelect(configuration.id) }} selectedEntities={this.props.selectedEntities} key={configuration.id} entity={configuration} />)
                })}
            </>
        )
    }

}

export default Video;