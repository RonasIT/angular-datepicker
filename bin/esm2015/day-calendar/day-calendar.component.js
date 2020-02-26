import * as tslib_1 from "tslib";
var DayCalendarComponent_1;
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DayCalendarService } from './day-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
let DayCalendarComponent = DayCalendarComponent_1 = class DayCalendarComponent {
    constructor(dayCalendarService, utilsService, cd) {
        this.dayCalendarService = dayCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onMonthSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.CalendarMode = ECalendarMode;
        this.isInited = false;
        this.currentCalendarMode = ECalendarMode.Day;
        this.monthIsSelect = false;
        this._shouldShowCurrent = true;
        this.api = {
            moveCalendarsBy: this.moveCalendarsBy.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this),
            toggleCalendarMode: this.toggleCalendarMode.bind(this)
        };
    }
    get selected() {
        console.log(this._selected);
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        if (!selected.length) {
            this.monthIsSelect = false;
        }
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    get currentDateView() {
        return this._currentDateView;
    }
    get currentDisplayMode() {
        return this.dayCalendarService.getDisplayMode(this.config.calendarModeDisplayFirst, this.currentCalendarMode, this.monthIsSelect);
    }
    set currentDateView(current) {
        this._currentDateView = current.clone();
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
        this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
        this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.dayCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.weekdays = this.dayCalendarService
            .generateWeekdays(this.componentConfig.firstDayOfWeek);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
        this._shouldShowCurrent = this.shouldShowCurrent();
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
        }
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dayClicked(day) {
        this.selectedDate = day.selected;
        console.log(day);
        if (day.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(day);
    }
    getDayBtnText(day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    }
    getDayBtnCssClass(day) {
        const cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        const customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    }
    onLeftNavClick() {
        const from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        const to = this.currentDateView.clone();
        this.onLeftNav.emit({ from, to });
    }
    onRightNavClick() {
        const from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        const to = this.currentDateView.clone();
        this.onRightNav.emit({ from, to });
    }
    onMonthCalendarLeftClick(change) {
        this.onLeftNav.emit(change);
    }
    onMonthCalendarRightClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryLeftClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryRightClick(change) {
        this.onLeftNav.emit(change);
    }
    getWeekdayName(weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    }
    toggleCalendarMode(mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    }
    monthSelected(month) {
        console.log(month);
        this.currentDateView = month.date.clone();
        this.currentCalendarMode = ECalendarMode.Day;
        this.monthIsSelect = true;
        this.onMonthSelect.emit(month);
    }
    moveCalendarsBy(current, amount, granularity = 'month') {
        this.currentDateView = current.clone().add(amount, granularity);
        this.cd.markForCheck();
    }
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    }
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    }
    goToCurrent() {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.dayCalendarService.getConfig(config.previousValue);
            const currentConf = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf.locale);
                }
                this.selected.forEach(m => m.locale(currentConf.locale));
            }
        }
    }
};
DayCalendarComponent.ctorParameters = () => [
    { type: DayCalendarService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
tslib_1.__decorate([
    Input()
], DayCalendarComponent.prototype, "config", void 0);
tslib_1.__decorate([
    Input()
], DayCalendarComponent.prototype, "displayDate", void 0);
tslib_1.__decorate([
    Input()
], DayCalendarComponent.prototype, "minDate", void 0);
tslib_1.__decorate([
    Input()
], DayCalendarComponent.prototype, "maxDate", void 0);
tslib_1.__decorate([
    HostBinding('class'), Input()
], DayCalendarComponent.prototype, "theme", void 0);
tslib_1.__decorate([
    Output()
], DayCalendarComponent.prototype, "onSelect", void 0);
tslib_1.__decorate([
    Output()
], DayCalendarComponent.prototype, "onMonthSelect", void 0);
tslib_1.__decorate([
    Output()
], DayCalendarComponent.prototype, "onNavHeaderBtnClick", void 0);
tslib_1.__decorate([
    Output()
], DayCalendarComponent.prototype, "onGoToCurrent", void 0);
tslib_1.__decorate([
    Output()
], DayCalendarComponent.prototype, "onLeftNav", void 0);
tslib_1.__decorate([
    Output()
], DayCalendarComponent.prototype, "onRightNav", void 0);
DayCalendarComponent = DayCalendarComponent_1 = tslib_1.__decorate([
    Component({
        selector: 'dp-day-calendar',
        template: "<div *ngIf=\"currentDisplayMode === CalendarMode.Day\" class=\"dp-day-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode(CalendarMode.Month)\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      [isLabelClickable]=\"componentConfig.enableMonthSelector\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"_shouldShowCurrent\"\n      [showLeftNav]=\"showLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div [ngClass]=\"{'dp-hide-near-month': !componentConfig.showNearMonthDays}\"\n       class=\"dp-calendar-wrapper\">\n    <div class=\"dp-weekdays\">\n      <span *ngFor=\"let weekday of weekdays\"\n            [innerText]=\"getWeekdayName(weekday)\"\n            class=\"dp-calendar-weekday\">\n      </span>\n    </div>\n    <div *ngFor=\"let week of weeks\" class=\"dp-calendar-week\">\n      <span *ngIf=\"componentConfig.showWeekNumbers\"\n            [innerText]=\"week[0].date.isoWeek()\"\n            class=\"dp-week-number\">\n      </span>\n      <button (click)=\"dayClicked(day)\"\n              *ngFor=\"let day of week\"\n              [attr.data-date]=\"day.date.format(componentConfig.format)\"\n              [disabled]=\"day.disabled\"\n              [innerText]=\"getDayBtnText(day)\"\n              [ngClass]=\"getDayBtnCssClass(day)\"\n              class=\"dp-calendar-day\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n\n<dp-month-calendar\n    (onLeftNav)=\"onMonthCalendarLeftClick($event)\"\n    (onLeftSecondaryNav)=\"onMonthCalendarSecondaryLeftClick($event)\"\n    (onNavHeaderBtnClick)=\"toggleCalendarMode(CalendarMode.Day)\"\n    (onRightNav)=\"onMonthCalendarRightClick($event)\"\n    (onRightSecondaryNav)=\"onMonthCalendarSecondaryRightClick($event)\"\n    (onSelect)=\"monthSelected($event)\"\n    *ngIf=\"currentDisplayMode === CalendarMode.Month\"\n    [config]=\"monthCalendarConfig\"\n    [displayDate]=\"_currentDateView\"\n    [ngModel]=\"_selected\"\n    [theme]=\"theme\">\n</dp-month-calendar>\n",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            DayCalendarService,
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DayCalendarComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DayCalendarComponent_1),
                multi: true
            }
        ],
        styles: ["dp-day-calendar{display:inline-block}dp-day-calendar .dp-day-calendar-container{background:#fff}dp-day-calendar .dp-calendar-wrapper{box-sizing:border-box;border:1px solid #000}dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child{border-left:none}dp-day-calendar .dp-weekdays{font-size:15px;margin-bottom:5px}dp-day-calendar .dp-calendar-weekday{box-sizing:border-box;display:inline-block;width:30px;text-align:center;border-left:1px solid #000;border-bottom:1px solid #000}dp-day-calendar .dp-calendar-day{box-sizing:border-box;width:30px;height:30px;cursor:pointer}dp-day-calendar .dp-selected{background:#106cc8;color:#fff}dp-day-calendar .dp-next-month,dp-day-calendar .dp-prev-month{opacity:.5}dp-day-calendar .dp-hide-near-month .dp-next-month,dp-day-calendar .dp-hide-near-month .dp-prev-month{visibility:hidden}dp-day-calendar .dp-week-number{position:absolute;font-size:9px}dp-day-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;color:#7a7a7a;border:none}dp-day-calendar.dp-material .dp-calendar-wrapper{border:1px solid #e0e0e0}dp-day-calendar.dp-material .dp-calendar-day,dp-day-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:0}dp-day-calendar.dp-material .dp-calendar-day:hover,dp-day-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-day-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-day-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-day-calendar.dp-material .dp-current-day{border:1px solid #106cc8}"]
    })
], DayCalendarComponent);
export { DayCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ25FLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sWUFBWSxFQUNaLGFBQWEsRUFDYixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFJbkMsT0FBTyxFQUFxQyxhQUFhLEVBQUUsaUJBQWlCLEVBQStCLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEksT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBTXRFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQXNCeEIsSUFBYSxvQkFBb0IsNEJBQWpDLE1BQWEsb0JBQW9CO0lBMkUvQixZQUE0QixrQkFBc0MsRUFDdEMsWUFBMEIsRUFDMUIsRUFBcUI7UUFGckIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQWpDdkMsYUFBUSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xELGtCQUFhLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDekQsd0JBQW1CLEdBQWdDLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEUsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVB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QUFDLEVBQUUsS0FBSyxFQUFFO21EQUFlO0FBQ25DO0lBQVQsTUFBTSxFQUFFO3NEQUFtRDtBQUNsRDtJQUFULE1BQU0sRUFBRTsyREFBMEQ7QUFDekQ7SUFBVCxNQUFNLEVBQUU7aUVBQXVFO0FBQ3RFO0lBQVQsTUFBTSxFQUFFOzJEQUF3RDtBQUN2RDtJQUFULE1BQU0sRUFBRTt1REFBeUQ7QUFDeEQ7SUFBVCxNQUFNLEVBQUU7d0RBQTBEO0FBakR4RCxvQkFBb0I7SUFwQmhDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsOG1FQUEwQztRQUUxQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtRQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxTQUFTLEVBQUU7WUFDVCxrQkFBa0I7WUFDbEI7Z0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBb0IsQ0FBQztnQkFDbkQsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFvQixDQUFDO2dCQUNuRCxLQUFLLEVBQUUsSUFBSTthQUNaO1NBQ0Y7O0tBQ0YsQ0FBQztHQUNXLG9CQUFvQixDQW1UaEM7U0FuVFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRUNhbGVuZGFyVmFsdWUgfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUtZW51bSc7XG5pbXBvcnQgeyBTaW5nbGVDYWxlbmRhclZhbHVlIH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQgeyBFQ2FsZW5kYXJNb2RlIH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUtZW51bSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXlDYWxlbmRhclNlcnZpY2UgfSBmcm9tICcuL2RheS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIG1vbWVudE5zIGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBNb21lbnQsIHVuaXRPZlRpbWUgfSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgSURheUNhbGVuZGFyQ29uZmlnLCBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCB9IGZyb20gJy4vZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQgeyBJRGF5IH0gZnJvbSAnLi9kYXkubW9kZWwnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEZvcm1Db250cm9sLCBOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQ2FsZW5kYXJWYWx1ZSB9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQgeyBVdGlsc1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBJTW9udGhDYWxlbmRhckNvbmZpZyB9IGZyb20gJy4uL21vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLWNvbmZpZyc7XG5pbXBvcnQgeyBJTW9udGggfSBmcm9tICcuLi9tb250aC1jYWxlbmRhci9tb250aC5tb2RlbCc7XG5pbXBvcnQgeyBEYXRlVmFsaWRhdG9yIH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3ZhbGlkYXRvci50eXBlJztcbmltcG9ydCB7IElOYXZFdmVudCB9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvbmF2aWdhdGlvbi1ldmVudC5tb2RlbCc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudE5zO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC1kYXktY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2RheS1jYWxlbmRhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXktY2FsZW5kYXIuY29tcG9uZW50Lmxlc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIERheUNhbGVuZGFyU2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERheUNhbGVuZGFyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5Q2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRGF5Q2FsZW5kYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudFtdIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9zZWxlY3RlZCk7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkOiBNb21lbnRbXSkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG5cbiAgICBpZiAoIXNlbGVjdGVkLmxlbmd0aCkge1xuICAgICAgdGhpcy5tb250aElzU2VsZWN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc2VsZWN0ZWQpKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50RGF0ZVZpZXcoKTogTW9tZW50IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudERhdGVWaWV3O1xuICB9XG5cbiAgZ2V0IGN1cnJlbnREaXNwbGF5TW9kZSgpOiBFQ2FsZW5kYXJNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0RGlzcGxheU1vZGUoXG4gICAgICB0aGlzLmNvbmZpZy5jYWxlbmRhck1vZGVEaXNwbGF5Rmlyc3QsXG4gICAgICB0aGlzLmN1cnJlbnRDYWxlbmRhck1vZGUsXG4gICAgICB0aGlzLm1vbnRoSXNTZWxlY3RcbiAgICApO1xuICB9XG5cbiAgc2V0IGN1cnJlbnREYXRlVmlldyhjdXJyZW50OiBNb21lbnQpIHtcbiAgICB0aGlzLl9jdXJyZW50RGF0ZVZpZXcgPSBjdXJyZW50LmNsb25lKCk7XG4gICAgdGhpcy53ZWVrcyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVNb250aEFycmF5KHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMubmF2TGFiZWwgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXRIZWFkZXJMYWJlbCh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fY3VycmVudERhdGVWaWV3KTtcbiAgICB0aGlzLnNob3dMZWZ0TmF2ID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2Uuc2hvdWxkU2hvd0xlZnQodGhpcy5jb21wb25lbnRDb25maWcubWluLCB0aGlzLmN1cnJlbnREYXRlVmlldyk7XG4gICAgdGhpcy5zaG93UmlnaHROYXYgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5zaG91bGRTaG93UmlnaHQodGhpcy5jb21wb25lbnRDb25maWcubWF4LCB0aGlzLmN1cnJlbnREYXRlVmlldyk7XG4gIH1cbiAgO1xuXG4gIEBJbnB1dCgpIGNvbmZpZzogSURheUNhbGVuZGFyQ29uZmlnO1xuICBASW5wdXQoKSBkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWluRGF0ZTogTW9tZW50O1xuICBASW5wdXQoKSBtYXhEYXRlOiBNb21lbnQ7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxJRGF5PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTW9udGhTZWxlY3Q6IEV2ZW50RW1pdHRlcjxJTW9udGg+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25OYXZIZWFkZXJCdG5DbGljazogRXZlbnRFbWl0dGVyPEVDYWxlbmRhck1vZGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBDYWxlbmRhck1vZGUgPSBFQ2FsZW5kYXJNb2RlO1xuICBpc0luaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBjb21wb25lbnRDb25maWc6IElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsO1xuICB3ZWVrczogSURheVtdW107XG4gIHdlZWtkYXlzOiBNb21lbnRbXTtcbiAgaW5wdXRWYWx1ZTogQ2FsZW5kYXJWYWx1ZTtcbiAgaW5wdXRWYWx1ZVR5cGU6IEVDYWxlbmRhclZhbHVlO1xuICB2YWxpZGF0ZUZuOiBEYXRlVmFsaWRhdG9yO1xuICBjdXJyZW50Q2FsZW5kYXJNb2RlOiBFQ2FsZW5kYXJNb2RlID0gRUNhbGVuZGFyTW9kZS5EYXk7XG4gIG1vbnRoQ2FsZW5kYXJDb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnO1xuICBtb250aElzU2VsZWN0OiBib29sZWFuID0gZmFsc2U7XG4gIHNlbGVjdGVkRGF0ZTogYm9vbGVhbjtcbiAgX3Nob3VsZFNob3dDdXJyZW50OiBib29sZWFuID0gdHJ1ZTtcbiAgbmF2TGFiZWw6IHN0cmluZztcbiAgc2hvd0xlZnROYXY6IGJvb2xlYW47XG4gIHNob3dSaWdodE5hdjogYm9vbGVhbjtcbiAgYXBpID0ge1xuICAgIG1vdmVDYWxlbmRhcnNCeTogdGhpcy5tb3ZlQ2FsZW5kYXJzQnkuYmluZCh0aGlzKSxcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpLFxuICAgIHRvZ2dsZUNhbGVuZGFyTW9kZTogdGhpcy50b2dnbGVDYWxlbmRhck1vZGUuYmluZCh0aGlzKVxuICB9O1xuXG4gIF9zZWxlY3RlZDogTW9tZW50W107XG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZGF5Q2FsZW5kYXJTZXJ2aWNlOiBEYXlDYWxlbmRhclNlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pc0luaXRlZCA9IHRydWU7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbXBvbmVudENvbmZpZyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQgfHwgW107XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmRpc3BsYXlEYXRlXG4gICAgICA/IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudCh0aGlzLmRpc3BsYXlEYXRlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpLmNsb25lKClcbiAgICAgIDogdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldERlZmF1bHREaXNwbGF5RGF0ZShcbiAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgICk7XG4gICAgdGhpcy53ZWVrZGF5cyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVXZWVrZGF5cyh0aGlzLmNvbXBvbmVudENvbmZpZy5maXJzdERheU9mV2Vlayk7XG4gICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QpO1xuICAgIHRoaXMubW9udGhDYWxlbmRhckNvbmZpZyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldE1vbnRoQ2FsZW5kYXJDb25maWcodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMuX3Nob3VsZFNob3dDdXJyZW50ID0gdGhpcy5zaG91bGRTaG93Q3VycmVudCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICh0aGlzLmlzSW5pdGVkKSB7XG4gICAgICBjb25zdCB7bWluRGF0ZSwgbWF4RGF0ZSwgY29uZmlnfSA9IGNoYW5nZXM7XG5cbiAgICAgIHRoaXMuaGFuZGxlQ29uZmlnQ2hhbmdlKGNvbmZpZyk7XG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgaWYgKG1pbkRhdGUgfHwgbWF4RGF0ZSkge1xuICAgICAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgfVxuXG4gICAgdGhpcy53ZWVrcyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVNb250aEFycmF5KHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gIH1cblxuICBvbkNoYW5nZUNhbGxiYWNrKF86IGFueSkge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IGFueSB7XG4gICAgaWYgKHRoaXMubWluRGF0ZSB8fCB0aGlzLm1heERhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRm4oZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCkgPT4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh2YWx1ZTogTW9tZW50W10pOiBDYWxlbmRhclZhbHVlIHtcbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydEZyb21Nb21lbnRBcnJheShcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgIHZhbHVlLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy5pbnB1dFZhbHVlVHlwZVxuICAgICk7XG4gIH1cblxuICBpbml0VmFsaWRhdG9ycygpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm4gPSB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVWYWxpZGF0b3IoXG4gICAgICB7bWluRGF0ZTogdGhpcy5taW5EYXRlLCBtYXhEYXRlOiB0aGlzLm1heERhdGV9LFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgJ2RheSdcbiAgICApO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZCkpO1xuICB9XG5cbiAgZGF5Q2xpY2tlZChkYXk6IElEYXkpIHtcbiAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IGRheS5zZWxlY3RlZDtcbiAgICBjb25zb2xlLmxvZyhkYXkpXG5cbiAgICBpZiAoZGF5LnNlbGVjdGVkICYmICF0aGlzLmNvbXBvbmVudENvbmZpZy51blNlbGVjdE9uQ2xpY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgIC51cGRhdGVTZWxlY3RlZCh0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LCB0aGlzLnNlbGVjdGVkLCBkYXkpO1xuICAgIHRoaXMud2Vla3MgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlTW9udGhBcnJheSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMub25TZWxlY3QuZW1pdChkYXkpO1xuICB9XG5cbiAgZ2V0RGF5QnRuVGV4dChkYXk6IElEYXkpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXREYXlCdG5UZXh0KHRoaXMuY29tcG9uZW50Q29uZmlnLCBkYXkuZGF0ZSk7XG4gIH1cblxuICBnZXREYXlCdG5Dc3NDbGFzcyhkYXk6IElEYXkpOiB7W2tsYXNzOiBzdHJpbmddOiBib29sZWFufSB7XG4gICAgY29uc3QgY3NzQ2xhc3Nlczoge1trbGFzczogc3RyaW5nXTogYm9vbGVhbn0gPSB7XG4gICAgICAnZHAtc2VsZWN0ZWQnOiBkYXkuc2VsZWN0ZWQsXG4gICAgICAnZHAtY3VycmVudC1tb250aCc6IGRheS5jdXJyZW50TW9udGgsXG4gICAgICAnZHAtcHJldi1tb250aCc6IGRheS5wcmV2TW9udGgsXG4gICAgICAnZHAtbmV4dC1tb250aCc6IGRheS5uZXh0TW9udGgsXG4gICAgICAnZHAtY3VycmVudC1kYXknOiBkYXkuY3VycmVudERheVxuICAgIH07XG4gICAgY29uc3QgY3VzdG9tQ3NzQ2xhc3M6IHN0cmluZyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldERheUJ0bkNzc0NsYXNzKHRoaXMuY29tcG9uZW50Q29uZmlnLCBkYXkuZGF0ZSk7XG4gICAgaWYgKGN1c3RvbUNzc0NsYXNzKSB7XG4gICAgICBjc3NDbGFzc2VzW2N1c3RvbUNzc0NsYXNzXSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzc0NsYXNzZXM7XG4gIH1cblxuICBvbkxlZnROYXZDbGljaygpIHtcbiAgICBjb25zdCBmcm9tID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm1vdmVDYWxlbmRhcnNCeSh0aGlzLmN1cnJlbnREYXRlVmlldywgLTEsICdtb250aCcpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KHtmcm9tLCB0b30pO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKCkge1xuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMubW92ZUNhbGVuZGFyc0J5KHRoaXMuY3VycmVudERhdGVWaWV3LCAxLCAnbW9udGgnKTtcbiAgICBjb25zdCB0byA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJMZWZ0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJSaWdodENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhclNlY29uZGFyeUxlZnRDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25SaWdodE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvbk1vbnRoQ2FsZW5kYXJTZWNvbmRhcnlSaWdodENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgZ2V0V2Vla2RheU5hbWUod2Vla2RheTogTW9tZW50KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRDb25maWcud2Vla0RheUZvcm1hdHRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Q29uZmlnLndlZWtEYXlGb3JtYXR0ZXIod2Vla2RheS5kYXkoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdlZWtkYXkuZm9ybWF0KHRoaXMuY29tcG9uZW50Q29uZmlnLndlZWtEYXlGb3JtYXQpO1xuICB9XG5cbiAgdG9nZ2xlQ2FsZW5kYXJNb2RlKG1vZGU6IEVDYWxlbmRhck1vZGUpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50Q2FsZW5kYXJNb2RlICE9PSBtb2RlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRDYWxlbmRhck1vZGUgPSBtb2RlO1xuICAgICAgdGhpcy5vbk5hdkhlYWRlckJ0bkNsaWNrLmVtaXQobW9kZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG1vbnRoU2VsZWN0ZWQobW9udGg6IElNb250aCkge1xuICAgIGNvbnNvbGUubG9nKG1vbnRoKVxuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9udGguZGF0ZS5jbG9uZSgpO1xuICAgIHRoaXMuY3VycmVudENhbGVuZGFyTW9kZSA9IEVDYWxlbmRhck1vZGUuRGF5O1xuICAgIHRoaXMubW9udGhJc1NlbGVjdCA9IHRydWU7XG4gICAgdGhpcy5vbk1vbnRoU2VsZWN0LmVtaXQobW9udGgpO1xuICB9XG5cbiAgbW92ZUNhbGVuZGFyc0J5KGN1cnJlbnQ6IE1vbWVudCwgYW1vdW50OiBudW1iZXIsIGdyYW51bGFyaXR5OiB1bml0T2ZUaW1lLkJhc2UgPSAnbW9udGgnKSB7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBjdXJyZW50LmNsb25lKCkuYWRkKGFtb3VudCwgZ3JhbnVsYXJpdHkpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyh0bzogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIGlmICh0bykge1xuICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQodG8sIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCk7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHNob3VsZFNob3dDdXJyZW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5zaG91bGRTaG93Q3VycmVudChcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnNob3dHb1RvQ3VycmVudCxcbiAgICAgICdkYXknLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWF4XG4gICAgKTtcbiAgfVxuXG4gIGdvVG9DdXJyZW50KCkge1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9tZW50KCk7XG4gICAgdGhpcy5vbkdvVG9DdXJyZW50LmVtaXQoKTtcbiAgfVxuXG4gIGhhbmRsZUNvbmZpZ0NoYW5nZShjb25maWc6IFNpbXBsZUNoYW5nZSkge1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIGNvbnN0IHByZXZDb25mOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyhjb25maWcucHJldmlvdXNWYWx1ZSk7XG4gICAgICBjb25zdCBjdXJyZW50Q29uZjogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXRDb25maWcoY29uZmlnLmN1cnJlbnRWYWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLnV0aWxzU2VydmljZS5zaG91bGRSZXNldEN1cnJlbnRWaWV3KHByZXZDb25mLCBjdXJyZW50Q29uZikpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZDb25mLmxvY2FsZSAhPT0gY3VycmVudENvbmYubG9jYWxlKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnREYXRlVmlldykge1xuICAgICAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3LmxvY2FsZShjdXJyZW50Q29uZi5sb2NhbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZC5mb3JFYWNoKG0gPT4gbS5sb2NhbGUoY3VycmVudENvbmYubG9jYWxlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=