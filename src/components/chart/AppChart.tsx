import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '~/theme';
import {DataItem} from '~/generate.data.helper';
import ChartGrouped from '~/components/chart/ChartGrouped';

const defaultLineColor = '#04e23b';

type ChartComponentProps = {
  data?: Array<DataItem>;
  lineColor?: string;
  lineWidth?: number;
  onChangeY?: (y: number) => void;
};

const AppChart: React.FC<ChartComponentProps> = props => {
  const {s} = useTheme(createStyle);
  const {
    data = [],
    lineColor = defaultLineColor,
    lineWidth = 2,
    onChangeY,
  } = props;
  console.log('[AppChart]RENDER', {data});
  const genData = useMemo(() => {
    const chartData = [
      {
        data: data.map(d => ({x: d.timestamp, y: d.price})),
        svg: {
          stroke: lineColor,
          strokeWidth: lineWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'miter',
        },
      },
    ];
    const allY = chartData[0].data.map(p => p.y);
    const allX = chartData[0].data.map(p => p.x);
    const minAllY = allY.length > 0 ? Math.min(...allY) : 0;
    const maxAllY = allY.length > 0 ? Math.max(...allY) : 1;
    const yMin = minAllY - 0.2 * (maxAllY - minAllY);
    const yMax = maxAllY + 0.2 * (maxAllY - minAllY);

    const minAllX = allX.length > 0 ? Math.min(...allX) : 0;
    const maxAllX = allX.length > 0 ? Math.max(...allX) : 1;
    const xMin = minAllX - 0.03 * (maxAllX - minAllX);
    const xMax = maxAllX + 0.03 * (maxAllX - minAllX);

    const numberOfYTicks = 6;
    const numberOfXTicks = 20;

    return {
      chartData,
      yMin,
      yMax,
      xMax,
      xMin,
      numberOfYTicks,
      numberOfXTicks,
    };
  }, [data, lineColor, lineWidth]);
  return (
    <View style={s?.root}>
      <View style={s?.top} />
      <ChartGrouped
        onChangeY={onChangeY}
        showGrid={false}
        xAccessor={({item}) => item.x}
        yAccessor={({item}) => item.y}
        selectedLineMarkerColor={'#eee'}
        xMin={genData.xMin}
        xMax={genData.xMax}
        yMin={genData.yMin}
        yMax={genData.yMax}
        numberOfXTicks={genData.numberOfXTicks}
        numberOfYTicks={genData.numberOfYTicks}
        data={genData.chartData}
        // contentInset={{
        //   left: 10,
        //   right: 10,
        //   bottom: 10,
        //   top: 10,
        // }}
        style={s?.chart}
      />
    </View>
  );
};

export const createStyle = (theme: Theme) => {
  return StyleSheet.create({
    root: {
      flex: 1,
      // backgroundColor: 'rgba(255,255,255,0.15)',
    },
    top: {
      aspectRatio: 346 / 24,
      // backgroundColor: 'rgba(62,81,148,0.46)',
    },
    chart: {
      flex: 1,
    },
  });
};
export default AppChart;
