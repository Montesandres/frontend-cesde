import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Professor } from './model/professor.interface';
import { UpdateProfessor } from './model/update-professor-interface';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private readonly _http = inject(HttpClient);

  async getAllProfesors(){
    return await firstValueFrom(this._http.get<Professor[]>(`http://localhost:3000/professors`));
  }


  async addProfessor(professor:Professor){
    return await firstValueFrom(this._http.post<Professor>(`http://localhost:3000/professors`,professor));
  }

  async updateProfessor(professor:UpdateProfessor,id:number){
    return await firstValueFrom(this._http.patch<Professor>(`http://localhost:3000/professors/${id}`,professor));
  }

  async deleteProfessor(id:number){
    return await firstValueFrom(this._http.delete(`http://localhost:3000/professors/${id}`));
  }
}
