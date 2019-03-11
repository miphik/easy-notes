import PopperJS from 'popper.js';
import React, {Children, cloneElement, Component} from 'react';
import {createPortal, findDOMNode} from 'react-dom';
import Content from './Content';
import Target from './Target';

class Popper extends Component {
    static defaultProps = {
        placement: 'bottom',
    };

    static Target = Target;

    static Content = Content;

    state = {
        placement: this.props.placement,
    };

    target = null;

    content = null;

    arrow = null;

    componentDidMount() {
        console.log(1111, this.target);
        console.log(11112222, this.content);
        this.popper = new PopperJS(
            this.target,
            this.content,
            {
                placement: this.state.placement,
                modifiers: {
                    arrow: {
                        element: this.arrow,
                    },
                    updateState: {
                        enabled: true,
                        order:   900,
                        fn:      data => {
                            if (data.placement !== this.state.placement) {
                                this.setState({placement: data.placement});
                            }
                            return data;
                        },
                    },
                },
            },
        );
    }

    componentWillReceiveProps({placement}) {
        if (placement !== this.state.placement) {
            this.setState({placement});
        }
    }

    componentDidUpdate() {
        this.popper.update();
    }

    componentWillUnmount() {
        this.popper.destroy();
    }

    setTargetNode = node => { this.target = node; };

    setContentNode = node => { this.content = node; };

    setArrowNode = node => { this.arrow = node; };

    render() {
        const {children} = this.props;
        const {placement} = this.state;

        return (
            Children.map(children, child => {
                console.log(33333333, child.type.displayName);
                if (child.type.displayName === 'Target') {
                    return cloneElement(child, {setTargetNode: this.setTargetNode});
                }

                if (child.type.displayName === 'Content') {
                    return cloneElement(child, {
                        placement,
                        setContentNode: this.setContentNode,
                        setArrowNode:   this.setArrowNode,
                    });
                }

                return child;
            })
        );
    }
}

export default Popper;
