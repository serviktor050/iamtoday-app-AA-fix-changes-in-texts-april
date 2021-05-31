import moment from 'moment';
import { DAY, WEEK, MONTH } from '../../constants';

export const getPeriod = ({period, dateStart}) => {
  let result = [];
  let time = moment(dateStart);
  switch(period) {
    case WEEK:
      for (let i = 1; i < 8; i++) {
        result.push(time.clone());
        time = time.add(1, 'd');
      }
      return result;
    case DAY:
      result.push(time.clone());
      return result;
    default:
      result.push(time.clone());
      return result;
  }
}