import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewChartComponent } from '../../_dialog/view-chart/view-chart.component';
import { Observable } from 'rxjs';
import { ValidateChangeComponent } from '../../_dialog/validate-change/validate-change.component';
import { ViewLineComponent } from '../../_dialog/view-line/view-line.component';
import { ViewPolarComponent } from '../../_dialog/view-polar/view-polar.component';
import { ViewType } from '../../_dialog/view-type';
import { ViewData } from '../../_dialog/view-data';
import { SearchComponent } from '../../_dialog/search/search.component';
import { ValidateDeleteComponent } from '../../_dialog/validate-delete/validate-delete.component';
import { DeleteType } from '../../_dialog/validate-delete/delete-type';
import { CHANGE_STATUS } from '../../_dialog/validate-change/change-status';
import { ChangeType } from '../../_dialog/validate-change/change-type';
import { GenerateType } from '../../_components/generate-table/generete-type';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialogViewChart(data: ViewData, type: ViewType, title: string) {
    const dialogRef = this.dialog.open(ViewChartComponent, {
      data: { data: data, type: type, title: title },
      restoreFocus: false,
    });

    return dialogRef.afterClosed();
  }

  openDialogViewLine(data: ViewData, type: ViewType, title: string) {
    const dialogRef = this.dialog.open(ViewLineComponent, {
      data: { data: data, type: type, title: title },
      restoreFocus: false,
    });

    return dialogRef.afterClosed();
  }

  openDialogViewPolar(data: ViewData, type: ViewType, title: string) {
    const dialogRef = this.dialog.open(ViewPolarComponent, {
      data: { data: data, type: type, title: title },
      restoreFocus: false,
    });
    return dialogRef.afterClosed();
  }

  openDialogDeleteElement(
    selected: GenerateType,
    type: DeleteType
  ): Observable<any> {
    const dialogRef = this.dialog.open(ValidateDeleteComponent, {
      data: { selected: selected, type: type },
      restoreFocus: false,
    });

    return dialogRef.afterClosed();
  }

  openDialogValidateChange(
    key: string,
    type: ChangeType,
    newStatus: CHANGE_STATUS,
    oldStatus: CHANGE_STATUS
  ): Observable<any> {
    const dialogRef = this.dialog.open(ValidateChangeComponent, {
      data: {
        key: key,
        type: type,
        newStatus: newStatus,
        oldStatus: oldStatus,
      },
      restoreFocus: false,
    });
    return dialogRef.afterClosed();
  }

  openDialogSearch() {
    const dialogRef = this.dialog.open(SearchComponent, {
      restoreFocus: false,
    });
    return dialogRef.afterClosed();
  }
}
