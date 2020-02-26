import * as tslib_1 from "tslib";
import { EventEmitter, Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
var moment = momentNs;
var DatePickerService = /** @class */ (function () {
    function DatePickerService(utilsService, timeSelectService, daytimeCalendarService) {
        this.utilsService = utilsService;
        this.timeSelectService = timeSelectService;
        this.daytimeCalendarService = daytimeCalendarService;
        this.onPickerClosed = new EventEmitter();
        this.defaultConfig = {
            closeOnSelect: true,
            closeOnSelectDelay: 100,
            format: 'DD-MM-YYYY',
            openOnFocus: true,
            openOnClick: true,
            onOpenDelay: 0,
            disableKeypress: false,
            showNearMonthDays: true,
            showWeekNumbers: false,
            enableMonthSelector: true,
            showGoToCurrent: true,
            locale: moment.locale(),
            hideOnOutsideClick: true
        };
    }
    // todo:: add unit tests
    DatePickerService.prototype.getConfig = function (config, mode) {
        if (mode === void 0) { mode = 'daytime'; }
        var _config = tslib_1.__assign({}, this.defaultConfig, { format: this.getDefaultFormatByMode(mode) }, this.utilsService.clearUndefined(config));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
            _config.closeOnSelect = false;
        }
        moment.locale(_config.locale);
        return _config;
    };
    DatePickerService.prototype.getDayConfigService = function (pickerConfig) {
        return {
            min: pickerConfig.min,
            max: pickerConfig.max,
            isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
            weekDayFormat: pickerConfig.weekDayFormat,
            weekDayFormatter: pickerConfig.weekDayFormatter,
            showNearMonthDays: pickerConfig.showNearMonthDays,
            showWeekNumbers: pickerConfig.showWeekNumbers,
            firstDayOfWeek: pickerConfig.firstDayOfWeek,
            format: pickerConfig.format,
            allowMultiSelect: pickerConfig.allowMultiSelect,
            monthFormat: pickerConfig.monthFormat,
            monthFormatter: pickerConfig.monthFormatter,
            enableMonthSelector: pickerConfig.enableMonthSelector,
            yearFormat: pickerConfig.yearFormat,
            yearFormatter: pickerConfig.yearFormatter,
            dayBtnFormat: pickerConfig.dayBtnFormat,
            dayBtnFormatter: pickerConfig.dayBtnFormatter,
            dayBtnCssClassCallback: pickerConfig.dayBtnCssClassCallback,
            monthBtnFormat: pickerConfig.monthBtnFormat,
            monthBtnFormatter: pickerConfig.monthBtnFormatter,
            monthBtnCssClassCallback: pickerConfig.monthBtnCssClassCallback,
            multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
            locale: pickerConfig.locale,
            returnedValueType: pickerConfig.returnedValueType,
            showGoToCurrent: pickerConfig.showGoToCurrent,
            unSelectOnClick: pickerConfig.unSelectOnClick,
            calendarModeDisplayFirst: pickerConfig.calendarModeDisplayFirst
        };
    };
    DatePickerService.prototype.getDayTimeConfigService = function (pickerConfig) {
        return this.daytimeCalendarService.getConfig(pickerConfig);
    };
    DatePickerService.prototype.getTimeConfigService = function (pickerConfig) {
        return this.timeSelectService.getConfig(pickerConfig);
    };
    DatePickerService.prototype.pickerClosed = function () {
        this.onPickerClosed.emit();
    };
    // todo:: add unit tests
    DatePickerService.prototype.isValidInputDateValue = function (value, config) {
        var _this = this;
        value = value ? value : '';
        var datesStrArr = this.utilsService.datesStringToStringArray(value);
        return datesStrArr.every(function (date) { return _this.utilsService.isDateValid(date, config.format); });
    };
    // todo:: add unit tests
    DatePickerService.prototype.convertInputValueToMomentArray = function (value, config) {
        value = value ? value : '';
        var datesStrArr = this.utilsService.datesStringToStringArray(value);
        return this.utilsService.convertToMomentArray(datesStrArr, config);
    };
    DatePickerService.prototype.getDefaultFormatByMode = function (mode) {
        switch (mode) {
            case 'day':
                return 'DD-MM-YYYY';
            case 'daytime':
                return 'DD-MM-YYYY HH:mm:ss';
            case 'time':
                return 'HH:mm:ss';
            case 'month':
                return 'MMM, YYYY';
        }
    };
    DatePickerService.ctorParameters = function () { return [
        { type: UtilsService },
        { type: TimeSelectService },
        { type: DayTimeCalendarService }
    ]; };
    DatePickerService = tslib_1.__decorate([
        Injectable()
    ], DatePickerService);
    return DatePickerService;
}());
export { DatePickerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRhdGUtcGlja2VyL2RhdGUtcGlja2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sS0FBSyxRQUFRLE1BQU0sUUFBUSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNyRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUl0RixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFHeEI7SUFrQkUsMkJBQW9CLFlBQTBCLEVBQzFCLGlCQUFvQyxFQUNwQyxzQkFBOEM7UUFGOUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBbkJ6RCxtQkFBYyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pELGtCQUFhLEdBQThCO1lBQ2pELGFBQWEsRUFBRSxJQUFJO1lBQ25CLGtCQUFrQixFQUFFLEdBQUc7WUFDdkIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsV0FBVyxFQUFFLENBQUM7WUFDZCxlQUFlLEVBQUUsS0FBSztZQUN0QixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLG1CQUFtQixFQUFFLElBQUk7WUFDekIsZUFBZSxFQUFFLElBQUk7WUFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdkIsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDO0lBS0YsQ0FBQztJQUVELHdCQUF3QjtJQUN4QixxQ0FBUyxHQUFULFVBQVUsTUFBeUIsRUFBRSxJQUE4QjtRQUE5QixxQkFBQSxFQUFBLGdCQUE4QjtRQUNqRSxJQUFNLE9BQU8sR0FBRyxxQkFDWCxJQUFJLENBQUMsYUFBYSxJQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FDNUMsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVoRixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDM0UsT0FBTyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDL0I7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsK0NBQW1CLEdBQW5CLFVBQW9CLFlBQStCO1FBQ2pELE9BQU87WUFDTCxHQUFHLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDckIsR0FBRyxFQUFFLFlBQVksQ0FBQyxHQUFHO1lBQ3JCLHFCQUFxQixFQUFFLFlBQVksQ0FBQyxxQkFBcUI7WUFDekQsYUFBYSxFQUFFLFlBQVksQ0FBQyxhQUFhO1lBQ3pDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxnQkFBZ0I7WUFDL0MsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLGlCQUFpQjtZQUNqRCxlQUFlLEVBQUUsWUFBWSxDQUFDLGVBQWU7WUFDN0MsY0FBYyxFQUFFLFlBQVksQ0FBQyxjQUFjO1lBQzNDLE1BQU0sRUFBRSxZQUFZLENBQUMsTUFBTTtZQUMzQixnQkFBZ0IsRUFBRSxZQUFZLENBQUMsZ0JBQWdCO1lBQy9DLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVztZQUNyQyxjQUFjLEVBQUUsWUFBWSxDQUFDLGNBQWM7WUFDM0MsbUJBQW1CLEVBQUUsWUFBWSxDQUFDLG1CQUFtQjtZQUNyRCxVQUFVLEVBQUUsWUFBWSxDQUFDLFVBQVU7WUFDbkMsYUFBYSxFQUFFLFlBQVksQ0FBQyxhQUFhO1lBQ3pDLFlBQVksRUFBRSxZQUFZLENBQUMsWUFBWTtZQUN2QyxlQUFlLEVBQUUsWUFBWSxDQUFDLGVBQWU7WUFDN0Msc0JBQXNCLEVBQUUsWUFBWSxDQUFDLHNCQUFzQjtZQUMzRCxjQUFjLEVBQUUsWUFBWSxDQUFDLGNBQWM7WUFDM0MsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLGlCQUFpQjtZQUNqRCx3QkFBd0IsRUFBRSxZQUFZLENBQUMsd0JBQXdCO1lBQy9ELHVCQUF1QixFQUFFLFlBQVksQ0FBQyx1QkFBdUI7WUFDN0QsMkJBQTJCLEVBQUUsWUFBWSxDQUFDLDJCQUEyQjtZQUNyRSxNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU07WUFDM0IsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLGlCQUFpQjtZQUNqRCxlQUFlLEVBQUUsWUFBWSxDQUFDLGVBQWU7WUFDN0MsZUFBZSxFQUFFLFlBQVksQ0FBQyxlQUFlO1lBQzdDLHdCQUF3QixFQUFFLFlBQVksQ0FBQyx3QkFBd0I7U0FDaEUsQ0FBQztJQUNKLENBQUM7SUFFRCxtREFBdUIsR0FBdkIsVUFBd0IsWUFBK0I7UUFDckQsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxnREFBb0IsR0FBcEIsVUFBcUIsWUFBK0I7UUFDbEQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCx3Q0FBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLGlEQUFxQixHQUFyQixVQUFzQixLQUFhLEVBQUUsTUFBeUI7UUFBOUQsaUJBS0M7UUFKQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzQixJQUFNLFdBQVcsR0FBYSxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhGLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQWxELENBQWtELENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLDBEQUE4QixHQUE5QixVQUErQixLQUFhLEVBQUUsTUFBeUI7UUFDckUsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0IsSUFBTSxXQUFXLEdBQWEsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVoRixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTyxrREFBc0IsR0FBOUIsVUFBK0IsSUFBa0I7UUFDL0MsUUFBUSxJQUFJLEVBQUU7WUFDWixLQUFLLEtBQUs7Z0JBQ1IsT0FBTyxZQUFZLENBQUM7WUFDdEIsS0FBSyxTQUFTO2dCQUNaLE9BQU8scUJBQXFCLENBQUM7WUFDL0IsS0FBSyxNQUFNO2dCQUNULE9BQU8sVUFBVSxDQUFDO1lBQ3BCLEtBQUssT0FBTztnQkFDVixPQUFPLFdBQVcsQ0FBQztTQUN0QjtJQUNILENBQUM7O2dCQWhHaUMsWUFBWTtnQkFDUCxpQkFBaUI7Z0JBQ1osc0JBQXNCOztJQXBCdkQsaUJBQWlCO1FBRDdCLFVBQVUsRUFBRTtPQUNBLGlCQUFpQixDQW1IN0I7SUFBRCx3QkFBQztDQUFBLEFBbkhELElBbUhDO1NBbkhZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SURhdGVQaWNrZXJDb25maWcsIElEYXRlUGlja2VyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vZGF0ZS1waWNrZXItY29uZmlnLm1vZGVsJztcbmltcG9ydCAqIGFzIG1vbWVudE5zIGZyb20gJ21vbWVudCc7XG5pbXBvcnQge01vbWVudH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7VXRpbHNTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtUaW1lU2VsZWN0U2VydmljZX0gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3Quc2VydmljZSc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4uL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtJVGltZVNlbGVjdENvbmZpZ30gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7Q2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZSc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudE5zO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGF0ZVBpY2tlclNlcnZpY2Uge1xuICByZWFkb25seSBvblBpY2tlckNsb3NlZDogRXZlbnRFbWl0dGVyPG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIGRlZmF1bHRDb25maWc6IElEYXRlUGlja2VyQ29uZmlnSW50ZXJuYWwgPSB7XG4gICAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgICBjbG9zZU9uU2VsZWN0RGVsYXk6IDEwMCxcbiAgICBmb3JtYXQ6ICdERC1NTS1ZWVlZJyxcbiAgICBvcGVuT25Gb2N1czogdHJ1ZSxcbiAgICBvcGVuT25DbGljazogdHJ1ZSxcbiAgICBvbk9wZW5EZWxheTogMCxcbiAgICBkaXNhYmxlS2V5cHJlc3M6IGZhbHNlLFxuICAgIHNob3dOZWFyTW9udGhEYXlzOiB0cnVlLFxuICAgIHNob3dXZWVrTnVtYmVyczogZmFsc2UsXG4gICAgZW5hYmxlTW9udGhTZWxlY3RvcjogdHJ1ZSxcbiAgICBzaG93R29Ub0N1cnJlbnQ6IHRydWUsXG4gICAgbG9jYWxlOiBtb21lbnQubG9jYWxlKCksXG4gICAgaGlkZU9uT3V0c2lkZUNsaWNrOiB0cnVlXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aW1lU2VsZWN0U2VydmljZTogVGltZVNlbGVjdFNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgZGF5dGltZUNhbGVuZGFyU2VydmljZTogRGF5VGltZUNhbGVuZGFyU2VydmljZSkge1xuICB9XG5cbiAgLy8gdG9kbzo6IGFkZCB1bml0IHRlc3RzXG4gIGdldENvbmZpZyhjb25maWc6IElEYXRlUGlja2VyQ29uZmlnLCBtb2RlOiBDYWxlbmRhck1vZGUgPSAnZGF5dGltZScpOiBJRGF0ZVBpY2tlckNvbmZpZ0ludGVybmFsIHtcbiAgICBjb25zdCBfY29uZmlnID0gPElEYXRlUGlja2VyQ29uZmlnSW50ZXJuYWw+e1xuICAgICAgLi4udGhpcy5kZWZhdWx0Q29uZmlnLFxuICAgICAgZm9ybWF0OiB0aGlzLmdldERlZmF1bHRGb3JtYXRCeU1vZGUobW9kZSksXG4gICAgICAuLi50aGlzLnV0aWxzU2VydmljZS5jbGVhclVuZGVmaW5lZChjb25maWcpXG4gICAgfTtcblxuICAgIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRQcm9wc1RvTW9tZW50KF9jb25maWcsIF9jb25maWcuZm9ybWF0LCBbJ21pbicsICdtYXgnXSk7XG5cbiAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5hbGxvd011bHRpU2VsZWN0ICYmIGNvbmZpZy5jbG9zZU9uU2VsZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIF9jb25maWcuY2xvc2VPblNlbGVjdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG1vbWVudC5sb2NhbGUoX2NvbmZpZy5sb2NhbGUpO1xuXG4gICAgcmV0dXJuIF9jb25maWc7XG4gIH1cblxuICBnZXREYXlDb25maWdTZXJ2aWNlKHBpY2tlckNvbmZpZzogSURhdGVQaWNrZXJDb25maWcpOiBJRGF5Q2FsZW5kYXJDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBtaW46IHBpY2tlckNvbmZpZy5taW4sXG4gICAgICBtYXg6IHBpY2tlckNvbmZpZy5tYXgsXG4gICAgICBpc0RheURpc2FibGVkQ2FsbGJhY2s6IHBpY2tlckNvbmZpZy5pc0RheURpc2FibGVkQ2FsbGJhY2ssXG4gICAgICB3ZWVrRGF5Rm9ybWF0OiBwaWNrZXJDb25maWcud2Vla0RheUZvcm1hdCxcbiAgICAgIHdlZWtEYXlGb3JtYXR0ZXI6IHBpY2tlckNvbmZpZy53ZWVrRGF5Rm9ybWF0dGVyLFxuICAgICAgc2hvd05lYXJNb250aERheXM6IHBpY2tlckNvbmZpZy5zaG93TmVhck1vbnRoRGF5cyxcbiAgICAgIHNob3dXZWVrTnVtYmVyczogcGlja2VyQ29uZmlnLnNob3dXZWVrTnVtYmVycyxcbiAgICAgIGZpcnN0RGF5T2ZXZWVrOiBwaWNrZXJDb25maWcuZmlyc3REYXlPZldlZWssXG4gICAgICBmb3JtYXQ6IHBpY2tlckNvbmZpZy5mb3JtYXQsXG4gICAgICBhbGxvd011bHRpU2VsZWN0OiBwaWNrZXJDb25maWcuYWxsb3dNdWx0aVNlbGVjdCxcbiAgICAgIG1vbnRoRm9ybWF0OiBwaWNrZXJDb25maWcubW9udGhGb3JtYXQsXG4gICAgICBtb250aEZvcm1hdHRlcjogcGlja2VyQ29uZmlnLm1vbnRoRm9ybWF0dGVyLFxuICAgICAgZW5hYmxlTW9udGhTZWxlY3RvcjogcGlja2VyQ29uZmlnLmVuYWJsZU1vbnRoU2VsZWN0b3IsXG4gICAgICB5ZWFyRm9ybWF0OiBwaWNrZXJDb25maWcueWVhckZvcm1hdCxcbiAgICAgIHllYXJGb3JtYXR0ZXI6IHBpY2tlckNvbmZpZy55ZWFyRm9ybWF0dGVyLFxuICAgICAgZGF5QnRuRm9ybWF0OiBwaWNrZXJDb25maWcuZGF5QnRuRm9ybWF0LFxuICAgICAgZGF5QnRuRm9ybWF0dGVyOiBwaWNrZXJDb25maWcuZGF5QnRuRm9ybWF0dGVyLFxuICAgICAgZGF5QnRuQ3NzQ2xhc3NDYWxsYmFjazogcGlja2VyQ29uZmlnLmRheUJ0bkNzc0NsYXNzQ2FsbGJhY2ssXG4gICAgICBtb250aEJ0bkZvcm1hdDogcGlja2VyQ29uZmlnLm1vbnRoQnRuRm9ybWF0LFxuICAgICAgbW9udGhCdG5Gb3JtYXR0ZXI6IHBpY2tlckNvbmZpZy5tb250aEJ0bkZvcm1hdHRlcixcbiAgICAgIG1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjazogcGlja2VyQ29uZmlnLm1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjayxcbiAgICAgIG11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5OiBwaWNrZXJDb25maWcubXVsdGlwbGVZZWFyc05hdmlnYXRlQnksXG4gICAgICBzaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb246IHBpY2tlckNvbmZpZy5zaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb24sXG4gICAgICBsb2NhbGU6IHBpY2tlckNvbmZpZy5sb2NhbGUsXG4gICAgICByZXR1cm5lZFZhbHVlVHlwZTogcGlja2VyQ29uZmlnLnJldHVybmVkVmFsdWVUeXBlLFxuICAgICAgc2hvd0dvVG9DdXJyZW50OiBwaWNrZXJDb25maWcuc2hvd0dvVG9DdXJyZW50LFxuICAgICAgdW5TZWxlY3RPbkNsaWNrOiBwaWNrZXJDb25maWcudW5TZWxlY3RPbkNsaWNrLFxuICAgICAgY2FsZW5kYXJNb2RlRGlzcGxheUZpcnN0OiBwaWNrZXJDb25maWcuY2FsZW5kYXJNb2RlRGlzcGxheUZpcnN0XG4gICAgfTtcbiAgfVxuXG4gIGdldERheVRpbWVDb25maWdTZXJ2aWNlKHBpY2tlckNvbmZpZzogSURhdGVQaWNrZXJDb25maWcpOiBJVGltZVNlbGVjdENvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuZGF5dGltZUNhbGVuZGFyU2VydmljZS5nZXRDb25maWcocGlja2VyQ29uZmlnKTtcbiAgfVxuXG4gIGdldFRpbWVDb25maWdTZXJ2aWNlKHBpY2tlckNvbmZpZzogSURhdGVQaWNrZXJDb25maWcpOiBJVGltZVNlbGVjdENvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0Q29uZmlnKHBpY2tlckNvbmZpZyk7XG4gIH1cblxuICBwaWNrZXJDbG9zZWQoKSB7XG4gICAgdGhpcy5vblBpY2tlckNsb3NlZC5lbWl0KCk7XG4gIH1cblxuICAvLyB0b2RvOjogYWRkIHVuaXQgdGVzdHNcbiAgaXNWYWxpZElucHV0RGF0ZVZhbHVlKHZhbHVlOiBzdHJpbmcsIGNvbmZpZzogSURhdGVQaWNrZXJDb25maWcpOiBib29sZWFuIHtcbiAgICB2YWx1ZSA9IHZhbHVlID8gdmFsdWUgOiAnJztcbiAgICBjb25zdCBkYXRlc1N0ckFycjogc3RyaW5nW10gPSB0aGlzLnV0aWxzU2VydmljZS5kYXRlc1N0cmluZ1RvU3RyaW5nQXJyYXkodmFsdWUpO1xuXG4gICAgcmV0dXJuIGRhdGVzU3RyQXJyLmV2ZXJ5KGRhdGUgPT4gdGhpcy51dGlsc1NlcnZpY2UuaXNEYXRlVmFsaWQoZGF0ZSwgY29uZmlnLmZvcm1hdCkpO1xuICB9XG5cbiAgLy8gdG9kbzo6IGFkZCB1bml0IHRlc3RzXG4gIGNvbnZlcnRJbnB1dFZhbHVlVG9Nb21lbnRBcnJheSh2YWx1ZTogc3RyaW5nLCBjb25maWc6IElEYXRlUGlja2VyQ29uZmlnKTogTW9tZW50W10ge1xuICAgIHZhbHVlID0gdmFsdWUgPyB2YWx1ZSA6ICcnO1xuICAgIGNvbnN0IGRhdGVzU3RyQXJyOiBzdHJpbmdbXSA9IHRoaXMudXRpbHNTZXJ2aWNlLmRhdGVzU3RyaW5nVG9TdHJpbmdBcnJheSh2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50QXJyYXkoZGF0ZXNTdHJBcnIsIGNvbmZpZyk7XG4gIH1cblxuICBwcml2YXRlIGdldERlZmF1bHRGb3JtYXRCeU1vZGUobW9kZTogQ2FsZW5kYXJNb2RlKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgIHJldHVybiAnREQtTU0tWVlZWSc7XG4gICAgICBjYXNlICdkYXl0aW1lJzpcbiAgICAgICAgcmV0dXJuICdERC1NTS1ZWVlZIEhIOm1tOnNzJztcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICByZXR1cm4gJ0hIOm1tOnNzJztcbiAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgcmV0dXJuICdNTU0sIFlZWVknO1xuICAgIH1cbiAgfVxufVxuIl19