import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  mostrarModalRecuperarSenha = false;
  loadingRecuperacao = false;
  emailRecuperacaoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.emailRecuperacaoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  abrirModalRecuperarSenha(event: Event) {
    event.preventDefault();
    this.mostrarModalRecuperarSenha = true;
  }

  onModalHide() {
    this.emailRecuperacaoForm.reset();
    this.mostrarModalRecuperarSenha = false;
  }

  solicitarNovaSenha() {
    if (this.emailRecuperacaoForm.invalid) {
      return;
    }

    const email = this.emailRecuperacaoForm.value.email;
    this.loadingRecuperacao = true;

    this.authService.solicitarRecuperacaoSenha(email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'E-mail enviado',
          detail: 'Verifique sua caixa de entrada para a nova senha.'
        });
        this.loadingRecuperacao = false;
        this.onModalHide();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Não foi possível enviar o e-mail.'
        });
        this.loadingRecuperacao = false;
        this.onModalHide();
      }
    });
  }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos corretamente.'
      });
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', `${response.tokenType} ${response.token}`);
        localStorage.setItem('firstAccess', JSON.stringify(response.firstAccess));
        localStorage.setItem('termsAccepted', JSON.stringify(response.termsAccepted));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Usuário ou senha inválidos.'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
