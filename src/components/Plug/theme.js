import {css} from 'linaria';
import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        buttonWrapper: {
            display: 'inline-block',
        },
        button: {
            display:        'flex',
            justifyContent: 'center',
            alignItems:     'center',
            background:     '#fbfbfb',
            color:          '#cdcdcd',
            fontSize:       18,
            border:         0,
            paddingTop:     5,
            verticalAlign:  'bottom',
            height:         34,
            width:          36,
            ':hover':       {
                background: '#f3f3f3',
                outline:    0,
            },
            ':focus': {
                background: '#f3f3f3',
                outline:    0,
            },
            svg: {
                fill: '#fff',
            },
        },
        toolbar: {
            // left:         '50%',
            transform:       'translate(-50%) scale(0)',
            visibility:      'hidden',
            position:        'absolute',
            border:          '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgb(36, 46, 50)',
            borderRadius:    3,
            boxShadow:       'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px',
            zIndex:          2,
            boxSizing:       'border-box',
            ':after':        {
                /* top:            '100%',
                left:           '50%',
                border:         'solid transparent',
                content:        ' ',
                height:         0,
                width:          0,
                position:       'absolute',
                pointerEvents:  'none',
                borderColor:    'rgba(255, 255, 255, 0)',
                borderTopColor: '#fff',
                borderWidth:    4,
                marginLeft:     -4,*/
            },
            ':before': {
                /* top:            '100%',
                left:           '50%',
                border:         'solid transparent',
                content:        ' ',
                height:         0,
                width:          0,
                position:       'absolute',
                pointerEvents:  'none',
                borderColor:    'rgba(221, 221, 221, 0)',
                borderTopColor: '#ddd',
                borderWidth:    6,
                marginLeft:     -6,*/
            },
        },
    }
));

const buttonStyles = {
    buttonWrapper: css`
    display: inline-block;
  `,

    button: css`
    background: #fbfbfb;
    color: #888;
    font-size: 18px;
    border: 0;
    padding-top: 5px;
    vertical-align: bottom;
    height: 34px;
    width: 36px;
    &:hover,
    &:focus {
      background: #f3f3f3;
      outline: 0; /* reset for :focus */
    }
    svg {
      fill: #888;
    }
  `,

    active: css`
    background: #efefef;
    color: #444;
    svg {
      fill: #444;
    }
  `,
};

const toolbarStyles = {
    toolbar: css`
    left: 50%;
    position: absolute;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 1px 3px 0px rgba(220, 220, 220, 1);
    z-index: 2;
    box-sizing: border-box;
    &:after,
    &:before {
      top: 100%;
      left: 50%;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    &:after {
      border-color: rgba(255, 255, 255, 0);
      border-top-color: #fff;
      border-width: 4px;
      margin-left: -4px;
    }
    &:before {
      border-color: rgba(221, 221, 221, 0);
      border-top-color: #ddd;
      border-width: 6px;
      margin-left: -6px;
    }
  `,
};

export const defaultTheme = {
    buttonStyles,
    toolbarStyles,
    STYLES,
};
