export interface Termin {
    _id?: string;     //MongoDB-ID
    userId: string;  // Link zu User 
    typId: string;  // Link zu StandardVorsorgeTypen
    datum: string;
    notiz: string;
}
