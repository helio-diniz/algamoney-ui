import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/components/common/messageservice';

import { Pessoa, Contato } from './../../core/model';
import { PessoaService } from './../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent {
  pessoa = new Pessoa();
  estados: any[];
  cidades: any[];
  estadoSelecionado: number;

  constructor(
    private pessoaService: PessoaService,
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    const codigoPessoa = this.route.snapshot.params['codigo'];
    this.title.setTitle('Nova pessoa');
    this.carregarEstados();

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
  }

  carregarEstados() {
    this.pessoaService.listarEstados().then(lista => {
      this.estados = lista.map(uf => ({ label: uf.nome, value: uf.codigo }));
    }).catch(erro => this.errorHandlerService.handle(erro));
  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado).then(lista => {
      this.cidades = lista.map(c => ({ label: c.nome, value: c.codigo }));
    }).catch(erro => this.errorHandlerService.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarPessaoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pess => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa adicionada com sucesso!'
        });
        this.router.navigate(['/pessoas', pess.codigo]);
      }).catch(erro => this.errorHandlerService.handle(erro));
  }

  atualizarPessaoa(form: NgForm) {
    this.pessoaService.atualizar(this.pessoa)
      .then(pess => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa atualizada com sucesso!'
        });
        this.atualizarTituloEdicao();
      }).catch(erro => this.errorHandlerService.handle(erro));
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
      .then(pessoaBuscada => {
        this.pessoa = pessoaBuscada;

        this.estadoSelecionado = (this.pessoa.endereco.cidade) ?
          this.pessoa.endereco.cidade.estado.codigo : null;
        if (this.estadoSelecionado) {
          this.carregarCidades();
        }

          this.atualizarTituloEdicao();
      })
      .catch(error => this.errorHandlerService.handle(error));
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição da Pessoa: ${this.pessoa.nome}`);
  }

}
