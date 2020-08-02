import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';


class ConfigurationSummary extends Component {

    render() {

        let liClass = (this.props.selectedEntities.configuration === this.props.entity.id) ? "active" : "";
        let check = (this.props.entity.isRated) ?
            (<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check2-circle float-right" fill="green" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                <path fillRule="evenodd" d="M8 2.5A5.5 5.5 0 1 0 13.5 8a.5.5 0 0 1 1 0 6.5 6.5 0 1 1-3.25-5.63.5.5 0 1 1-.5.865A5.472 5.472 0 0 0 8 2.5z" />
            </svg>) : null;
        return (
            <>
                <ListGroup.Item style={{ cursor: 'pointer' }} className={liClass} onClick={this.props.onSelect}>
                    <span className="pl-2">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-return-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.146 5.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L12.793 9l-2.647-2.646a.5.5 0 0 1 0-.708z" />
                            <path fillRule="evenodd" d="M3 2.5a.5.5 0 0 0-.5.5v4A2.5 2.5 0 0 0 5 9.5h8.5a.5.5 0 0 0 0-1H5A1.5 1.5 0 0 1 3.5 7V3a.5.5 0 0 0-.5-.5z" />
                        </svg>
                        {this.props.entity.title}
                        {check}
                    </span>
                </ListGroup.Item>
            </>
        )
    }

}

export default ConfigurationSummary;