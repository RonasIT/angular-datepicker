import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
var moment = momentNs;
var DayCalendarService = /** @class */ (function () {
    function DayCalendarService(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            showNearMonthDays: true,
            showWeekNumbers: false,
            firstDayOfWeek: 'su',
            weekDayFormat: 'ddd',
            format: 'DD-MM-YYYY',
            allowMultiSelect: false,
            monthFormat: 'MMM, YYYY',
            enableMonthSelector: true,
            locale: moment.locale(),
            dayBtnFormat: 'DD',
            unSelectOnClick: true,
            calendarModeDisplayFirst: 'day'
        };
        this.DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    }
    DayCalendarService.prototype.getConfig = function (config) {
        var _config = tslib_1.__assign({}, this.DEFAULT_CONFIG, this.utilsService.clearUndefined(config));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        moment.locale(_config.locale);
        return _config;
    };
    DayCalendarService.prototype.generateDaysMap = function (firstDayOfWeek) {
        var firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        var daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce(function (map, day, index) {
            map[day] = index;
            return map;
        }, {});
    };
    DayCalendarService.prototype.generateMonthArray = function (config, month, selected) {
        var _this = this;
        var monthArray = [];
        var firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek);
        var firstDayOfBoard = month.clone().startOf('month');
        while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
            firstDayOfBoard.subtract(1, 'day');
        }
        var current = firstDayOfBoard.clone();
        var prevMonth = month.clone().subtract(1, 'month');
        var nextMonth = month.clone().add(1, 'month');
        var today = moment();
        var daysOfCalendar = this.utilsService.createArray(42)
            .reduce(function (array) {
            array.push({
                date: current.clone(),
                selected: !!selected.find(function (selectedDay) { return current.isSame(selectedDay, 'day'); }),
                currentMonth: current.isSame(month, 'month'),
                prevMonth: current.isSame(prevMonth, 'month'),
                nextMonth: current.isSame(nextMonth, 'month'),
                currentDay: current.isSame(today, 'day'),
                disabled: _this.isDateDisabled(current, config)
            });
            current.add(1, 'day');
            return array;
        }, []);
        daysOfCalendar.forEach(function (day, index) {
            var weekIndex = Math.floor(index / 7);
            if (!monthArray[weekIndex]) {
                monthArray.push([]);
            }
            monthArray[weekIndex].push(day);
        });
        if (!config.showNearMonthDays) {
            monthArray = this.removeNearMonthWeeks(month, monthArray);
        }
        return monthArray;
    };
    DayCalendarService.prototype.generateWeekdays = function (firstDayOfWeek) {
        var weekdayNames = {
            su: moment().day(0),
            mo: moment().day(1),
            tu: moment().day(2),
            we: moment().day(3),
            th: moment().day(4),
            fr: moment().day(5),
            sa: moment().day(6)
        };
        var weekdays = [];
        var daysMap = this.generateDaysMap(firstDayOfWeek);
        for (var dayKey in daysMap) {
            if (daysMap.hasOwnProperty(dayKey)) {
                weekdays[daysMap[dayKey]] = weekdayNames[dayKey];
            }
        }
        return weekdays;
    };
    DayCalendarService.prototype.isDateDisabled = function (date, config) {
        if (config.isDayDisabledCallback) {
            return config.isDayDisabledCallback(date);
        }
        if (config.min && date.isBefore(config.min, 'day')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'day'));
    };
    // todo:: add unit tests
    DayCalendarService.prototype.getHeaderLabel = function (config, month) {
        if (config.monthFormatter) {
            return config.monthFormatter(month);
        }
        return month.format(config.monthFormat);
    };
    // todo:: add unit tests
    DayCalendarService.prototype.shouldShowLeft = function (min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'month') : true;
    };
    // todo:: add unit tests
    DayCalendarService.prototype.shouldShowRight = function (max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'month') : true;
    };
    DayCalendarService.prototype.generateDaysIndexMap = function (firstDayOfWeek) {
        var firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        var daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce(function (map, day, index) {
            map[index] = day;
            return map;
        }, {});
    };
    DayCalendarService.prototype.getMonthCalendarConfig = function (componentConfig) {
        return this.utilsService.clearUndefined({
            min: componentConfig.min,
            max: componentConfig.max,
            format: componentConfig.format,
            isNavHeaderBtnClickable: true,
            allowMultiSelect: false,
            locale: componentConfig.locale,
            yearFormat: componentConfig.yearFormat,
            yearFormatter: componentConfig.yearFormatter,
            monthBtnFormat: componentConfig.monthBtnFormat,
            monthBtnFormatter: componentConfig.monthBtnFormatter,
            monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
            multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
            showGoToCurrent: componentConfig.showGoToCurrent
        });
    };
    DayCalendarService.prototype.getDayBtnText = function (config, day) {
        if (config.dayBtnFormatter) {
            return config.dayBtnFormatter(day);
        }
        return day.format(config.dayBtnFormat);
    };
    DayCalendarService.prototype.getDayBtnCssClass = function (config, day) {
        if (config.dayBtnCssClassCallback) {
            return config.dayBtnCssClassCallback(day);
        }
        return '';
    };
    DayCalendarService.prototype.getDisplayMode = function (calendarModeDisplayFirst, currentMode, monthIsSelect) {
        if ((currentMode === ECalendarMode.Day) && (monthIsSelect || calendarModeDisplayFirst === 'day')) {
            return ECalendarMode.Day;
        }
        else if ((currentMode === ECalendarMode.Month) || (!monthIsSelect && calendarModeDisplayFirst === 'month')) {
            return ECalendarMode.Month;
        }
        else {
            return currentMode;
        }
    };
    DayCalendarService.prototype.removeNearMonthWeeks = function (currentMonth, monthArray) {
        if (monthArray[monthArray.length - 1].find(function (day) { return day.date.isSame(currentMonth, 'month'); })) {
            return monthArray;
        }
        else {
            return monthArray.slice(0, -1);
        }
    };
    DayCalendarService.ctorParameters = function () { return [
        { type: UtilsService }
    ]; };
    DayCalendarService = tslib_1.__decorate([
        Injectable()
    ], DayCalendarService);
    return DayCalendarService;
}());
export { DayCalendarService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzItZGF0ZS1waWNrZXIvIiwic291cmNlcyI6WyJkYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFHbkMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBSXRFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUduRSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFHeEI7SUFpQkUsNEJBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBaEJyQyxtQkFBYyxHQUF1QjtZQUM1QyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsV0FBVyxFQUFFLFdBQVc7WUFDeEIsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUN2QixZQUFZLEVBQUUsSUFBSTtZQUNsQixlQUFlLEVBQUUsSUFBSTtZQUNyQix3QkFBd0IsRUFBRSxLQUFLO1NBQ2hDLENBQUM7UUFDZSxTQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUduRSxDQUFDO0lBRUQsc0NBQVMsR0FBVCxVQUFVLE1BQTBCO1FBQ2xDLElBQU0sT0FBTyxHQUFHLHFCQUNYLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxZ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QUFDLGFBQWEsSUFBSSx3QkFBd0IsS0FBSyxPQUFPLENBQUMsRUFBRTtZQUM1RyxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUM7U0FDNUI7YUFBTTtZQUNMLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVPLGlEQUFvQixHQUE1QixVQUE2QixZQUFvQixFQUFFLFVBQW9CO1FBQ3JFLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLEVBQUU7WUFDM0YsT0FBTyxVQUFVLENBQUM7U0FDbkI7YUFBTTtZQUNMLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7O2dCQTNMaUMsWUFBWTs7SUFqQm5DLGtCQUFrQjtRQUQ5QixVQUFVLEVBQUU7T0FDQSxrQkFBa0IsQ0E2TTlCO0lBQUQseUJBQUM7Q0FBQSxBQTdNRCxJQTZNQztTQTdNWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBtb21lbnROcyBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgTW9tZW50IH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IFdlZWtEYXlzIH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3dlZWstZGF5cy50eXBlJztcbmltcG9ydCB7IFV0aWxzU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IElEYXkgfSBmcm9tICcuL2RheS5tb2RlbCc7XG5pbXBvcnQgeyBJRGF5Q2FsZW5kYXJDb25maWcsIElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsIH0gZnJvbSAnLi9kYXktY2FsZW5kYXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7IElNb250aENhbGVuZGFyQ29uZmlnIH0gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXItY29uZmlnJztcbmltcG9ydCB7IEVDYWxlbmRhck1vZGUgfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZS1lbnVtJztcbmltcG9ydCB7IENhbGVuZGFyTW9kZSB9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci1tb2RlJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXlDYWxlbmRhclNlcnZpY2Uge1xuICByZWFkb25seSBERUZBVUxUX0NPTkZJRzogSURheUNhbGVuZGFyQ29uZmlnID0ge1xuICAgIHNob3dOZWFyTW9udGhEYXlzOiB0cnVlLFxuICAgIHNob3dXZWVrTnVtYmVyczogZmFsc2UsXG4gICAgZmlyc3REYXlPZldlZWs6ICdzdScsXG4gICAgd2Vla0RheUZvcm1hdDogJ2RkZCcsXG4gICAgZm9ybWF0OiAnREQtTU0tWVlZWScsXG4gICAgYWxsb3dNdWx0aVNlbGVjdDogZmFsc2UsXG4gICAgbW9udGhGb3JtYXQ6ICdNTU0sIFlZWVknLFxuICAgIGVuYWJsZU1vbnRoU2VsZWN0b3I6IHRydWUsXG4gICAgbG9jYWxlOiBtb21lbnQubG9jYWxlKCksXG4gICAgZGF5QnRuRm9ybWF0OiAnREQnLFxuICAgIHVuU2VsZWN0T25DbGljazogdHJ1ZSxcbiAgICBjYWxlbmRhck1vZGVEaXNwbGF5Rmlyc3Q6ICdkYXknXG4gIH07XG4gIHByaXZhdGUgcmVhZG9ubHkgREFZUyA9IFsnc3UnLCAnbW8nLCAndHUnLCAnd2UnLCAndGgnLCAnZnInLCAnc2EnXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlKSB7XG4gIH1cblxuICBnZXRDb25maWcoY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWcpOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCB7XG4gICAgY29uc3QgX2NvbmZpZyA9IDxJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbD57XG4gICAgICAuLi50aGlzLkRFRkFVTFRfQ09ORklHLFxuICAgICAgLi4udGhpcy51dGlsc1NlcnZpY2UuY2xlYXJVbmRlZmluZWQoY29uZmlnKVxuICAgIH07XG5cbiAgICB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0UHJvcHNUb01vbWVudChfY29uZmlnLCBfY29uZmlnLmZvcm1hdCwgWydtaW4nLCAnbWF4J10pO1xuXG4gICAgbW9tZW50LmxvY2FsZShfY29uZmlnLmxvY2FsZSk7XG5cbiAgICByZXR1cm4gX2NvbmZpZztcbiAgfVxuXG4gIGdlbmVyYXRlRGF5c01hcChmaXJzdERheU9mV2VlazogV2Vla0RheXMpIHtcbiAgICBjb25zdCBmaXJzdERheUluZGV4ID0gdGhpcy5EQVlTLmluZGV4T2YoZmlyc3REYXlPZldlZWspO1xuICAgIGNvbnN0IGRheXNBcnIgPSB0aGlzLkRBWVMuc2xpY2UoZmlyc3REYXlJbmRleCwgNykuY29uY2F0KHRoaXMuREFZUy5zbGljZSgwLCBmaXJzdERheUluZGV4KSk7XG4gICAgcmV0dXJuIGRheXNBcnIucmVkdWNlKChtYXAsIGRheSwgaW5kZXgpID0+IHtcbiAgICAgIG1hcFtkYXldID0gaW5kZXg7XG5cbiAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgPHtba2V5OiBzdHJpbmddOiBudW1iZXJ9Pnt9KTtcbiAgfVxuXG4gIGdlbmVyYXRlTW9udGhBcnJheShjb25maWc6IElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsLCBtb250aDogTW9tZW50LCBzZWxlY3RlZDogTW9tZW50W10pOiBJRGF5W11bXSB7XG4gICAgbGV0IG1vbnRoQXJyYXk6IElEYXlbXVtdID0gW107XG4gICAgY29uc3QgZmlyc3REYXlPZldlZWtJbmRleCA9IHRoaXMuREFZUy5pbmRleE9mKGNvbmZpZy5maXJzdERheU9mV2Vlayk7XG4gICAgY29uc3QgZmlyc3REYXlPZkJvYXJkID0gbW9udGguY2xvbmUoKS5zdGFydE9mKCdtb250aCcpO1xuXG4gICAgd2hpbGUgKGZpcnN0RGF5T2ZCb2FyZC5kYXkoKSAhPT0gZmlyc3REYXlPZldlZWtJbmRleCkge1xuICAgICAgZmlyc3REYXlPZkJvYXJkLnN1YnRyYWN0KDEsICdkYXknKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50ID0gZmlyc3REYXlPZkJvYXJkLmNsb25lKCk7XG4gICAgY29uc3QgcHJldk1vbnRoID0gbW9udGguY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICBjb25zdCBuZXh0TW9udGggPSBtb250aC5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKTtcbiAgICBjb25zdCB0b2RheSA9IG1vbWVudCgpO1xuXG4gICAgY29uc3QgZGF5c09mQ2FsZW5kYXI6IElEYXlbXSA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZUFycmF5KDQyKVxuICAgICAgLnJlZHVjZSgoYXJyYXk6IElEYXlbXSkgPT4ge1xuICAgICAgICBhcnJheS5wdXNoKHtcbiAgICAgICAgICBkYXRlOiBjdXJyZW50LmNsb25lKCksXG4gICAgICAgICAgc2VsZWN0ZWQ6ICEhc2VsZWN0ZWQuZmluZChzZWxlY3RlZERheSA9PiBjdXJyZW50LmlzU2FtZShzZWxlY3RlZERheSwgJ2RheScpKSxcbiAgICAgICAgICBjdXJyZW50TW9udGg6IGN1cnJlbnQuaXNTYW1lKG1vbnRoLCAnbW9udGgnKSxcbiAgICAgICAgICBwcmV2TW9udGg6IGN1cnJlbnQuaXNTYW1lKHByZXZNb250aCwgJ21vbnRoJyksXG4gICAgICAgICAgbmV4dE1vbnRoOiBjdXJyZW50LmlzU2FtZShuZXh0TW9udGgsICdtb250aCcpLFxuICAgICAgICAgIGN1cnJlbnREYXk6IGN1cnJlbnQuaXNTYW1lKHRvZGF5LCAnZGF5JyksXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNEYXRlRGlzYWJsZWQoY3VycmVudCwgY29uZmlnKVxuICAgICAgICB9KTtcbiAgICAgICAgY3VycmVudC5hZGQoMSwgJ2RheScpO1xuXG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH0sIFtdKTtcblxuICAgIGRheXNPZkNhbGVuZGFyLmZvckVhY2goKGRheSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHdlZWtJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyA3KTtcblxuICAgICAgaWYgKCFtb250aEFycmF5W3dlZWtJbmRleF0pIHtcbiAgICAgICAgbW9udGhBcnJheS5wdXNoKFtdKTtcbiAgICAgIH1cblxuICAgICAgbW9udGhBcnJheVt3ZWVrSW5kZXhdLnB1c2goZGF5KTtcbiAgICB9KTtcblxuICAgIGlmICghY29uZmlnLnNob3dOZWFyTW9udGhEYXlzKSB7XG4gICAgICBtb250aEFycmF5ID0gdGhpcy5yZW1vdmVOZWFyTW9udGhXZWVrcyhtb250aCwgbW9udGhBcnJheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vbnRoQXJyYXk7XG4gIH1cblxuICBnZW5lcmF0ZVdlZWtkYXlzKGZpcnN0RGF5T2ZXZWVrOiBXZWVrRGF5cyk6IE1vbWVudFtdIHtcbiAgICBjb25zdCB3ZWVrZGF5TmFtZXM6IHtba2V5OiBzdHJpbmddOiBNb21lbnR9ID0ge1xuICAgICAgc3U6IG1vbWVudCgpLmRheSgwKSxcbiAgICAgIG1vOiBtb21lbnQoKS5kYXkoMSksXG4gICAgICB0dTogbW9tZW50KCkuZGF5KDIpLFxuICAgICAgd2U6IG1vbWVudCgpLmRheSgzKSxcbiAgICAgIHRoOiBtb21lbnQoKS5kYXkoNCksXG4gICAgICBmcjogbW9tZW50KCkuZGF5KDUpLFxuICAgICAgc2E6IG1vbWVudCgpLmRheSg2KVxuICAgIH07XG4gICAgY29uc3Qgd2Vla2RheXM6IE1vbWVudFtdID0gW107XG4gICAgY29uc3QgZGF5c01hcCA9IHRoaXMuZ2VuZXJhdGVEYXlzTWFwKGZpcnN0RGF5T2ZXZWVrKTtcblxuICAgIGZvciAoY29uc3QgZGF5S2V5IGluIGRheXNNYXApIHtcbiAgICAgIGlmIChkYXlzTWFwLmhhc093blByb3BlcnR5KGRheUtleSkpIHtcbiAgICAgICAgd2Vla2RheXNbZGF5c01hcFtkYXlLZXldXSA9IHdlZWtkYXlOYW1lc1tkYXlLZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB3ZWVrZGF5cztcbiAgfVxuXG4gIGlzRGF0ZURpc2FibGVkKGRhdGU6IE1vbWVudCwgY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCk6IGJvb2xlYW4ge1xuICAgIGlmIChjb25maWcuaXNEYXlEaXNhYmxlZENhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY29uZmlnLmlzRGF5RGlzYWJsZWRDYWxsYmFjayhkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1pbiAmJiBkYXRlLmlzQmVmb3JlKGNvbmZpZy5taW4sICdkYXknKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhKGNvbmZpZy5tYXggJiYgZGF0ZS5pc0FmdGVyKGNvbmZpZy5tYXgsICdkYXknKSk7XG4gIH1cblxuICAvLyB0b2RvOjogYWRkIHVuaXQgdGVzdHNcbiAgZ2V0SGVhZGVyTGFiZWwoY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCwgbW9udGg6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgaWYgKGNvbmZpZy5tb250aEZvcm1hdHRlcikge1xuICAgICAgcmV0dXJuIGNvbmZpZy5tb250aEZvcm1hdHRlcihtb250aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vbnRoLmZvcm1hdChjb25maWcubW9udGhGb3JtYXQpO1xuICB9XG5cbiAgLy8gdG9kbzo6IGFkZCB1bml0IHRlc3RzXG4gIHNob3VsZFNob3dMZWZ0KG1pbjogTW9tZW50LCBjdXJyZW50TW9udGhWaWV3OiBNb21lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbWluID8gbWluLmlzQmVmb3JlKGN1cnJlbnRNb250aFZpZXcsICdtb250aCcpIDogdHJ1ZTtcbiAgfVxuXG4gIC8vIHRvZG86OiBhZGQgdW5pdCB0ZXN0c1xuICBzaG91bGRTaG93UmlnaHQobWF4OiBNb21lbnQsIGN1cnJlbnRNb250aFZpZXc6IE1vbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtYXggPyBtYXguaXNBZnRlcihjdXJyZW50TW9udGhWaWV3LCAnbW9udGgnKSA6IHRydWU7XG4gIH1cblxuICBnZW5lcmF0ZURheXNJbmRleE1hcChmaXJzdERheU9mV2VlazogV2Vla0RheXMpIHtcbiAgICBjb25zdCBmaXJzdERheUluZGV4ID0gdGhpcy5EQVlTLmluZGV4T2YoZmlyc3REYXlPZldlZWspO1xuICAgIGNvbnN0IGRheXNBcnIgPSB0aGlzLkRBWVMuc2xpY2UoZmlyc3REYXlJbmRleCwgNykuY29uY2F0KHRoaXMuREFZUy5zbGljZSgwLCBmaXJzdERheUluZGV4KSk7XG4gICAgcmV0dXJuIGRheXNBcnIucmVkdWNlKChtYXAsIGRheSwgaW5kZXgpID0+IHtcbiAgICAgIG1hcFtpbmRleF0gPSBkYXk7XG5cbiAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgPHtba2V5OiBudW1iZXJdOiBzdHJpbmd9Pnt9KTtcbiAgfVxuXG4gIGdldE1vbnRoQ2FsZW5kYXJDb25maWcoY29tcG9uZW50Q29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCk6IElNb250aENhbGVuZGFyQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY2xlYXJVbmRlZmluZWQoe1xuICAgICAgbWluOiBjb21wb25lbnRDb25maWcubWluLFxuICAgICAgbWF4OiBjb21wb25lbnRDb25maWcubWF4LFxuICAgICAgZm9ybWF0OiBjb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgaXNOYXZIZWFkZXJCdG5DbGlja2FibGU6IHRydWUsXG4gICAgICBhbGxvd011bHRpU2VsZWN0OiBmYWxzZSxcbiAgICAgIGxvY2FsZTogY29tcG9uZW50Q29uZmlnLmxvY2FsZSxcbiAgICAgIHllYXJGb3JtYXQ6IGNvbXBvbmVudENvbmZpZy55ZWFyRm9ybWF0LFxuICAgICAgeWVhckZvcm1hdHRlcjogY29tcG9uZW50Q29uZmlnLnllYXJGb3JtYXR0ZXIsXG4gICAgICBtb250aEJ0bkZvcm1hdDogY29tcG9uZW50Q29uZmlnLm1vbnRoQnRuRm9ybWF0LFxuICAgICAgbW9udGhCdG5Gb3JtYXR0ZXI6IGNvbXBvbmVudENvbmZpZy5tb250aEJ0bkZvcm1hdHRlcixcbiAgICAgIG1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjazogY29tcG9uZW50Q29uZmlnLm1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjayxcbiAgICAgIG11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5OiBjb21wb25lbnRDb25maWcubXVsdGlwbGVZZWFyc05hdmlnYXRlQnksXG4gICAgICBzaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb246IGNvbXBvbmVudENvbmZpZy5zaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb24sXG4gICAgICBzaG93R29Ub0N1cnJlbnQ6IGNvbXBvbmVudENvbmZpZy5zaG93R29Ub0N1cnJlbnRcbiAgICB9KTtcbiAgfVxuXG4gIGdldERheUJ0blRleHQoY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCwgZGF5OiBNb21lbnQpOiBzdHJpbmcge1xuICAgIGlmIChjb25maWcuZGF5QnRuRm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gY29uZmlnLmRheUJ0bkZvcm1hdHRlcihkYXkpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXkuZm9ybWF0KGNvbmZpZy5kYXlCdG5Gb3JtYXQpO1xuICB9XG5cbiAgZ2V0RGF5QnRuQ3NzQ2xhc3MoY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCwgZGF5OiBNb21lbnQpOiBzdHJpbmcge1xuICAgIGlmIChjb25maWcuZGF5QnRuQ3NzQ2xhc3NDYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGNvbmZpZy5kYXlCdG5Dc3NDbGFzc0NhbGxiYWNrKGRheSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgZ2V0RGlzcGxheU1vZGUoY2FsZW5kYXJNb2RlRGlzcGxheUZpcnN0OiBDYWxlbmRhck1vZGUsIGN1cnJlbnRNb2RlOiBFQ2FsZW5kYXJNb2RlLCBtb250aElzU2VsZWN0OiBib29sZWFuKTogRUNhbGVuZGFyTW9kZSB7XG4gICAgaWYgKChjdXJyZW50TW9kZSA9PT0gRUNhbGVuZGFyTW9kZS5EYXkpICYmIChtb250aElzU2VsZWN0IHx8IGNhbGVuZGFyTW9kZURpc3BsYXlGaXJzdCA9PT0gJ2RheScpKSB7XG4gICAgICByZXR1cm4gRUNhbGVuZGFyTW9kZS5EYXk7XG4gICAgfSBlbHNlIGlmICgoY3VycmVudE1vZGUgPT09IEVDYWxlbmRhck1vZGUuTW9udGgpIHx8ICghbW9udGhJc1NlbGVjdCAmJiBjYWxlbmRhck1vZGVEaXNwbGF5Rmlyc3QgPT09ICdtb250aCcpKSB7XG4gICAgICByZXR1cm4gRUNhbGVuZGFyTW9kZS5Nb250aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN1cnJlbnRNb2RlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlTmVhck1vbnRoV2Vla3MoY3VycmVudE1vbnRoOiBNb21lbnQsIG1vbnRoQXJyYXk6IElEYXlbXVtdKTogSURheVtdW10ge1xuICAgIGlmIChtb250aEFycmF5W21vbnRoQXJyYXkubGVuZ3RoIC0gMV0uZmluZCgoZGF5KSA9PiBkYXkuZGF0ZS5pc1NhbWUoY3VycmVudE1vbnRoLCAnbW9udGgnKSkpIHtcbiAgICAgIHJldHVybiBtb250aEFycmF5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbW9udGhBcnJheS5zbGljZSgwLCAtMSk7XG4gICAgfVxuICB9XG59XG4iXX0=