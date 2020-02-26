import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DayTimeCalendarService } from './day-time-calendar.service';
var DayTimeCalendarComponent = /** @class */ (function () {
    function DayTimeCalendarComponent(dayTimeCalendarService, utilsService, cd) {
        this.dayTimeCalendarService = dayTimeCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.isInited = false;
        this.api = {
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    DayTimeCalendarComponent_1 = DayTimeCalendarComponent;
    Object.defineProperty(DayTimeCalendarComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.onChangeCallback(this.processOnChangeCallback(selected));
        },
        enumerable: true,
        configurable: true
    });
    ;
    DayTimeCalendarComponent.prototype.ngOnInit = function () {
        this.isInited = true;
        this.init();
        this.initValidators();
    };
    DayTimeCalendarComponent.prototype.init = function () {
        this.componentConfig = this.dayTimeCalendarService.getConfig(this.config);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    };
    DayTimeCalendarComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInited) {
            var minDate = changes.minDate, maxDate = changes.maxDate;
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    };
    DayTimeCalendarComponent.prototype.writeValue = function (value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, {
                format: this.componentConfig.format,
                allowMultiSelect: false
            })[0];
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, false);
        }
        else {
            this.selected = null;
        }
        this.cd.markForCheck();
    };
    DayTimeCalendarComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DayTimeCalendarComponent.prototype.onChangeCallback = function (_) {
    };
    DayTimeCalendarComponent.prototype.registerOnTouched = function (fn) {
    };
    DayTimeCalendarComponent.prototype.validate = function (formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return function () { return null; };
        }
    };
    DayTimeCalendarComponent.prototype.processOnChangeCallback = function (value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, [value], this.componentConfig.returnedValueType || this.inputValueType);
    };
    DayTimeCalendarComponent.prototype.initValidators = function () {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate
        }, undefined, 'daytime');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    };
    DayTimeCalendarComponent.prototype.dateSelected = function (day) {
        this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.config);
        this.emitChange();
    };
    DayTimeCalendarComponent.prototype.timeChange = function (time) {
        this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
        this.emitChange();
    };
    DayTimeCalendarComponent.prototype.emitChange = function () {
        this.onChange.emit({ date: this.selected, selected: false });
    };
    DayTimeCalendarComponent.prototype.moveCalendarTo = function (to) {
        if (to) {
            this.dayCalendarRef.moveCalendarTo(to);
        }
    };
    DayTimeCalendarComponent.prototype.onLeftNavClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DayTimeCalendarComponent.prototype.onRightNavClick = function (change) {
        this.onRightNav.emit(change);
    };
    var DayTimeCalendarComponent_1;
    DayTimeCalendarComponent.ctorParameters = function () { return [
        { type: DayTimeCalendarService },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
    tslib_1.__decorate([
        Input()
    ], DayTimeCalendarComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input()
    ], DayTimeCalendarComponent.prototype, "displayDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DayTimeCalendarComponent.prototype, "minDate", void 0);
    tslib_1.__decorate([
        Input()
    ], DayTimeCalendarComponent.prototype, "maxDate", void 0);
    tslib_1.__decorate([
        HostBinding('class'), Input()
    ], DayTimeCalendarComponent.prototype, "theme", void 0);
    tslib_1.__decorate([
        Output()
    ], DayTimeCalendarComponent.prototype, "onChange", void 0);
    tslib_1.__decorate([
        Output()
    ], DayTimeCalendarComponent.prototype, "onGoToCurrent", void 0);
    tslib_1.__decorate([
        Output()
    ], DayTimeCalendarComponent.prototype, "onLeftNav", void 0);
    tslib_1.__decorate([
        Output()
    ], DayTimeCalendarComponent.prototype, "onRightNav", void 0);
    tslib_1.__decorate([
        ViewChild('dayCalendar', { static: false })
    ], DayTimeCalendarComponent.prototype, "dayCalendarRef", void 0);
    DayTimeCalendarComponent = DayTimeCalendarComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'dp-day-time-calendar',
            template: "<dp-day-calendar #dayCalendar\n                 (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                 (onLeftNav)=\"onLeftNavClick($event)\"\n                 (onRightNav)=\"onRightNavClick($event)\"\n                 (onSelect)=\"dateSelected($event)\"\n                 [config]=\"componentConfig\"\n                 [displayDate]=\"displayDate\"\n                 [ngModel]=\"_selected\"\n                 [theme]=\"theme\">\n</dp-day-calendar>\n<dp-time-select #timeSelect\n                (onChange)=\"timeChange($event)\"\n                [config]=\"componentConfig\"\n                [ngModel]=\"_selected\"\n                [theme]=\"theme\">\n</dp-time-select>\n",
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            providers: [
                DayTimeCalendarService,
                DayCalendarService,
                TimeSelectService,
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return DayTimeCalendarComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return DayTimeCalendarComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-day-time-calendar{display:inline-block}dp-day-time-calendar dp-time-select{display:block;border:1px solid #000;border-top:0}dp-day-time-calendar.dp-material dp-time-select{border:1px solid #e0e0e0;border-top:0}"]
        })
    ], DayTimeCalendarComponent);
    return DayTimeCalendarComponent;
}());
export { DayTimeCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLGFBQWEsRUFDYixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBR2xCLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEIsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBRXBFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBRXJFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBMkJuRTtJQWdDRSxrQ0FBbUIsc0JBQThDLEVBQzlDLFlBQTBCLEVBQzFCLEVBQXFCO1FBRnJCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFsQjlCLGFBQVEsR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuRCxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGNBQVMsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxlQUFVLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkUsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUsxQixR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YUFBYTtvQkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsMEJBQXdCLEVBQXhCLENBQXdCLENBQUM7b0JBQ3ZELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7O1NBQ0YsQ0FBQztPQUNXLHdCQUF3QixDQTRJcEM7SUFBRCwrQkFBQztDQUFBLEFBNUlELElBNElDO1NBNUlZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZS1lbnVtJztcbmltcG9ydCB7U2luZ2xlQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUNvbnRyb2wsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtNb21lbnR9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge0NhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF0ZX0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9kYXRlLm1vZGVsJztcbmltcG9ydCB7RGF5Q2FsZW5kYXJTZXJ2aWNlfSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtUaW1lU2VsZWN0U2VydmljZX0gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3Quc2VydmljZSc7XG5pbXBvcnQge0lEYXlUaW1lQ2FsZW5kYXJDb25maWd9IGZyb20gJy4vZGF5LXRpbWUtY2FsZW5kYXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi9kYXktdGltZS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZVZhbGlkYXRvcn0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3ZhbGlkYXRvci50eXBlJztcbmltcG9ydCB7RGF5Q2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7SU5hdkV2ZW50fSBmcm9tICcuLi9jb21tb24vbW9kZWxzL25hdmlnYXRpb24tZXZlbnQubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC1kYXktdGltZS1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50Lmxlc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIERheVRpbWVDYWxlbmRhclNlcnZpY2UsXG4gICAgRGF5Q2FsZW5kYXJTZXJ2aWNlLFxuICAgIFRpbWVTZWxlY3RTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5VGltZUNhbGVuZGFyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5VGltZUNhbGVuZGFyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIERheVRpbWVDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcblxuICBnZXQgc2VsZWN0ZWQoKTogTW9tZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc2VsZWN0ZWQpKTtcbiAgfTtcblxuICBASW5wdXQoKSBjb25maWc6IElEYXlUaW1lQ2FsZW5kYXJDb25maWc7XG4gIEBJbnB1dCgpIGRpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8SURhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAVmlld0NoaWxkKCdkYXlDYWxlbmRhcicsIHtzdGF0aWM6IGZhbHNlfSkgZGF5Q2FsZW5kYXJSZWY6IERheUNhbGVuZGFyQ29tcG9uZW50O1xuICBpc0luaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBjb21wb25lbnRDb25maWc6IElEYXlUaW1lQ2FsZW5kYXJDb25maWc7XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlucHV0VmFsdWVUeXBlOiBFQ2FsZW5kYXJWYWx1ZTtcbiAgdmFsaWRhdGVGbjogRGF0ZVZhbGlkYXRvcjtcbiAgYXBpID0ge1xuICAgIG1vdmVDYWxlbmRhclRvOiB0aGlzLm1vdmVDYWxlbmRhclRvLmJpbmQodGhpcylcbiAgfTtcblxuICBfc2VsZWN0ZWQ6IE1vbWVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF5VGltZUNhbGVuZGFyU2VydmljZTogRGF5VGltZUNhbGVuZGFyU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmlzSW5pdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy5kYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIGZhbHNlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5pc0luaXRlZCkge1xuICAgICAgY29uc3Qge21pbkRhdGUsIG1heERhdGV9ID0gY2hhbmdlcztcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICBpZiAobWluRGF0ZSB8fCBtYXhEYXRlKSB7XG4gICAgICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuY29udmVydFRvTW9tZW50QXJyYXkodmFsdWUsIHtcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgICAgICBhbGxvd011bHRpU2VsZWN0OiBmYWxzZVxuICAgICAgICB9KVswXTtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gIH1cblxuICBvbkNoYW5nZUNhbGxiYWNrKF86IGFueSkge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IGFueSB7XG4gICAgaWYgKHRoaXMubWluRGF0ZSB8fCB0aGlzLm1heERhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRm4oZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCkgPT4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh2YWx1ZTogTW9tZW50KTogQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkoXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICBbdmFsdWVdLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy5pbnB1dFZhbHVlVHlwZVxuICAgICk7XG4gIH1cblxuICBpbml0VmFsaWRhdG9ycygpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm4gPSB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVWYWxpZGF0b3IoXG4gICAgICB7XG4gICAgICAgIG1pbkRhdGU6IHRoaXMubWluRGF0ZSxcbiAgICAgICAgbWF4RGF0ZTogdGhpcy5tYXhEYXRlXG4gICAgICB9LCB1bmRlZmluZWQsICdkYXl0aW1lJyk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkKSk7XG4gIH1cblxuICBkYXRlU2VsZWN0ZWQoZGF5OiBJRGF0ZSkge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmRheVRpbWVDYWxlbmRhclNlcnZpY2UudXBkYXRlRGF5KHRoaXMuc2VsZWN0ZWQsIGRheS5kYXRlLCB0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB0aW1lQ2hhbmdlKHRpbWU6IElEYXRlKSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZGF5VGltZUNhbGVuZGFyU2VydmljZS51cGRhdGVUaW1lKHRoaXMuc2VsZWN0ZWQsIHRpbWUuZGF0ZSk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7ZGF0ZTogdGhpcy5zZWxlY3RlZCwgc2VsZWN0ZWQ6IGZhbHNlfSk7XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyh0bzogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIGlmICh0bykge1xuICAgICAgdGhpcy5kYXlDYWxlbmRhclJlZi5tb3ZlQ2FsZW5kYXJUbyh0byk7XG4gICAgfVxuICB9XG5cbiAgb25MZWZ0TmF2Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvblJpZ2h0TmF2Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG59XG4iXX0=