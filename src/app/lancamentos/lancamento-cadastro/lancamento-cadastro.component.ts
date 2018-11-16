import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { Lancamento } from '../../core/model';
import { LancamentoService } from './../lancamento.service';

import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {


  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' }
  ];

  categorias = [];
  pessoas = [];
  // lancamento = new Lancamento();
  formulario: FormGroup;
  uploadEmAndamento = false;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private errorHandlerService: ErrorHandlerService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configurarFormulario();

    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo lancamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  antesUploadAnexo(event) {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    const anexo = JSON.parse(event.xhr.response);

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }

  erroUpload(event) {
    this.messageService.add({ severity: 'error', detail: 'Erro ao tentar enviar anexo' });

    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    const nome =  this.formulario.get('anexo').value;
    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  configurarFormulario() {
    // group(): devolve uma instância de FormGroup
    // o parâmetro é um objeto sonde cada campo é descrito em termos de valor inicial e validação
    this.formulario =  this.formBuilder.group({
      codigo: [],
      tipo: [ 'RECEITA', Validators.required],
      dataVencimento: [ null, Validators.required ],
      dataPagamento: [],
      descricao: [ null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [ null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [ null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }
  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    // const dtVencimento = input.root.get('dataVencimento').value -> retorna o valor de outra campo dependente
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: {tamanho : valor } };
    };
  }

  get editando() {
    // return Boolean(this.lancamento.codigo);
    return Boolean(this.formulario.get('codigo').value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        // this.lancamento = lancamento;
        this.formulario.patchValue(lancamento);
        this.atualizarTituloEdicao();
      }).catch(error => this.errorHandlerService.handle(error));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo}));
      })
      .catch(erro => this.errorHandlerService.handle(erro)) ;
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas().
      then(pessoas => {
        this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo}));
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  salvar () {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then(lanc => {
        this.messageService.add({
          severity: 'success',
          detail: `Lançamento de ${lanc.tipo} adicionado com sucesso!`
        });
        // form.reset();
        // this.lancamento = new Lancamento();
        this.router.navigate(['/lancamentos', lanc.codigo]);

      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService.autalizar(this.formulario.value)
      .then(lanc => {
        // this.lancamento = lanc; // atualiza com os dados possivelmente alterado pelo backend
        this.formulario.patchValue(lanc);
        this.messageService.add({
          severity: 'success',
          detail: `Lancamento de ${lanc.tipo} atualizado com sucesso!`
        });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  novo() {
    this.formulario.reset();
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lancamento: ${this.formulario.get('descricao').value}`);
  }
}
