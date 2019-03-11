import PropTypes from 'prop-types';
import React, {Component} from 'react';

const Content = ({
    placement, setContentNode, setArrowNode, children,
}) => (
    <div ref={setContentNode} className={`popover bs-popover-${placement}`} role="tooltip">
        <div ref={setArrowNode} className="arrow"/>
        <div className="popover-body">{children}</div>
    </div>
);

Content.propTypes = {
    placement:      PropTypes.string,
    setContentNode: PropTypes.func,
    setArrowNode:   PropTypes.func,
    children:       PropTypes.node,
};

export default Content;
