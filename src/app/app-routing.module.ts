import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListScreenComponent } from './components/list-screen/list-screen.component';

const routes: Routes = [
  { path: '', component: ListScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
