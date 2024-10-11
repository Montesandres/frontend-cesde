import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Subject } from './model/subject.interface';
import { Professor } from '../professors/model/professor.interface';
import { UpdateSubject } from './model/updateProfesorDto.interdace';
import { enviroment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  url = enviroment.serverUrl + "/subjects"

  private readonly _http = inject(HttpClient);

  async getAllSubjects(){
    console.log(this.url)
    try{
      return await firstValueFrom(this._http.get<Subject[]>(this.url));
    }catch(error){
      throw Error(`Error al consultar: ${error}`, )
    }
  }

  async deleteSubject(id:number){
    return await firstValueFrom(this._http.delete(`${this.url}/${id}`));
  }

  async addSubject(subject:Subject){
    return await firstValueFrom(this._http.post<Subject>(this.url,subject));
  }

  async getAllProfesors(){
    return await firstValueFrom(this._http.get<Professor[]>(`${enviroment.serverUrl}/professors`));
  }

  async updateSubject(subject:UpdateSubject,id:number){
    return await firstValueFrom(this._http.patch<Subject>(`${this.url}/${id}`,subject));
  }
}
