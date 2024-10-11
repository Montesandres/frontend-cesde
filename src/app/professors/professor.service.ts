import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Professor } from './model/professor.interface';
import { UpdateProfessor } from './model/update-professor-interface';
import { enviroment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private readonly _http = inject(HttpClient);
  url = enviroment.serverUrl + "/professors"

  async getAllProfesors(){
    return await firstValueFrom(this._http.get<Professor[]>(this.url));
  }


  async addProfessor(professor:Professor){
    return await firstValueFrom(this._http.post<Professor>(this.url,professor));
  }

  async updateProfessor(professor:UpdateProfessor,id:number){
    return await firstValueFrom(this._http.patch<Professor>(`${this.url}/${id}`,professor));
  }

  async deleteProfessor(id:number){
    return await firstValueFrom(this._http.delete(`${this.url}/${id}`));
  }
}
