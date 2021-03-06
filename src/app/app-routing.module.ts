import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';


const routes: Routes = [
  { path: 'lancamentos', loadChildren: 'app/lancamentos/lancamentos.module#LancamentosModule' },
  { path: 'pessoas', loadChildren: 'app/pessoas/pessoas.module#PessoasModule' },
  { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule'},
  { path: 'relatorios', loadChildren: 'app/relatorios/relatorios.module#RelatoriosModule'},

  { path: '' , redirectTo: 'login', pathMatch: 'full' },
  // pathMatch tem valor padrão prefix (prefixo do caminho) e full (caminho total)
  { path: 'nao-autorizado' , component: NaoAutorizadoComponent },
  { path: 'pagina-nao-encontrada' , component: PaginaNaoEncontradaComponent },
  { path: '**' , redirectTo: 'pagina-nao-encontrada' }
  // ** significa qualquer página diferente das demais; sempre coloca por último
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    // forRoot: configuração de rotas em módulo razi
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
