

import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent  {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabela') grid;

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHanlder: ErrorHandlerService
  ) {}

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pessquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHanlder.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina =  event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
    .then(() => {
      if (this.grid.first === 0) {
        this.pesquisar();
      } else {
        this.grid.first = 0;
      }
      this.messageService.add({
        severity: 'success',
        detail: 'Pessoa excluída com sucesso!'
      });
    })
    .catch(erro => this.errorHanlder.handle(erro));
  }

  atualizarAtivo(pessoa: any ) {
    const novoStatus: boolean = !pessoa.ativo;

    this.pessoaService.atualizarAtivo(pessoa)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Status da Pessoa atualizado com sucesso!'
        });
        pessoa.ativo = novoStatus;
      })
      .catch(erro => this.errorHanlder.handle(erro));
  }

}
