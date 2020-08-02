import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import Video from './Video';


class VideoCategory extends Component {


    onSelect = () => {
        this.props.selectHandlers.onCategorySelect(this.props.entity.id);
    }

    render() {

        let videoEntities = (this.props.selectedEntities.category === this.props.entity.id) ? this.props.entity.videos.map((video) => {
            return (<Video selectHandlers={this.props.selectHandlers} selectedEntities={this.props.selectedEntities} key={video.id} entity={video} />)
        }) : null;

        return (
            <>
                <ListGroup.Item style={{ cursor: 'pointer' }} onClick={this.onSelect}><h4>{this.props.entity.title}</h4></ListGroup.Item>
                {videoEntities}
            </>
        )
    }

}

export default VideoCategory;