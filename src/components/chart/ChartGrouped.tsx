/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import * as array from 'd3-array';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import Svg, {Circle, G, Line} from 'react-native-svg';
import Path from 'react-native-svg-charts/src/animated-path';
import {LayoutChangeEvent, View} from 'react-native';
import ChartGrid from '~/components/chart/ChartGrid';

type Props = {
  data: any;
  svg?: any;
  style?: any;
  animate?: boolean;
  animationDuration?: number;
  curve?: () => any;
  contentInset?: {top: number; left: number; right: number; bottom: number};
  numberOfXTicks?: number;
  numberOfYTicks?: number;
  xSelected?: number;
  gridMin?: number;
  gridMax?: number;
  yMin?: number;
  yMax?: number;
  xMin?: number;
  xMax?: number;
  clampX?: boolean;
  clampY?: boolean;
  xScale?: () => any;
  yScale?: () => any;
  xAccessor?: (props: any) => any;
  yAccessor?: (props: any) => any;
  selectedLineMarkerColor?: any;
  showGrid?: boolean;
};
const ChartGrouped: React.FC<Props> = props => {
  const {
    data,
    svg = {},
    curve = shape.curveLinear,
    contentInset: {top = 0, bottom = 0, left = 0, right = 0} = {},
    numberOfXTicks = 10,
    numberOfYTicks = 10,
    xSelected = -1,
    xScale = scale.scaleLinear,
    yScale = scale.scaleLinear,
    xAccessor = ({index}: {item: any; index: any}) => index,
    yAccessor = ({item}: {item: any; index: any}) => item,
    style,
    animate,
    gridMax,
    gridMin,
    clampX,
    clampY,
    animationDuration,
    selectedLineMarkerColor,
    showGrid = false,
  } = props;
  const mappedData = data.map((dataArray: any) =>
    dataArray.data.map((item: any, index: number) => ({
      y: yAccessor({item, index}),
      x: xAccessor({item, index}),
    })),
  );
  console.log('[ChartGrouped] RENDER', {mappedData, data});
  const yValues = array.merge(mappedData).map((item: any) => item.y);
  const xValues = array.merge(mappedData).map((item: any) => item.x);

  const yExtent = array.extent([...yValues, gridMin, gridMax]);
  const xExtent = array.extent([...xValues]);

  const {
    yMin = yExtent[0],
    yMax = yExtent[1],
    xMin = xExtent[0],
    xMax = xExtent[1],
  } = props;

  const [layout, setLayout] = useState({width: 0, height: 0});

  const createPaths = ({data: _data, x, y}: {data: any; x: any; y: any}) => {
    const lines = _data.map((line: any) =>
      shape
        .line()
        .x((d: any) => x(d.x))
        .y((d: any) => y(d.y))
        .defined((item: any) => typeof item.y === 'number')
        .curve(curve)(line),
    );
    return {
      path: lines,
      lines,
      points: _data,
    };
  };

  const renderGrid = (_props: any) => {
    return <ChartGrid {..._props} />;
  };

  const renderLineMarker = ({
    x: _x,
    y: _y,
    yTicks: _yTicks,
  }: {
    x: any;
    y: any;
    yTicks: any;
  }) => {
    const fill = selectedLineMarkerColor ?? 'none';
    return (
      <Line
        // x={_x(0.4)}
        key={'selectedLineIndex'}
        y1={'0%'}
        y2={'100%'}
        x1={_x(xSelected)}
        x2={_x(xSelected)}
        strokeWidth={1}
        stroke={fill}
      />
    );
  };

  //invert range to support svg coordinate system
  const y = yScale()
    .domain([yMin, yMax])
    .range([layout.height - bottom, top])
    .clamp(clampY);

  const x = xScale()
    .domain([xMin, xMax])
    .range([left, layout.width - right])
    .clamp(clampX);

  const paths = createPaths({
    data: mappedData,
    x,
    y,
  });
  const xTicks = x.ticks(numberOfXTicks);
  const yTicks = y.ticks(numberOfYTicks);
  const extraProps = {
    x,
    y,
    data,
    xTicks,
    yTicks,
    width: layout.width,
    height: layout.height,
    ...paths,
  };

  const _onLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: {height, width},
      },
    } = event;
    setLayout({width, height});
  };

  return (
    <View style={style}>
      <View style={{flex: 1}} onLayout={event => _onLayout(event)}>
        {layout.height > 0 && layout.width > 0 && (
          <Svg style={{height: layout.height, width: layout.width}}>
            {showGrid && renderGrid(extraProps)}
            {paths.path.map((path: any, index: number) => {
              const {svg: pathSvg} = data[index];
              const key = path + '-' + index;
              return (
                <Path
                  // x={x(0.4)}
                  key={key}
                  fill={'none'}
                  {...svg}
                  {...pathSvg}
                  d={path}
                  animate={animate}
                  animationDuration={animationDuration}
                />
              );
            })}

            {xSelected > -1 && renderLineMarker(extraProps)}

            {/*render points*/}
            {paths.points.map(
              (points: Array<{x: number; y: number}>, index: number) => {
                const {svg: pathSvg} = data[index];
                // console.log('paths.points.map', {points});
                return points.map((point, pIndex, pArray) => {
                  const isSelected = xSelected === point.x;
                  const isLast = pIndex === pArray.length - 1;
                  const showLastPoint = xSelected === -1 && isLast;
                  // console.log('point', {
                  //   point,
                  //   xSelected,
                  //   xScale: x(xSelected),
                  // });
                  const key =
                    point.x + '-' + point.y + '-' + index + '-' + pIndex;
                  const cx = x(point.x);
                  const cy = y(point.y);
                  const r = isSelected ? 3 : 2;
                  const fill = isSelected ? '#303137' : 'none';
                  return (
                    <G key={`points${key}`}>
                      {(isSelected || showLastPoint) && (
                        <Circle
                          // x={x(0.4)}
                          key={key + 'selected'}
                          cx={cx}
                          cy={cy}
                          r={5}
                          {...pathSvg}
                          stroke={fill}
                        />
                      )}
                      {(isSelected || showLastPoint) && (
                        <Circle
                          // x={x(0.4)}
                          key={key + 'selected2'}
                          cx={cx}
                          cy={cy}
                          r={r}
                          {...pathSvg}
                          fill={pathSvg.stroke}
                        />
                      )}
                    </G>
                  );
                });
              },
            )}
          </Svg>
        )}
      </View>
    </View>
  );
};
export default ChartGrouped;
