import * as tslib_1 from "tslib";
var DayTimeCalendarComponent_1;
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DayTimeCalendarService } from './day-time-calendar.service';
let DayTimeCalendarComponent = DayTimeCalendarComponent_1 = class DayTimeCalendarComponent {
    constructor(dayTimeCalendarService, utilsService, cd) {
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
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.dayTimeCalendarService.getConfig(this.config);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate } = changes;
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
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate
        }, undefined, 'daytime');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dateSelected(day) {
        this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.config);
        this.emitChange();
    }
    timeChange(time) {
        this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
        this.emitChange();
    }
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
    }
    moveCalendarTo(to) {
        if (to) {
            this.dayCalendarRef.moveCalendarTo(to);
        }
    }
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
};
DayTimeCalendarComponent.ctorParameters = () => [
    { type: DayTimeCalendarService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
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
                useExisting: forwardRef(() => DayTimeCalendarComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => DayTimeCalendarComponent_1),
                multi: true
            }
        ],
        styles: ["dp-day-time-calendar{display:inline-block}dp-day-time-calendar dp-time-select{display:block;border:1px solid #000;border-top:0}dp-day-time-calendar.dp-material dp-time-select{border:1px solid #e0e0e0;border-top:0}"]
    })
], DayTimeCalendarComponent);
export { DayTimeCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBR3hCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUN4RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVyRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQTJCbkUsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBZ0NuQyxZQUFtQixzQkFBOEMsRUFDOUMsWUFBMEIsRUFDMUIsRUFBcUI7UUFGckIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUM5QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQWxCOUIsYUFBUSxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkQsY0FBUyxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3hELGVBQVUsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztR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O2FBQ1o7U0FDRjs7S0FDRixDQUFDO0dBQ1csd0JBQXdCLENBNElwQztTQTVJWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUtZW51bSc7XG5pbXBvcnQge1NpbmdsZUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zaW5nbGUtY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Db250cm9sLFxuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdGlvbkVycm9ycyxcbiAgVmFsaWRhdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7SURhdGV9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvZGF0ZS5tb2RlbCc7XG5pbXBvcnQge0RheUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCB7VGltZVNlbGVjdFNlcnZpY2V9IGZyb20gJy4uL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF5VGltZUNhbGVuZGFyQ29uZmlnfSBmcm9tICcuL2RheS10aW1lLWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4vZGF5LXRpbWUtY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge0RheUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZHAtZGF5LXRpbWUtY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudC5sZXNzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICBEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLFxuICAgIERheUNhbGVuZGFyU2VydmljZSxcbiAgICBUaW1lU2VsZWN0U2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERheVRpbWVDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERheVRpbWVDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkOiBNb21lbnQpIHtcbiAgICB0aGlzLl9zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKSk7XG4gIH07XG5cbiAgQElucHV0KCkgY29uZmlnOiBJRGF5VGltZUNhbGVuZGFyQ29uZmlnO1xuICBASW5wdXQoKSBkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWF4RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPElEYXRlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uR29Ub0N1cnJlbnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGVmdE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblJpZ2h0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQFZpZXdDaGlsZCgnZGF5Q2FsZW5kYXInLCB7c3RhdGljOiBmYWxzZX0pIGRheUNhbGVuZGFyUmVmOiBEYXlDYWxlbmRhckNvbXBvbmVudDtcbiAgaXNJbml0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29tcG9uZW50Q29uZmlnOiBJRGF5VGltZUNhbGVuZGFyQ29uZmlnO1xuICBpbnB1dFZhbHVlOiBDYWxlbmRhclZhbHVlO1xuICBpbnB1dFZhbHVlVHlwZTogRUNhbGVuZGFyVmFsdWU7XG4gIHZhbGlkYXRlRm46IERhdGVWYWxpZGF0b3I7XG4gIGFwaSA9IHtcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpXG4gIH07XG5cbiAgX3NlbGVjdGVkOiBNb21lbnQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRheVRpbWVDYWxlbmRhclNlcnZpY2U6IERheVRpbWVDYWxlbmRhclNlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pc0luaXRlZCA9IHRydWU7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbXBvbmVudENvbmZpZyA9IHRoaXMuZGF5VGltZUNhbGVuZGFyU2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcpO1xuICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZS5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCBmYWxzZSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHRoaXMuaXNJbml0ZWQpIHtcbiAgICAgIGNvbnN0IHttaW5EYXRlLCBtYXhEYXRlfSA9IGNoYW5nZXM7XG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgaWYgKG1pbkRhdGUgfHwgbWF4RGF0ZSkge1xuICAgICAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB7XG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICAgICAgYWxsb3dNdWx0aVNlbGVjdDogZmFsc2VcbiAgICAgICAgfSlbMF07XG4gICAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgb25DaGFuZ2VDYWxsYmFjayhfOiBhbnkpIHtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgfVxuXG4gIHZhbGlkYXRlKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBhbnkge1xuICAgIGlmICh0aGlzLm1pbkRhdGUgfHwgdGhpcy5tYXhEYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZuKGZvcm1Db250cm9sLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgpID0+IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodmFsdWU6IE1vbWVudCk6IENhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0RnJvbU1vbWVudEFycmF5KFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgW3ZhbHVlXSxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnJldHVybmVkVmFsdWVUeXBlIHx8IHRoaXMuaW5wdXRWYWx1ZVR5cGVcbiAgICApO1xuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKSB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge1xuICAgICAgICBtaW5EYXRlOiB0aGlzLm1pbkRhdGUsXG4gICAgICAgIG1heERhdGU6IHRoaXMubWF4RGF0ZVxuICAgICAgfSwgdW5kZWZpbmVkLCAnZGF5dGltZScpO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZCkpO1xuICB9XG5cbiAgZGF0ZVNlbGVjdGVkKGRheTogSURhdGUpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLnVwZGF0ZURheSh0aGlzLnNlbGVjdGVkLCBkYXkuZGF0ZSwgdGhpcy5jb25maWcpO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgdGltZUNoYW5nZSh0aW1lOiBJRGF0ZSkge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmRheVRpbWVDYWxlbmRhclNlcnZpY2UudXBkYXRlVGltZSh0aGlzLnNlbGVjdGVkLCB0aW1lLmRhdGUpO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe2RhdGU6IHRoaXMuc2VsZWN0ZWQsIHNlbGVjdGVkOiBmYWxzZX0pO1xuICB9XG5cbiAgbW92ZUNhbGVuZGFyVG8odG86IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICBpZiAodG8pIHtcbiAgICAgIHRoaXMuZGF5Q2FsZW5kYXJSZWYubW92ZUNhbGVuZGFyVG8odG8pO1xuICAgIH1cbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxufVxuIl19