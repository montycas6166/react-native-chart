import React, {Fragment, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Theme, useTheme} from '~/theme';
import {DataItem} from '~/generate.data.helper';
import AppChart from '~/components/chart/AppChart';

type ChartComponentProps = {
  headerValueSymbol?: string | any;
  chartType?: string;
  onChartTypeChange?: (type: string) => void;
  data?: Array<DataItem>;
};

const ChartTypes = {
  _1D: '1D',
  _1W: '1W',
  _1M: '1M',
  _3M: '3M',
  _1Y: '1Y',
};

const ChartComponent: React.FC<ChartComponentProps> & {
  types: typeof ChartTypes;
} = props => {
  const {s} = useTheme(createStyle);
  const {
    headerValueSymbol,
    chartType = ChartTypes._1D,
    onChartTypeChange,
    data = [],
  } = props;
  const [headerValue, setHeaderValue] = useState(-1);

  const _onChartTypeChange = (_chartType: string) => {
    onChartTypeChange && onChartTypeChange(_chartType);
  };

  return (
    <View style={s?.root}>
      <View style={s?.header}>
        {headerValue > -1 && (
          <View style={s?.headerValRow}>
            <Text style={s?.headerVal}>{`${headerValue}`}</Text>
            {typeof headerValueSymbol === 'string' && (
              <Text style={s?.headerVal}>{headerValueSymbol}</Text>
            )}
            {!!headerValueSymbol &&
              typeof headerValueSymbol !== 'string' &&
              headerValueSymbol()}
          </View>
        )}
      </View>
      <View style={s?.chart}>
        <AppChart data={data} />
      </View>
      <View style={s?.buttonsContainer}>
        <View style={s?.buttons}>
          {Object.entries(ChartTypes).map((chartTypeEntry, index, arr) => {
            const btnStyle = [
              s?.button,
              {
                backgroundColor:
                  chartType === chartTypeEntry[1]
                    ? 'rgba(255,255,255,0.15)'
                    : 'transparent',
              },
            ];
            return (
              <Fragment key={chartTypeEntry[0]}>
                <TouchableOpacity
                  onPress={() =>
                    chartType !== chartTypeEntry[1] &&
                    _onChartTypeChange(chartTypeEntry[1])
                  }
                  style={btnStyle}>
                  <Text style={s?.buttonTitle}>{chartTypeEntry[1]}</Text>
                </TouchableOpacity>
                {index < arr.length - 1 && <View style={s?.buttonDivider} />}
              </Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const createStyle = (theme: Theme) => {
  return StyleSheet.create({
    root: {
      borderRadius: 16,
      backgroundColor: 'rgba(230,230,255,0.05)',
      aspectRatio: 346 / 384,
      overflow: 'hidden',
    },
    header: {
      // backgroundColor: '#54beff',
      aspectRatio: 346 / 96,
      padding: 10,
    },
    chart: {
      aspectRatio: 346 / 227,
    },
    headerValRow: {flexDirection: 'row'},
    headerVal: {
      ...theme.fontStyles.Inter_SemiBold,
      color: theme.colors.white,
      fontSize: 32,
    },
    buttonsContainer: {
      flex: 1,
      padding: 10,
      justifyContent: 'flex-end',
    },
    buttons: {
      flexDirection: 'row',
      aspectRatio: 327 / 26,
    },
    button: {
      borderRadius: 8,
      aspectRatio: 57.4 / 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonTitle: {
      ...theme.fontStyles.Inter_Medium,
      fontSize: 14,
      color: theme.colors.white,
    },
    buttonDivider: {
      flex: 1,
    },
  });
};
ChartComponent.types = ChartTypes;
export default ChartComponent;
