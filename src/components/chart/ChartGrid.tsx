import React from 'react';
import {G, Line} from 'react-native-svg';

const Horizontal = (props: any) => {
  const {yTicks = [], y, svg} = props;
  return (
    <G>
      {yTicks.map((tick: any) => (
        <Line
          key={tick}
          x1={'0%'}
          x2={'100%'}
          y1={y(tick)}
          y2={y(tick)}
          strokeWidth={1}
          stroke={'rgba(230,230,230,0.5)'}
          strokeDasharray={4}
          {...svg}
        />
      ))}
      {/*<Line*/}
      {/*  key={'bottom_line'}*/}
      {/*  x1={'0%'}*/}
      {/*  x2={'100%'}*/}
      {/*  y1={'100%'}*/}
      {/*  y2={'100%'}*/}
      {/*  strokeWidth={1}*/}
      {/*  stroke={'rgba(230,230,230,0.5)'}*/}
      {/*  strokeDasharray={4}*/}
      {/*  {...svg}*/}
      {/*/>*/}
    </G>
  );
};

const Vertical = (props: any) => {
  const {xTicks = [], x, svg} = props;
  return (
    <G>
      {xTicks.map((tick: any, index: number) => (
        <Line
          key={index}
          y1={'0%'}
          y2={'100%'}
          x1={x(tick)}
          x2={x(tick)}
          strokeWidth={1}
          stroke={'rgba(230,230,230,0.5)'}
          strokeDasharray={4}
          {...svg}
        />
      ))}
    </G>
  );
};

const ChartGrid = ({horizontal = true, ...props}) => {
  return (
    <G>
      {horizontal && <Horizontal {...props} />}
      <Vertical {...props} />
    </G>
  );
};

export default ChartGrid;
