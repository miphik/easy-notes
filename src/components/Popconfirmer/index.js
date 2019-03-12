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
    scaleFactor?: number,
    padding?: number,
    trigger: React.Node,
    content: React.Node,
    isOpen: boolean,
    onToggle?: () => void,
};

const STYLES = memoizeOne((
    scaleFactor: number,
    textColor: string,
    backgroundColor: string,
    shadow: string,
    padding: number,
) => (
    {
        container: {
            overflow: 'inherit',
        },
        contentWrapper: {
            color:     textColor,
            padding:   scaleFactor * padding,
            boxShadow: shadow,
            border:    `1px solid ${Color(backgroundColor).lighten(0.75)}`,
            backgroundColor,
        },
    }
));

export default class Popconfirmer extends React.PureComponent<PropsType> {
    static defaultProps = {
        shadow:          '2px 3px 9px 1px rgba(0,0,0,0.75)',
        padding:         8,
        backgroundColor: 'white',
        scaleFactor:     1,
        textColor:       'black',
        onToggle:        emptyFunc,
    };

    render() {
        const {
            trigger, content, scaleFactor, shadow, padding, backgroundColor, textColor, isOpen, onToggle,
        } = this.props;
        const style = STYLES(scaleFactor, textColor, backgroundColor, shadow, padding);

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
