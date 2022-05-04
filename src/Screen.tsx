import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View, Text, ScrollView} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useTheme} from '~/theme';
import ChartComponent from '~/components/chart';
import {DataItem, generateDataByType} from '~/generate.data.helper';

const Screen = () => {
  const edgeInsets = useSafeAreaInsets();
  const {s} = useTheme(createStyle(edgeInsets));
  const [chartType, setChartType] = useState(ChartComponent.types._1D);
  const [data, setData] = useState((): Array<DataItem> => []);

  useEffect(() => {
    //data loading simulation
    setTimeout(() => {
      setChartType(ChartComponent.types._1D);
      setData(generateDataByType(ChartComponent.types._1D));
    }, 1000);
  }, []);

  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={s?.root.backgroundColor}
      />
      <View style={s?.root}>
        <View style={s?.header}>
          <Text style={s?.title}>{'Portfolio'}</Text>
        </View>
        <ScrollView bounces={false}>
          <ChartComponent
            headerValueSymbol={'$'}
            chartType={chartType}
            onChartTypeChange={type => {
              setChartType(type);
              setData(generateDataByType(type));
            }}
            data={data}
          />
        </ScrollView>
      </View>
    </>
  );
};

export const createStyle = (edgeInsets: EdgeInsets) => (theme: Theme) =>
  StyleSheet.create({
    root: {
      backgroundColor: theme.colors.background,
      flex: 1,
      paddingBottom: edgeInsets.bottom > 0 ? edgeInsets.bottom : 10,
      paddingTop: edgeInsets.top > 0 ? edgeInsets.top : 10,
      paddingLeft: edgeInsets.left > 0 ? edgeInsets.left : 10,
      paddingRight: edgeInsets.right > 0 ? edgeInsets.right : 10,
    },
    header: {
      aspectRatio: 346 / 39,
    },
    title: {
      marginTop: 10,
      marginBottom: 5,
      ...theme.fontStyles.Inter_Bold,
      color: theme.colors.white,
      fontSize: 24,
    },
  });

export default Screen;
