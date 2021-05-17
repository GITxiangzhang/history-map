import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HistoryComponent} from './history/history.compontent';
import {MapComponent} from './map/map.component';

const routes: Routes = [
  {path: '', redirectTo: 'map', pathMatch: 'full'},
  {path: 'map', component: MapComponent},
  {path: 'history', component: HistoryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
