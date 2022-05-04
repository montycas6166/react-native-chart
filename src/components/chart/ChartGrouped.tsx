/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import * as array from 'd3-array';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import Svg, {Circle, G, Line, Text} from 'react-native-svg';
import Path from 'react-native-svg-charts/src/animated-path';
import {LayoutChangeEvent, View} from 'react-native';
import ChartGrid from '~/components/chart/ChartGrid';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import moment from 'moment';

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
  // xSelected?: number;
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
  onChangeY?: (y: number) => void;
};
const ChartGrouped: React.FC<Props> = props => {
  const {
    onChangeY,
    data,
    svg = {},
    curve = shape.curveLinear,
    contentInset: {top = 0, bottom = 0, left = 0, right = 0} = {},
    numberOfXTicks = 10,
    numberOfYTicks = 10,
    // xSelected = -1,
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
  const [selectedPoint, setSelectedPoint] = useState({x: -1, y: -1});

  const mappedData = data.map((dataArray: any) =>
    dataArray.data.map((item: any, index: number) => ({
      y: yAccessor({item, index}),
      x: xAccessor({item, index}),
    })),
  );
  // console.log('[ChartGrouped] RENDER', {mappedData, data});
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
    const value = moment(selectedPoint.x).format('MM/DD/YYYY');
    return (
      <>
        <Line
          // x={_x(0.4)}
          key={'selectedLineIndex'}
          y1={'10%'}
          y2={'100%'}
          x1={_x(selectedPoint.x)}
          x2={_x(selectedPoint.x)}
          strokeWidth={1}
          stroke={fill}
        />
        <Text
          key={'selectedTextIndex'}
          x={_x(selectedPoint.x)}
          y={'5%'}
          fontSize={14}
          fill={'white'}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}>
          {value}
        </Text>
      </>
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
    console.log('[ChartGrouped] _onLayout', {width, height});
  };

  const _xSelectedHandler = (eventX: number) => {
    const xLength = layout.width - left - right;
    const xx = Math.min(Math.max(eventX - left, 0), xLength);
    const p = xx / xLength;
    const selectedTouchX = p * (xMax - xMin) + xMin;
    const rightPoint = paths.points?.[0]?.filter(
      (_p: any) => _p.x >= selectedTouchX,
    )?.[0];
    if (rightPoint) {
      const points = paths.points[0];
      let leftPoint;
      for (let i = 0; i < points.length; i++) {
        if (points[i].x === rightPoint.x) {
          if (i > 0) {
            leftPoint = points[i - 1];
          }
          break;
        }
      }
      if (leftPoint) {
        if (selectedTouchX - leftPoint.x < rightPoint.x - selectedTouchX) {
          setSelectedPoint(leftPoint);
          onChangeY && onChangeY(leftPoint.y);
        } else {
          setSelectedPoint(rightPoint);
          onChangeY && onChangeY(rightPoint.y);
        }
      } else {
        setSelectedPoint(rightPoint);
        onChangeY && onChangeY(rightPoint.y);
      }
    }
  };

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onTouchesDown(e => {
      // console.log('panGesture onTouchesDown!', e);
      _xSelectedHandler(e.changedTouches[0].x);
    })
    .onTouchesUp(e => {
      console.log('panGesture onTouchesUp!', e);
      setSelectedPoint({x: -1, y: -1});
      const points = paths.points?.[0];
      if (points) {
        onChangeY && onChangeY(points[points.length - 1].y);
      }
    })
    .onUpdate(e => {
      // console.log('panGesture ONUPDATE!', e);
      _xSelectedHandler(e.x);
    });

  // const singleTap = Gesture.Tap()
  //   .onStart(e => {
  //     console.log('singleTap ONSTART', e);
  //   })
  //   .onEnd((_event, success) => {
  //     if (success) {
  //       console.log('single tap!', _event);
  //     }
  //   });
  // const longTap = Gesture.LongPress()
  //   .onStart(e => {
  //     console.log('longTap ONSTART', e);
  //   })
  //   .onEnd((_event, success) => {
  //     if (success) {
  //       console.log('longTap ONEND', _event);
  //     }
  //   });
  // const doubleTap = Gesture.Tap()
  //   .numberOfTaps(2)
  //   .onEnd((_event, success) => {
  //     if (success) {
  //       console.log('doubleTap ONEND', _event);
  //     }
  //   });

  const taps = Gesture.Exclusive(panGesture);
  // console.log('RENDER',selectedPoint);
  return (
    <View style={style}>
      <GestureDetector gesture={taps}>
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

              {selectedPoint.x > -1 && renderLineMarker(extraProps)}

              {/*render points*/}
              {paths.points.map(
                (points: Array<{x: number; y: number}>, index: number) => {
                  const {svg: pathSvg} = data[index];
                  // console.log('paths.points.map', {points});
                  return points.map((point, pIndex, pArray) => {
                    const isSelected = selectedPoint.x === point.x;
                    const isLast = pIndex === pArray.length - 1;
                    const showLastPoint = selectedPoint.x === -1 && isLast;
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
      </GestureDetector>
    </View>
  );
};
export default ChartGrouped;
