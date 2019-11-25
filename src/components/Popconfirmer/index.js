// @flow
import Color from 'color';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import Popover, {ArrowContainer} from 'react-tiny-popover';
import {emptyFunc} from 'utils/General';

type PropsType = {
    textColor?: string,
    shadow?: string,
    backgroundColor?: string,
    trigger: React.Node,
    content: React.Node,
    isOpen: boolean,
    onToggle?: () => void,
};

const STYLES = memoizeOne((
    textColor: string,
    backgroundColor: string,
    shadow: string,
) => (
    {
        container: {
            overflow: 'inherit',
        },
        contentWrapper: {
            color:     textColor,
            padding:   '0.5em',
            boxShadow: shadow,
            border:    `1px solid ${Color(backgroundColor).lighten(0.75)}`,
            backgroundColor,
        },
    }
));

export default class Popconfirmer extends React.PureComponent<PropsType> {
    static defaultProps = {
        shadow:          '2px 3px 9px 1px rgba(0,0,0,0.75)',
        backgroundColor: 'white',
        textColor:       'black',
        onToggle:        emptyFunc,
    };

    render() {
        const {
            trigger, content, shadow, backgroundColor, textColor, isOpen, onToggle,
        } = this.props;
        const style = STYLES(textColor, backgroundColor, shadow);

        return (
            <Popover
                isOpen={isOpen}
                onClickOutside={onToggle}
                transitionDuration={0.01}
                position={['top', 'right', 'left', 'bottom']} // preferred position
                containerStyle={style.container}
                content={({position, targetRect, popoverRect}) => (
                    <ArrowContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={Color(backgroundColor).lighten(0.25)}
                        arrowSize={10}
                        // arrowStyle={{opacity: 0.7}}
                    >
                        <div style={style.contentWrapper}>
                            {content}
                        </div>
                    </ArrowContainer>
                )}
            >
                <div onClick={onToggle}>
                    {trigger}
                </div>
            </Popover>
        );
    }
}
