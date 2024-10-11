import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Professor } from './model/professor.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProfessorService } from './professor.service';
import { UpdateProfessor } from './model/update-professor-interface';

@Component({
  selector: 'app-professors',
  standalone: true,
  imports: [
    ToastModule,
    ConfirmDialogModule,
    MessageModule,
    ButtonModule,
    TableModule,
    DialogModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    CommonModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './professors.component.html',
  styleUrl: './professors.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ProfessorsComponent {
  professors: Professor[] = [];
  loading: boolean = false;
  modalVisible = false;
  isEditing = false;
  idProfessorToEdit = 0;

  modalTitle = 'Crear Nuevo Docente';
  modalSubtitle = 'En este formulario puedes crear un nuevo docente';

  constructor(
    private professorService: ProfessorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  professorForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    document: new FormControl<string>('', [
      Validators.required,
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  async ngOnInit() {
    this.professors = await this.professorService.getAllProfesors();
  }

  showCreateForm() {
    this.resetForm();
    this.modalTitle = 'Crear Nuevo Docente';
    this.modalSubtitle = 'En este formulario puedes crear un nuevo docente';
    this.modalVisible = true;
    this.isEditing = false;
  }

  showUpdateSubject(professor: Professor) {
    this.modalTitle = 'Editar Docente';
    this.modalSubtitle = 'En este formulario puedes editar a un docente';
    this.isEditing = true;
    this.modalVisible = true;
    this.idProfessorToEdit = professor.id!;
    this.professorForm.setValue({
      name: professor.name,
      document: professor.document,
      email: professor.email
    });

  }

  deleteSubject(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quieres eliminar el docente?',
      header: 'Confirmaciíon de borrado',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: async () => {
        try {
          const res = await this.professorService.deleteProfessor(id);
          this.messageService.add({
            detail: 'Docente eliminado con exito',
            severity: 'success',
          });

          this.professors = this.professors.filter(professor => professor.id !== id);

        } catch (error:any) {
          console.log(error)
          this.messageService.add({
            detail: error.error.message,
            severity: 'error',
          });
        }
      },
      reject: () => {},
    });
  }

  private resetForm() {
    this.professorForm.reset({
      name: '',
      document: '',
      email: ''
    });
  }

  async saveSubject() {
    try {
      if (!this.isEditing) {
        const newProfessor: Professor = {
          name: this.professorForm.value.name ?? '',
          document: this.professorForm.value.document ?? '',
          email: this.professorForm.value.email ?? '',
        };
        const res = await this.professorService.addProfessor(newProfessor);
        this.professors.push(res);
        this.modalVisible = false;
        this.resetForm();
      } else {

        const editProfessor: UpdateProfessor = {
          name: this.professorForm.value.name ?? '',
          email: this.professorForm.value.email ?? '',
        };

        const res = await this.professorService.updateProfessor(
          editProfessor,
          this.idProfessorToEdit
        );

        const indice = this.professors.findIndex(prof => prof.id == this.idProfessorToEdit);

       this.professors[indice] = {id:this.idProfessorToEdit,document:this.professors[indice].document  ,...editProfessor};
       this.modalVisible = false;
        this.resetForm();
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        detail: 'Ha ocurrido un error al añadir la Materia',
      });
    }
  }
}
