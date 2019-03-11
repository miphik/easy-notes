import PropTypes from 'prop-types';
import React, {cloneElement, Component} from 'react';

const Target = ({setTargetNode, children: element}) => cloneElement(element, {ref: setTargetNode});

Target.propTypes = {
    setTargetNode: PropTypes.func,
    children:      PropTypes.element,
};

export default Target;
