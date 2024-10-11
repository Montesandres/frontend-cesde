import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Subject } from './model/subject.interface';
import { Professor } from '../professors/model/professor.interface';
import { UpdateSubject } from './model/updateProfesorDto.interdace';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  private readonly _http = inject(HttpClient);

  async getAllSubjects(){
    try{
      return await firstValueFrom(this._http.get<Subject[]>('http://localhost:3000/subjects'));
    }catch(error){
      throw Error(`Error al consultar: ${error}`, )
    }
  }

  async deleteSubject(id:number){
    return await firstValueFrom(this._http.delete(`http://localhost:3000/subjects/${id}`));
  }

  async addSubject(subject:Subject){
    return await firstValueFrom(this._http.post<Subject>(`http://localhost:3000/subjects`,subject));
  }

  async getAllProfesors(){
    return await firstValueFrom(this._http.get<Professor[]>(`http://localhost:3000/professors`));
  }

  async updateSubject(subject:UpdateSubject,id:number){
    return await firstValueFrom(this._http.patch<Subject>(`http://localhost:3000/subjects/${id}`,subject));
  }
}
