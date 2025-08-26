import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Announcement } from '../models/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = '/api/annonces';
  
  // Mock data for testing
  private mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Développeur Full Stack Angular/Node.js',
      description: 'Nous recherchons un développeur expérimenté pour rejoindre notre équipe. Compétences requises: Angular, Node.js, TypeScript, et MongoDB.',
      date: new Date(),
      category: 'Emploi',
      averageRating: 4.8
    },
    {
      id: '2',
      title: 'Appartement T3 Centre-Ville',
      description: 'Bel appartement lumineux de 75m², proche des commerces et transports. Entièrement rénové, cuisine équipée, 2 chambres, grand salon.',
      date: new Date(Date.now() - 86400000), // Yesterday
      category: 'Immobilier',
      averageRating: 4.2
    },
    {
      id: '3',
      title: 'Formation JavaScript Avancé',
      description: 'Formation intensive de 5 jours sur JavaScript moderne, TypeScript et Angular. Places limitées à 10 participants.',
      date: new Date(Date.now() - 172800000), // 2 days ago
      category: 'Formation',
      averageRating: 4.9
    },
    {
      id: '4',
      title: 'MacBook Pro 16" M2 Pro',
      description: 'MacBook Pro 16 pouces, puce M2 Pro, 32Go RAM, 1To SSD. Sous garantie Apple Care+. Parfait état, facture disponible.',
      date: new Date(Date.now() - 259200000), // 3 days ago
      category: 'Matériel',
      averageRating: 4.6
    },
    {
      id: '5',
      title: 'Coworking Space - Open Day',
      description: 'Journée portes ouvertes dans notre nouvel espace de coworking. Venez découvrir nos installations et rencontrer notre communauté.',
      date: new Date(Date.now() + 604800000), // Next week
      category: 'Événement',
      averageRating: 4.7
    }
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Announcement[]> {
    // TODO: Replace with actual API call
    return of(this.mockAnnouncements);
  }

  getById(id: string): Observable<Announcement | undefined> {
    // TODO: Replace with actual API call
    return of(this.mockAnnouncements.find(a => a.id === id));
  }

  create(announcement: Omit<Announcement, 'id'>): Observable<Announcement> {
    // TODO: Replace with actual API call
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
    };
    this.mockAnnouncements.push(newAnnouncement);
    return of(newAnnouncement);
  }

  update(id: string, announcement: Announcement): Observable<Announcement> {
    // TODO: Replace with actual API call
    const index = this.mockAnnouncements.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAnnouncements[index] = announcement;
      return of(announcement);
    }
    throw new Error('Announcement not found');
  }

  delete(id: string): Observable<void> {
    // TODO: Replace with actual API call
    const index = this.mockAnnouncements.findIndex(a => a.id === id);
    if (index !== -1) {
      this.mockAnnouncements.splice(index, 1);
    }
    return of(void 0);
  }

  search(criteria: string): Observable<Announcement[]> {
    // TODO: Replace with actual API call
    return of(this.mockAnnouncements.filter(a => 
      a.title.toLowerCase().includes(criteria.toLowerCase()) ||
      a.description.toLowerCase().includes(criteria.toLowerCase())
    ));
  }
}
