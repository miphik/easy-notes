// @flow
import {Empty} from 'antd';
import * as React from 'react';
import nodata from 'src/images/nodata.png';
import {FormattedMessage as Fm} from 'react-intl';
import styles from './styles.styl';

type PropsType = {
    image?: string | React.Node,
    showImage?: boolean,
    text?: string | React.Node,
};

const MESSAGES = {
    text: <Fm id="Empty.render.nodata" defaultMessage="No Data"/>,
};

export default class Nodata extends React.PureComponent<PropsType> {
    static defaultProps = {
        image:     nodata,
        showImage: true,
        text:      MESSAGES.text,
    };

    render() {
        const {image, text, showImage} = this.props;

        return (
            <Empty
                className={`${styles.empty} ${!showImage ? styles.hide_image : ''}`}
                image={image}
                description={text}
            />
        );
    }
}
