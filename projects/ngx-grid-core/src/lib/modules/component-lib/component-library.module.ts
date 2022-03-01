import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRippleModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTooltipModule } from '@angular/material/tooltip'

import { NgInitDirective } from './directives/ng-init.directive'
import { FloatingWindowComponent } from './floating-window/floating-window.component'
import { ResizerComponent } from './resizer/resizer.component'

const materialModules = [
  MatButtonModule,
  MatCheckboxModule,
  MatRippleModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatDividerModule,
  MatSidenavModule,
]

@NgModule({
  declarations: [
    ResizerComponent,
    FloatingWindowComponent,
    NgInitDirective,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ...materialModules
  ],
  exports: [
    ...materialModules,
    DragDropModule,
    ResizerComponent,
    FloatingWindowComponent,
    NgInitDirective,
  ],
  providers: [MatDialogModule]
})
export class ComponentLibraryModule { }
