import * as tslib_1 from "tslib";
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DayCalendarService } from './day-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
var moment = momentNs;
var DayCalendarComponent = /** @class */ (function () {
    function DayCalendarComponent(dayCalendarService, utilsService, cd) {
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
    DayCalendarComponent_1 = DayCalendarComponent;
    Object.defineProperty(DayCalendarComponent.prototype, "selected", {
        get: function () {
            console.log(this._selected);
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            if (!selected.length) {
                this.monthIsSelect = false;
            }
            this.onChangeCallback(this.processOnChangeCallback(selected));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DayCalendarComponent.prototype, "currentDateView", {
        get: function () {
            return this._currentDateView;
        },
        set: function (current) {
            this._currentDateView = current.clone();
            this.weeks = this.dayCalendarService
                .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
            this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
            this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
            this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DayCalendarComponent.prototype, "currentDisplayMode", {
        get: function () {
            return this.dayCalendarService.getDisplayMode(this.config.calendarModeDisplayFirst, this.currentCalendarMode, this.monthIsSelect);
        },
        enumerable: true,
        configurable: true
    });
    ;
    DayCalendarComponent.prototype.ngOnInit = function () {
        this.isInited = true;
        this.init();
        this.initValidators();
    };
    DayCalendarComponent.prototype.init = function () {
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
    };
    DayCalendarComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInited) {
            var minDate = changes.minDate, maxDate = changes.maxDate, config = changes.config;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    };
    DayCalendarComponent.prototype.writeValue = function (value) {
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
    };
    DayCalendarComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DayCalendarComponent.prototype.onChangeCallback = function (_) {
    };
    DayCalendarComponent.prototype.registerOnTouched = function (fn) {
    };
    DayCalendarComponent.prototype.validate = function (formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return function () { return null; };
        }
    };
    DayCalendarComponent.prototype.processOnChangeCallback = function (value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    };
    DayCalendarComponent.prototype.initValidators = function () {
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    };
    DayCalendarComponent.prototype.dayClicked = function (day) {
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
    };
    DayCalendarComponent.prototype.getDayBtnText = function (day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    };
    DayCalendarComponent.prototype.getDayBtnCssClass = function (day) {
        var cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        var customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    };
    DayCalendarComponent.prototype.onLeftNavClick = function () {
        var from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        var to = this.currentDateView.clone();
        this.onLeftNav.emit({ from: from, to: to });
    };
    DayCalendarComponent.prototype.onRightNavClick = function () {
        var from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        var to = this.currentDateView.clone();
        this.onRightNav.emit({ from: from, to: to });
    };
    DayCalendarComponent.prototype.onMonthCalendarLeftClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DayCalendarComponent.prototype.onMonthCalendarRightClick = function (change) {
        this.onRightNav.emit(change);
    };
    DayCalendarComponent.prototype.onMonthCalendarSecondaryLeftClick = function (change) {
        this.onRightNav.emit(change);
    };
    DayCalendarComponent.prototype.onMonthCalendarSecondaryRightClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DayCalendarComponent.prototype.getWeekdayName = function (weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    };
    DayCalendarComponent.prototype.toggleCalendarMode = function (mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    };
    DayCalendarComponent.prototype.monthSelected = function (month) {
        console.log(month);
        this.currentDateView = month.date.clone();
        this.currentCalendarMode = ECalendarMode.Day;
        this.monthIsSelect = true;
        this.onMonthSelect.emit(month);
    };
    DayCalendarComponent.prototype.moveCalendarsBy = function (current, amount, granularity) {
        if (granularity === void 0) { granularity = 'month'; }
        this.currentDateView = current.clone().add(amount, granularity);
        this.cd.markForCheck();
    };
    DayCalendarComponent.prototype.moveCalendarTo = function (to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    };
    DayCalendarComponent.prototype.shouldShowCurrent = function () {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    };
    DayCalendarComponent.prototype.goToCurrent = function () {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    };
    DayCalendarComponent.prototype.handleConfigChange = function (config) {
        if (config) {
            var prevConf = this.dayCalendarService.getConfig(config.previousValue);
            var currentConf_1 = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf_1)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf_1.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf_1.locale);
                }
                this.selected.forEach(function (m) { return m.locale(currentConf_1.locale); });
            }
        }
    };
    var DayCalendarComponent_1;
    DayCalendarComponent.ctorParameters = function () { return [
        { type: DayCalendarService },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
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
                    useExisting: forwardRef(function () { return DayCalendarComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return DayCalendarComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-day-calendar{display:inline-block}dp-day-calendar .dp-day-calendar-container{background:#fff}dp-day-calendar .dp-calendar-wrapper{box-sizing:border-box;border:1px solid #000}dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child{border-left:none}dp-day-calendar .dp-weekdays{font-size:15px;margin-bottom:5px}dp-day-calendar .dp-calendar-weekday{box-sizing:border-box;display:inline-block;width:30px;text-align:center;border-left:1px solid #000;border-bottom:1px solid #000}dp-day-calendar .dp-calendar-day{box-sizing:border-box;width:30px;height:30px;cursor:pointer}dp-day-calendar .dp-selected{background:#106cc8;color:#fff}dp-day-calendar .dp-next-month,dp-day-calendar .dp-prev-month{opacity:.5}dp-day-calendar .dp-hide-near-month .dp-next-month,dp-day-calendar .dp-hide-near-month .dp-prev-month{visibility:hidden}dp-day-calendar .dp-week-number{position:absolute;font-size:9px}dp-day-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;color:#7a7a7a;border:none}dp-day-calendar.dp-material .dp-calendar-wrapper{border:1px solid #e0e0e0}dp-day-calendar.dp-material .dp-calendar-day,dp-day-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:0}dp-day-calendar.dp-material .dp-calendar-day:hover,dp-day-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-day-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-day-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-day-calendar.dp-material .dp-current-day{border:1px solid #106cc8}"]
        })
    ], DayCalendarComponent);
    return DayCalendarComponent;
}());
export { DayCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkUsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEVBQ1osYUFBYSxFQUNiLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEtBQUssUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUluQyxPQUFPLEVBQXFDLGFBQWEsRUFBRSxpQkFBaUIsRUFBK0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsSSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFNdEUsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBc0J4QjtJQTJFRSw4QkFBNEIsa0JBQXNDLEVBQ3RDLFlBQTBCLEVBQzFCLEVBQXFCO1FBRnJCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFqQ3ZDLGFBQVEsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNsRCxrQkFBYSxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pELHdCQUFtQixHQUFnQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RFLGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkQsY0FBUyxHQUE0QixJQUFJLFlB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bXBvcnQgeyBFQ2FsZW5kYXJWYWx1ZSB9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZS1lbnVtJztcbmltcG9ydCB7IFNpbmdsZUNhbGVuZGFyVmFsdWUgfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7IEVDYWxlbmRhck1vZGUgfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZS1lbnVtJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERheUNhbGVuZGFyU2VydmljZSB9IGZyb20gJy4vZGF5LWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgbW9tZW50TnMgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IE1vbWVudCwgdW5pdE9mVGltZSB9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBJRGF5Q2FsZW5kYXJDb25maWcsIElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsIH0gZnJvbSAnLi9kYXktY2FsZW5kYXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7IElEYXkgfSBmcm9tICcuL2RheS5tb2RlbCc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUNvbnRyb2wsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDYWxlbmRhclZhbHVlIH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7IFV0aWxzU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IElNb250aENhbGVuZGFyQ29uZmlnIH0gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXItY29uZmlnJztcbmltcG9ydCB7IElNb250aCB9IGZyb20gJy4uL21vbnRoLWNhbGVuZGFyL21vbnRoLm1vZGVsJztcbmltcG9ydCB7IERhdGVWYWxpZGF0b3IgfSBmcm9tICcuLi9jb21tb24vdHlwZXMvdmFsaWRhdG9yLnR5cGUnO1xuaW1wb3J0IHsgSU5hdkV2ZW50IH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLWRheS1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RheS1jYWxlbmRhci5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF5Q2FsZW5kYXJTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5Q2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXlDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXlDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcblxuICBnZXQgc2VsZWN0ZWQoKTogTW9tZW50W10ge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX3NlbGVjdGVkKTtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudFtdKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcblxuICAgIGlmICghc2VsZWN0ZWQubGVuZ3RoKSB7XG4gICAgICB0aGlzLm1vbnRoSXNTZWxlY3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZCkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnREYXRlVmlldygpOiBNb21lbnQge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50RGF0ZVZpZXc7XG4gIH1cblxuICBnZXQgY3VycmVudERpc3BsYXlNb2RlKCk6IEVDYWxlbmRhck1vZGUge1xuICAgIHJldHVybiB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXREaXNwbGF5TW9kZShcbiAgICAgIHRoaXMuY29uZmlnLmNhbGVuZGFyTW9kZURpc3BsYXlGaXJzdCxcbiAgICAgIHRoaXMuY3VycmVudENhbGVuZGFyTW9kZSxcbiAgICAgIHRoaXMubW9udGhJc1NlbGVjdFxuICAgICk7XG4gIH1cblxuICBzZXQgY3VycmVudERhdGVWaWV3KGN1cnJlbnQ6IE1vbWVudCkge1xuICAgIHRoaXMuX2N1cnJlbnREYXRlVmlldyA9IGN1cnJlbnQuY2xvbmUoKTtcbiAgICB0aGlzLndlZWtzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZU1vbnRoQXJyYXkodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX2N1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5uYXZMYWJlbCA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldEhlYWRlckxhYmVsKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9jdXJyZW50RGF0ZVZpZXcpO1xuICAgIHRoaXMuc2hvd0xlZnROYXYgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5zaG91bGRTaG93TGVmdCh0aGlzLmNvbXBvbmVudENvbmZpZy5taW4sIHRoaXMuY3VycmVudERhdGVWaWV3KTtcbiAgICB0aGlzLnNob3dSaWdodE5hdiA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLnNob3VsZFNob3dSaWdodCh0aGlzLmNvbXBvbmVudENvbmZpZy5tYXgsIHRoaXMuY3VycmVudERhdGVWaWV3KTtcbiAgfVxuICA7XG5cbiAgQElucHV0KCkgY29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWc7XG4gIEBJbnB1dCgpIGRpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5EYXRlOiBNb21lbnQ7XG4gIEBJbnB1dCgpIG1heERhdGU6IE1vbWVudDtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElEYXk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Nb250aFNlbGVjdDogRXZlbnRFbWl0dGVyPElNb250aD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbk5hdkhlYWRlckJ0bkNsaWNrOiBFdmVudEVtaXR0ZXI8RUNhbGVuZGFyTW9kZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIENhbGVuZGFyTW9kZSA9IEVDYWxlbmRhck1vZGU7XG4gIGlzSW5pdGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGNvbXBvbmVudENvbmZpZzogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWw7XG4gIHdlZWtzOiBJRGF5W11bXTtcbiAgd2Vla2RheXM6IE1vbWVudFtdO1xuICBpbnB1dFZhbHVlOiBDYWxlbmRhclZhbHVlO1xuICBpbnB1dFZhbHVlVHlwZTogRUNhbGVuZGFyVmFsdWU7XG4gIHZhbGlkYXRlRm46IERhdGVWYWxpZGF0b3I7XG4gIGN1cnJlbnRDYWxlbmRhck1vZGU6IEVDYWxlbmRhck1vZGUgPSBFQ2FsZW5kYXJNb2RlLkRheTtcbiAgbW9udGhDYWxlbmRhckNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWc7XG4gIG1vbnRoSXNTZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2VsZWN0ZWREYXRlOiBib29sZWFuO1xuICBfc2hvdWxkU2hvd0N1cnJlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuICBuYXZMYWJlbDogc3RyaW5nO1xuICBzaG93TGVmdE5hdjogYm9vbGVhbjtcbiAgc2hvd1JpZ2h0TmF2OiBib29sZWFuO1xuICBhcGkgPSB7XG4gICAgbW92ZUNhbGVuZGFyc0J5OiB0aGlzLm1vdmVDYWxlbmRhcnNCeS5iaW5kKHRoaXMpLFxuICAgIG1vdmVDYWxlbmRhclRvOiB0aGlzLm1vdmVDYWxlbmRhclRvLmJpbmQodGhpcyksXG4gICAgdG9nZ2xlQ2FsZW5kYXJNb2RlOiB0aGlzLnRvZ2dsZUNhbGVuZGFyTW9kZS5iaW5kKHRoaXMpXG4gIH07XG5cbiAgX3NlbGVjdGVkOiBNb21lbnRbXTtcbiAgX2N1cnJlbnREYXRlVmlldzogTW9tZW50O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBkYXlDYWxlbmRhclNlcnZpY2U6IERheUNhbGVuZGFyU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmlzSW5pdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZCB8fCBbXTtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMuZGlzcGxheURhdGVcbiAgICAgID8gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50KHRoaXMuZGlzcGxheURhdGUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCkuY2xvbmUoKVxuICAgICAgOiB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0RGVmYXVsdERpc3BsYXlEYXRlKFxuICAgICAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3LFxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW5cbiAgICAgICAgKTtcbiAgICB0aGlzLndlZWtkYXlzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZVdlZWtkYXlzKHRoaXMuY29tcG9uZW50Q29uZmlnLmZpcnN0RGF5T2ZXZWVrKTtcbiAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2UuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCk7XG4gICAgdGhpcy5tb250aENhbGVuZGFyQ29uZmlnID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0TW9udGhDYWxlbmRhckNvbmZpZyh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5fc2hvdWxkU2hvd0N1cnJlbnQgPSB0aGlzLnNob3VsZFNob3dDdXJyZW50KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHRoaXMuaXNJbml0ZWQpIHtcbiAgICAgIGNvbnN0IHttaW5EYXRlLCBtYXhEYXRlLCBjb25maWd9ID0gY2hhbmdlcztcblxuICAgICAgdGhpcy5oYW5kbGVDb25maWdDaGFuZ2UoY29uZmlnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICBpZiAobWluRGF0ZSB8fCBtYXhEYXRlKSB7XG4gICAgICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuY29udmVydFRvTW9tZW50QXJyYXkodmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLndlZWtzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZU1vbnRoQXJyYXkodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55KSB7XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gIH1cblxuICB2YWxpZGF0ZShmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgYW55IHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVGbihmb3JtQ29udHJvbC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKSA9PiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHZhbHVlOiBNb21lbnRbXSk6IENhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0RnJvbU1vbWVudEFycmF5KFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgdmFsdWUsXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5yZXR1cm5lZFZhbHVlVHlwZSB8fCB0aGlzLmlucHV0VmFsdWVUeXBlXG4gICAgKTtcbiAgfVxuXG4gIGluaXRWYWxpZGF0b3JzKCkge1xuICAgIHRoaXMudmFsaWRhdGVGbiA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZVZhbGlkYXRvcihcbiAgICAgIHttaW5EYXRlOiB0aGlzLm1pbkRhdGUsIG1heERhdGU6IHRoaXMubWF4RGF0ZX0sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICAnZGF5J1xuICAgICk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkKSk7XG4gIH1cblxuICBkYXlDbGlja2VkKGRheTogSURheSkge1xuICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gZGF5LnNlbGVjdGVkO1xuICAgIGNvbnNvbGUubG9nKGRheSlcblxuICAgIGlmIChkYXkuc2VsZWN0ZWQgJiYgIXRoaXMuY29tcG9uZW50Q29uZmlnLnVuU2VsZWN0T25DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgLnVwZGF0ZVNlbGVjdGVkKHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsIHRoaXMuc2VsZWN0ZWQsIGRheSk7XG4gICAgdGhpcy53ZWVrcyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVNb250aEFycmF5KHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5vblNlbGVjdC5lbWl0KGRheSk7XG4gIH1cblxuICBnZXREYXlCdG5UZXh0KGRheTogSURheSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldERheUJ0blRleHQodGhpcy5jb21wb25lbnRDb25maWcsIGRheS5kYXRlKTtcbiAgfVxuXG4gIGdldERheUJ0bkNzc0NsYXNzKGRheTogSURheSk6IHtba2xhc3M6IHN0cmluZ106IGJvb2xlYW59IHtcbiAgICBjb25zdCBjc3NDbGFzc2VzOiB7W2tsYXNzOiBzdHJpbmddOiBib29sZWFufSA9IHtcbiAgICAgICdkcC1zZWxlY3RlZCc6IGRheS5zZWxlY3RlZCxcbiAgICAgICdkcC1jdXJyZW50LW1vbnRoJzogZGF5LmN1cnJlbnRNb250aCxcbiAgICAgICdkcC1wcmV2LW1vbnRoJzogZGF5LnByZXZNb250aCxcbiAgICAgICdkcC1uZXh0LW1vbnRoJzogZGF5Lm5leHRNb250aCxcbiAgICAgICdkcC1jdXJyZW50LWRheSc6IGRheS5jdXJyZW50RGF5XG4gICAgfTtcbiAgICBjb25zdCBjdXN0b21Dc3NDbGFzczogc3RyaW5nID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0RGF5QnRuQ3NzQ2xhc3ModGhpcy5jb21wb25lbnRDb25maWcsIGRheS5kYXRlKTtcbiAgICBpZiAoY3VzdG9tQ3NzQ2xhc3MpIHtcbiAgICAgIGNzc0NsYXNzZXNbY3VzdG9tQ3NzQ2xhc3NdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3NzQ2xhc3NlcztcbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKCkge1xuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMubW92ZUNhbGVuZGFyc0J5KHRoaXMuY3VycmVudERhdGVWaWV3LCAtMSwgJ21vbnRoJyk7XG4gICAgY29uc3QgdG8gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvblJpZ2h0TmF2Q2xpY2soKSB7XG4gICAgY29uc3QgZnJvbSA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5tb3ZlQ2FsZW5kYXJzQnkodGhpcy5jdXJyZW50RGF0ZVZpZXcsIDEsICdtb250aCcpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdCh7ZnJvbSwgdG99KTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhckxlZnRDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhclJpZ2h0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25Nb250aENhbGVuZGFyU2Vjb25kYXJ5TGVmdENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhclNlY29uZGFyeVJpZ2h0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBnZXRXZWVrZGF5TmFtZSh3ZWVrZGF5OiBNb21lbnQpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudENvbmZpZy53ZWVrRGF5Rm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRDb25maWcud2Vla0RheUZvcm1hdHRlcih3ZWVrZGF5LmRheSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2Vla2RheS5mb3JtYXQodGhpcy5jb21wb25lbnRDb25maWcud2Vla0RheUZvcm1hdCk7XG4gIH1cblxuICB0b2dnbGVDYWxlbmRhck1vZGUobW9kZTogRUNhbGVuZGFyTW9kZSkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRDYWxlbmRhck1vZGUgIT09IG1vZGUpIHtcbiAgICAgIHRoaXMuY3VycmVudENhbGVuZGFyTW9kZSA9IG1vZGU7XG4gICAgICB0aGlzLm9uTmF2SGVhZGVyQnRuQ2xpY2suZW1pdChtb2RlKTtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgbW9udGhTZWxlY3RlZChtb250aDogSU1vbnRoKSB7XG4gICAgY29uc29sZS5sb2cobW9udGgpXG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBtb250aC5kYXRlLmNsb25lKCk7XG4gICAgdGhpcy5jdXJyZW50Q2FsZW5kYXJNb2RlID0gRUNhbGVuZGFyTW9kZS5EYXk7XG4gICAgdGhpcy5tb250aElzU2VsZWN0ID0gdHJ1ZTtcbiAgICB0aGlzLm9uTW9udGhTZWxlY3QuZW1pdChtb250aCk7XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJzQnkoY3VycmVudDogTW9tZW50LCBhbW91bnQ6IG51bWJlciwgZ3JhbnVsYXJpdHk6IHVuaXRPZlRpbWUuQmFzZSA9ICdtb250aCcpIHtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IGN1cnJlbnQuY2xvbmUoKS5hZGQoYW1vdW50LCBncmFudWxhcml0eSk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG1vdmVDYWxlbmRhclRvKHRvOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgaWYgKHRvKSB7XG4gICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudCh0bywgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KTtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc2hvdWxkU2hvd0N1cnJlbnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLnNob3VsZFNob3dDdXJyZW50KFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuc2hvd0dvVG9DdXJyZW50LFxuICAgICAgJ2RheScsXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW4sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5tYXhcbiAgICApO1xuICB9XG5cbiAgZ29Ub0N1cnJlbnQoKSB7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBtb21lbnQoKTtcbiAgICB0aGlzLm9uR29Ub0N1cnJlbnQuZW1pdCgpO1xuICB9XG5cbiAgaGFuZGxlQ29uZmlnQ2hhbmdlKGNvbmZpZzogU2ltcGxlQ2hhbmdlKSB7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgY29uc3QgcHJldkNvbmY6IElEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb25mOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyhjb25maWcuY3VycmVudFZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMudXRpbHNTZXJ2aWNlLnNob3VsZFJlc2V0Q3VycmVudFZpZXcocHJldkNvbmYsIGN1cnJlbnRDb25mKSkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RGF0ZVZpZXcgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldkNvbmYubG9jYWxlICE9PSBjdXJyZW50Q29uZi5sb2NhbGUpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudERhdGVWaWV3KSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcubG9jYWxlKGN1cnJlbnRDb25mLmxvY2FsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGVkLmZvckVhY2gobSA9PiBtLmxvY2FsZShjdXJyZW50Q29uZi5sb2NhbGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==