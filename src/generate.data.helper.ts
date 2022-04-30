import ChartComponent from '~/components/chart';
import moment from 'moment';

export type DataItem = {
  index: number;
  timestamp: number;
  price: number;
};

const generate1D = () => {
  const json = require('~a/json/1D.json').Data.Data;
  return json.map((item: any, index: number) => ({
    index,
    timestamp: item.time,
    price: item.high,
  }));
};

const generate = (json: Array<any>) => {
  return json.map((item: any, index: number) => {
    const timestamp = moment(item.timeOpen).valueOf();
    const price: number = item.quote.open;
    return {
      index,
      timestamp,
      price: Math.round((price + Number.EPSILON) * 100) / 100,
    };
  });
};

export const generateDataByType = (type: string): Array<DataItem> => {
  if (type === ChartComponent.types._1D) {
    return generate1D();
  } else if (type === ChartComponent.types._1M) {
    const json = require('~a/json/1M.json').data.quotes;
    return generate(json);
  } else if (type === ChartComponent.types._1W) {
    const json = require('~a/json/1W.json').data.quotes;
    return generate(json);
  } else if (type === ChartComponent.types._1Y) {
    const json = require('~a/json/1Y.json').data.quotes;
    return generate(json);
  } else {
    const json = require('~a/json/3M.json').data.quotes;
    return generate(json);
  }
};
