import { UpdateSubject } from './model/updateProfesorDto.interdace';
import { TableModule } from 'primeng/table';
import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { Subject } from './model/subject.interface';
import { SubjectsService } from './subjects.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { Professor } from '../professors/model/professor.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-subjects',
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
  providers: [ConfirmationService, MessageService],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css',
})
export class SubjectsComponent {
  subjects!: Subject[];
  loading: boolean = false;
  modalVisible = false;
  modalTitle = 'Crear Materia';
  modalSubtitle = 'En este formulario puedes crear una nueva Materia';
  professors: Professor[] = [];
  isEditing: boolean = false;
  idSubjectToEdit: number = 0;

  constructor(
    private subjectsService: SubjectsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  subjectForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    duration: new FormControl<number>(0, [Validators.required]),
    price: new FormControl<number>(0, [Validators.required]),
    startDate: new FormControl<Date>(new Date(), [Validators.required]),
    professor: new FormControl<Professor>(
      { name: '', document: '', email: '' },
      [Validators.required]
    ),
  });

  async ngOnInit() {
    this.subjects = await this.subjectsService.getAllSubjects();
    this.professors = await this.subjectsService.getAllProfesors();
  }

  showCreateForm(){
    this.modalTitle = "Crear Materia";
    this.modalSubtitle = "En este formulario puedes crear una nueva Materia"
    this.resetForm();
    this.modalVisible = true;
    this.isEditing = false;
  }

 private resetForm() {
    this.subjectForm.reset({
      name: '',
      description: '',
      duration: 0,
      price: 0,
      startDate: new Date(),
      professor: { name: '', document: '', email: '' },
    });
  }

  async saveSubject() {
    const fecha = this.subjectForm.value.startDate!.toLocaleDateString();
    const parts = fecha.split('/');
    if(parts[1].length == 1){
      parts[1] = "0"+parts[1]
    }
    if(parts[0].length == 1){
      parts[0] = "0"+parts[0]
    }
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    try {
      if (!this.isEditing) {
        const newSubject: UpdateSubject = {
          name: this.subjectForm.value.name ?? '',
          duration: this.subjectForm.value.duration ?? 0,
          price: this.subjectForm.value.price ?? 0,
          startDate: formattedDate,
          description: this.subjectForm.value.description ?? '',
          professorId: this.subjectForm.value.professor?.id!,
        };
        const res = await this.subjectsService.addSubject(newSubject);
        this.subjects.push(res);
        this.modalVisible = false;
      } else {

        const editSubject: UpdateSubject = {
          name: this.subjectForm.value.name ?? '',
          duration: this.subjectForm.value.duration ?? 0,
          price: this.subjectForm.value.price ?? 0,
          startDate: formattedDate,
          description: this.subjectForm.value.description ?? '',
          professorId: this.subjectForm.value.professor?.id!,
        };

        const res = await this.subjectsService.updateSubject(editSubject,this.idSubjectToEdit);

        const indice = this.subjects.findIndex(sub => sub.id == this.idSubjectToEdit);

        this.subjects[indice] = {id: this.idSubjectToEdit, ...editSubject};
        this.modalVisible = false;
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        detail: 'Ha ocurrido un error al añadir la Materia',
      });
    }
  }

  showUpdateSubject(subject: Subject) {
    this.modalTitle = 'Editar Materia';
    this.modalSubtitle = 'En este formulario puedes editar una materia';
    this.isEditing = true;
    this.idSubjectToEdit = subject.id!;
    this.subjectForm.setValue({
      name: subject.name,
      description: subject.description,
      duration: subject.duration,
      price: subject.price,
      professor: subject.professor!,
      startDate: new Date(subject.startDate),
    });
    this.modalVisible = true;
  }

  deleteSubject(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quieres eliminar esta Materia?',
      header: 'COnfirmaciíon de borrado',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: async () => {
        try {
          const res = await this.subjectsService.deleteSubject(id);
          this.messageService.add({
            detail: 'Materia eliminada con exito',
            severity: 'success',
          });

          this.subjects = this.subjects .filter(subject => subject.id !== id);

        } catch (error) {
          this.messageService.add({
            detail: 'Ha ocurrido un error al eliminar',
            severity: 'error',
          });
        }
      },
      reject: () => {},
    });
  }
}
