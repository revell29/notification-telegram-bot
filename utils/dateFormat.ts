import moment from "moment-timezone";
import "moment/locale/id";

export const dateTimezone = (timezone: string) => {
  return moment().tz(timezone).format("DD MMMM YYYY H:mm");
};
